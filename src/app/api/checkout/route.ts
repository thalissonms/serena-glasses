/**
 * API Route: POST /api/checkout — cria pedido e processa pagamento via Mercado Pago.
 *
 * Sem orderId: cria order + chama MP (fluxo original).
 * Com orderId: modo retry — valida tentativas, muda status para pending, chama MP de novo.
 * Contador payment_attempts incrementado apenas para payment_method=card.
 * coupon_usages inserido só na aprovação (não antes do MP), com guard de duplicação.
 *
 * Usado em: src/app/checkout/page.tsx.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { getMpPayment } from "@shared/lib/mercadopago/server";
import { checkStockAvailability } from "@features/checkout/services/stockAvailability.service";
import { validateCoupon } from "@features/coupons/services/couponValidation.service";
import { PaymentMethod } from "@features/checkout/enums/checkout.enum";
import { BrazilianState } from "@shared/location/location.enum";
import {
  sendOrderConfirmationEmail,
  sendOrderReceivedEmail,
} from "@features/emails/services/sendOrderEmail";
import { calculateShippingOptions } from "@shared/lib/melhor-envio/shipping";
import { lookupCep } from "@shared/lib/viacep";
import { slugifyCity } from "@shared/utils/slugifyCity";
import { classifyMpError, userMessageFor, MAX_ATTEMPTS } from "@features/checkout/services/paymentRetry";

const checkoutBodySchema = z.object({
  orderId: z.string().uuid().optional(),
  formData: z.object({
    identification: z.object({
      fullName: z.string().min(2),
      cpf: z.string().length(14),
      email: z.string().email(),
      phone: z.string().min(8),
    }),
    address: z.object({
      cep: z.string().length(9),
      street: z.string().min(2),
      number: z.string().min(1),
      complement: z.string().optional(),
      neighborhood: z.string().min(2),
      city: z.string().min(2),
      state: z.enum(Object.values(BrazilianState) as [BrazilianState, ...BrazilianState[]]),
    }),
    payment: z.object({
      method: z.enum([PaymentMethod.Card, PaymentMethod.PIX, PaymentMethod.Boleto]),
      installments: z.string().optional(),
    }),
  }),
  items: z
    .array(
      z.object({
        variantId: z.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i),
        productId: z.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i),
        name: z.string().min(1),
        price: z.number().positive(),
        quantity: z.number().int().min(1).max(20),
        image: z.string(),
        color: z.object({ name: z.string(), hex: z.string() }),
        slug: z.string(),
      }),
    )
    .min(1)
    .max(50),
  couponCode: z.string().nullable().optional(),
  anonymousId: z.string().optional(),
  shippingServiceId: z.number().int().positive(),
  shippingServiceName: z.string().min(1),
  shippingPrice: z.number().min(0),
  cardToken: z.string().optional(),
  cardPaymentMethodId: z.string().optional(),
  cardInstallments: z.number().int().min(1).max(12).optional(),
});

function generateOrderNumber(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "SRN-";
  for (let i = 0; i < 8; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function buildMpPayer(identification: {
  fullName: string;
  email: string;
  cpf: string;
}) {
  const [first, ...rest] = identification.fullName.split(" ");
  return {
    email: identification.email,
    first_name: first,
    last_name: rest.join(" ") || first,
    identification: { type: "CPF", number: identification.cpf.replace(/\D/g, "") },
  };
}

function getNotificationUrl(): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.VERCEL_URL ?? "";
  const baseUrl = base.startsWith("http") ? base : `https://${base}`;
  return `${baseUrl}/api/webhooks/mercadopago`;
}

// PIX QR codes expire after 30 min (BR standard); Boleto expires after 2 days.
const PIX_WINDOW_MS    = 30 * 60 * 1000;
const BOLETO_WINDOW_MS = 2 * 24 * 60 * 60 * 1000;

async function insertCouponUsageIfNeeded(
  orderId: string,
  couponId: string,
  email: string,
  discountCents: number,
) {
  const { count } = await getSupabaseServer()
    .from("coupon_usages")
    .select("id", { count: "exact", head: true })
    .eq("order_id", orderId);

  if (!count || count === 0) {
    await getSupabaseServer().from("coupon_usages").insert({
      coupon_id: couponId,
      order_id: orderId,
      email: email.toLowerCase().trim(),
      discount_applied_cents: discountCents,
    });
  }
}

async function cancelOrder(orderId: string, reason: string) {
  await getSupabaseServer()
    .from("orders")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
      cancel_reason: reason,
    })
    .eq("id", orderId);
}

export async function POST(request: NextRequest) {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = checkoutBodySchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const {
    orderId: retryOrderId,
    formData,
    items,
    couponCode,
    anonymousId,
    shippingServiceId,
    shippingServiceName,
    shippingPrice,
    cardToken,
    cardPaymentMethodId,
    cardInstallments,
  } = parsed.data;
  const { identification, address, payment } = formData;

  if (payment.method === PaymentMethod.Card && !cardToken) {
    return NextResponse.json({ error: "Token do cartão ausente." }, { status: 400 });
  }

  // ─── Modo retry: orderId fornecido ────────────────────────────────────────
  if (retryOrderId) {
    const { data: existingOrder, error: fetchError } = await getSupabaseServer()
      .from("orders")
      .select("id, status, payment_attempts, order_number, full_name, email, coupon_code, discount, payment_method, total")
      .eq("id", retryOrderId)
      .single();

    if (fetchError || !existingOrder) {
      return NextResponse.json({ error: "Pedido não encontrado." }, { status: 404 });
    }

    if (existingOrder.status === "paid") {
      return NextResponse.json(
        { ok: false, kind: "cancelled", orderId: retryOrderId, attempts: existingOrder.payment_attempts, maxAttempts: MAX_ATTEMPTS, errorMessage: "Pedido já pago." },
        { status: 422 },
      );
    }

    if (existingOrder.status === "cancelled") {
      return NextResponse.json(
        { ok: false, kind: "cancelled", orderId: retryOrderId, attempts: existingOrder.payment_attempts, maxAttempts: MAX_ATTEMPTS, errorMessage: "Pedido cancelado." },
        { status: 422 },
      );
    }

    if (existingOrder.payment_attempts >= MAX_ATTEMPTS) {
      await cancelOrder(retryOrderId, "payment_attempts_exhausted");
      return NextResponse.json(
        {
          ok: false,
          kind: "cancelled",
          orderId: retryOrderId,
          attempts: existingOrder.payment_attempts,
          maxAttempts: MAX_ATTEMPTS,
          errorMessage: "Pedido cancelado após múltiplas falhas de pagamento. Você pode criar um novo pedido com outro cartão.",
        },
        { status: 422 },
      );
    }

    // Volta para pending antes de chamar o MP
    await getSupabaseServer()
      .from("orders")
      .update({ status: "pending" })
      .eq("id", retryOrderId);

    const nextAttempt = existingOrder.payment_attempts + 1;
    const idempotencyKey = `${retryOrderId}-${nextAttempt}`;
    const payer = buildMpPayer(identification);
    const orderNumber = existingOrder.order_number;
    const firstName = payer.first_name;

    try {
      const mpRes = await getMpPayment().create({
        body: {
          transaction_amount: existingOrder.total / 100,
          description: `Serena Glasses #${orderNumber}`,
          token: cardToken,
          payment_method_id: cardPaymentMethodId,
          installments: Number(cardInstallments ?? 1),
          external_reference: retryOrderId,
          notification_url: getNotificationUrl(),
          payer,
        },
        requestOptions: { idempotencyKey },
      });

      // Incrementa payment_attempts (independente de sucesso/falha)
      await getSupabaseServer()
        .from("orders")
        .update({ payment_attempts: nextAttempt, mp_payment_id: String(mpRes.id) })
        .eq("id", retryOrderId);

      const mpStatus = mpRes.status;

      if (mpStatus === "approved") {
        await getSupabaseServer()
          .from("orders")
          .update({ status: "paid", paid_at: new Date().toISOString() })
          .eq("id", retryOrderId);

        if (existingOrder.coupon_code && existingOrder.discount > 0) {
          const { data: coupon } = await getSupabaseServer()
            .from("coupons")
            .select("id")
            .eq("code", existingOrder.coupon_code)
            .single();

          if (coupon) {
            await insertCouponUsageIfNeeded(retryOrderId, coupon.id, existingOrder.email, existingOrder.discount);
          }
        }

        await sendOrderConfirmationEmail({
          orderNumber,
          name: firstName,
          email: existingOrder.email,
          orderId: retryOrderId,
        }).catch((err) => console.error("[checkout/retry] email error:", err));

        return NextResponse.json({
          ok: true,
          kind: "approved",
          orderId: retryOrderId,
          orderNumber,
          attempts: nextAttempt,
          maxAttempts: MAX_ATTEMPTS,
          payment: { type: "card", status: "approved" },
        });
      }

      if (mpStatus === "rejected") {
        const statusDetail = (mpRes).status_detail ?? "cc_rejected_other_reason";
        const kind = classifyMpError(statusDetail);

        await getSupabaseServer()
          .from("orders")
          .update({
            status: kind === "definitive_rejection" ? "cancelled" : "payment_failed",
            ...(kind === "definitive_rejection" && { cancelled_at: new Date().toISOString(), cancel_reason: "payment_attempts_exhausted" }),
            payment_error: { status_detail: statusDetail, mp_status: mpStatus },
          })
          .eq("id", retryOrderId);

        const shouldCancelAfterMaxAttempts = nextAttempt >= MAX_ATTEMPTS && kind === "data_error";
        if (shouldCancelAfterMaxAttempts) {
          await cancelOrder(retryOrderId, "payment_attempts_exhausted");
        }

        const isCancelled = kind === "definitive_rejection" || shouldCancelAfterMaxAttempts;

        return NextResponse.json({
          ok: false,
          kind: isCancelled ? "cancelled" : kind,
          orderId: retryOrderId,
          attempts: nextAttempt,
          maxAttempts: MAX_ATTEMPTS,
          errorMessage: isCancelled
            ? "Pedido cancelado após múltiplas falhas de pagamento. Você pode criar um novo pedido com outro cartão."
            : userMessageFor(kind, nextAttempt),
        }, { status: 422 });
      }

      // in_process / pending
      return NextResponse.json({
        ok: true,
        kind: "approved",
        orderId: retryOrderId,
        orderNumber,
        attempts: nextAttempt,
        maxAttempts: MAX_ATTEMPTS,
        payment: { type: "card", status: mpStatus },
      });
    } catch (mpErr: unknown) {
      const errMsg = mpErr instanceof Error ? mpErr.message : String(mpErr);
      await getSupabaseServer()
        .from("orders")
        .update({ status: "payment_failed", payment_error: { message: errMsg } })
        .eq("id", retryOrderId);

      return NextResponse.json(
        { error: "Erro ao processar pagamento. Tente novamente." },
        { status: 502 },
      );
    }
  }

  // ─── Fluxo original: criação de novo pedido ───────────────────────────────

  const shortages = await checkStockAvailability(
    items.map((i) => ({ variantId: i.variantId, quantity: i.quantity, productName: i.name })),
  );
  if (shortages.length > 0) {
    return NextResponse.json({ error: "Estoque insuficiente", shortages }, { status: 409 });
  }

  const variantIds = items.map((i) => i.variantId);
  const { data: dbVariants, error: priceError } = await getSupabaseServer()
    .from("product_variants")
    .select("id, products(price, weight)")
    .in("id", variantIds);

  if (priceError || !dbVariants) {
    return NextResponse.json({ error: "Failed to verify prices" }, { status: 500 });
  }

  const dbPriceByCentavos: Record<string, number> = {};
  const dbWeightByVariant: Record<string, number> = {};
  for (const v of dbVariants) {
    const product = Array.isArray(v.products) ? v.products[0] : v.products;
    if (product && typeof product.price === "number") {
      dbPriceByCentavos[v.id] = Math.round(product.price);
    }
    if (product && typeof (product as { weight?: number }).weight === "number") {
      dbWeightByVariant[v.id] = (product as { weight: number }).weight;
    }
  }

  if (items.some((i) => dbPriceByCentavos[i.variantId] == null)) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }

  const missingWeight = items.find((i) => dbWeightByVariant[i.variantId] == null);
  if (missingWeight) {
    console.error("[checkout] weight not set for variant:", missingWeight.variantId);
    return NextResponse.json({ error: "Produto sem peso cadastrado — contate suporte" }, { status: 500 });
  }

  const serverSubtotal = items.reduce(
    (sum, i) => sum + dbPriceByCentavos[i.variantId] * i.quantity,
    0,
  );

  let serverDiscount = 0;
  let appliedCouponId: string | null = null;
  let isFreeShippingCoupon = false;

  if (couponCode) {
    const couponResult = await validateCoupon({
      code: couponCode,
      items: items.map((i) => ({ variantId: i.variantId, productId: i.productId, quantity: i.quantity })),
      email: identification.email,
      cpf: identification.cpf,
    });

    if (!couponResult.ok) {
      return NextResponse.json({ error: `Cupom inválido: ${couponResult.error}` }, { status: 400 });
    }

    serverDiscount = couponResult.coupon.discount_applied_cents;
    appliedCouponId = couponResult.coupon.coupon_id;
    isFreeShippingCoupon = couponResult.coupon.discount_type === "free_shipping";
  }

  let serverShipping = 0;
  try {
    const resolvedVariants = items.map((i) => ({
      variantId: i.variantId,
      quantity: i.quantity,
      weightG: dbWeightByVariant[i.variantId],
      priceCents: dbPriceByCentavos[i.variantId],
    }));
    const cepInfo = await lookupCep(address.cep);
    const citySlug = cepInfo ? slugifyCity(cepInfo.city, cepInfo.state) : undefined;
    const options = await calculateShippingOptions(address.cep, resolvedVariants, citySlug);
    const matchedOption = options.find((o) => o.id === shippingServiceId);

    if (!matchedOption) {
      return NextResponse.json({ error: "Opção de frete inválida." }, { status: 400 });
    }
    const expectedPrice = isFreeShippingCoupon ? 0 : matchedOption.price;
    if (Math.abs(expectedPrice - shippingPrice) > 1) {
      return NextResponse.json({ error: "Preço de frete divergente. Refaça a cotação." }, { status: 400 });
    }
    serverShipping = expectedPrice;
  } catch (err) {
    console.error("[checkout] shipping validation:", err instanceof Error ? err.message : String(err));
    return NextResponse.json({ error: "Erro ao validar frete. Tente novamente." }, { status: 502 });
  }

  const serverTotal = Math.max(0, serverSubtotal - serverDiscount + serverShipping);
  const orderNumber = generateOrderNumber();

  const now = Date.now();
  const expiresAt =
    payment.method === PaymentMethod.PIX
      ? new Date(now + PIX_WINDOW_MS).toISOString()
      : payment.method === PaymentMethod.Boleto
        ? new Date(now + BOLETO_WINDOW_MS).toISOString()
        : null;

  const { data: order, error: orderError } = await getSupabaseServer()
    .from("orders")
    .insert({
      order_number: orderNumber,
      status: "pending",
      full_name: identification.fullName,
      email: identification.email,
      cpf: identification.cpf,
      phone: identification.phone || null,
      cep: address.cep,
      street: address.street,
      street_number: address.number,
      complement: address.complement || null,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      payment_method: payment.method,
      installments: payment.installments ? parseInt(payment.installments, 10) : 1,
      subtotal: serverSubtotal,
      discount: serverDiscount,
      shipping: serverShipping,
      total: serverTotal,
      shipping_service_id: shippingServiceId,
      shipping_service_name: shippingServiceName,
      coupon_code: couponCode ?? null,
      anonymous_id: anonymousId || null,
      expires_at: expiresAt,
      payment_attempts: 0,
    })
    .select("id")
    .single();

  if (orderError) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }

  await getSupabaseServer().from("order_items").insert(
    items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.variantId,
      product_name: item.name,
      color_name: item.color.name,
      price: dbPriceByCentavos[item.variantId],
      quantity: item.quantity,
      image_url: item.image,
    })),
  );

  // coupon_usages NÃO é inserido aqui — só na aprovação (abaixo para cartão, ou no webhook para PIX/Boleto)

  const payer = buildMpPayer(identification);
  const amountBRL = serverTotal / 100;
  const description = `Serena Glasses #${orderNumber}`;
  const notificationUrl = getNotificationUrl();
  const firstName = payer.first_name;

  try {
    if (payment.method === PaymentMethod.PIX) {
      const mpRes = await getMpPayment().create({
        body: {
          transaction_amount: amountBRL,
          description,
          payment_method_id: "pix",
          external_reference: order.id,
          notification_url: notificationUrl,
          payer,
        },
        requestOptions: { idempotencyKey: order.id },
      });

      await sendOrderReceivedEmail({
        orderNumber,
        name: firstName,
        email: identification.email,
      }).catch((err) => console.error("[checkout] email error:", err));

      const txData = (mpRes).point_of_interaction?.transaction_data;
      return NextResponse.json({
        orderNumber,
        orderId: order.id,
        payment: {
          type: "pix",
          qrCode: txData?.qr_code ?? "",
          qrCodeBase64: txData?.qr_code_base64 ?? "",
          pixCopyPaste: txData?.qr_code ?? "",
          mpPaymentId: mpRes.id,
        },
      });
    }

    if (payment.method === PaymentMethod.Boleto) {
      const mpRes = await getMpPayment().create({
        body: {
          transaction_amount: amountBRL,
          description,
          payment_method_id: "bolbradesco",
          external_reference: order.id,
          notification_url: notificationUrl,
          payer: {
            ...payer,
            address: {
              zip_code: address.cep.replace(/\D/g, ""),
              street_name: address.street,
              street_number: address.number,
              neighborhood: address.neighborhood,
              city: address.city,
              federal_unit: address.state,
            },
          },
        },
        requestOptions: { idempotencyKey: order.id },
      });

      await sendOrderReceivedEmail({
        orderNumber,
        name: firstName,
        email: identification.email,
      }).catch((err) => console.error("[checkout] email error:", err));

      const txDetails = (mpRes).transaction_details;
      const barcode = (mpRes as { barcode?: { content: string } }).barcode?.content ?? "";
      return NextResponse.json({
        orderNumber,
        orderId: order.id,
        payment: {
          type: "boleto",
          boletoUrl: txDetails?.external_resource_url ?? "",
          barcode,
          mpPaymentId: mpRes.id,
        },
      });
    }

    if (payment.method === PaymentMethod.Card && cardToken) {
      // Primeira tentativa: attempt number = 1
      const idempotencyKey = `${order.id}-1`;

      const mpRes = await getMpPayment().create({
        body: {
          transaction_amount: amountBRL,
          description,
          token: cardToken,
          payment_method_id: cardPaymentMethodId,
          installments: Number(cardInstallments ?? 1),
          external_reference: order.id,
          notification_url: notificationUrl,
          payer,
        },
        requestOptions: { idempotencyKey },
      });

      const mpStatus = mpRes.status;

      // Incrementa payment_attempts para 1
      await getSupabaseServer()
        .from("orders")
        .update({ payment_attempts: 1, mp_payment_id: String(mpRes.id) })
        .eq("id", order.id);

      if (mpStatus === "approved") {
        await getSupabaseServer()
          .from("orders")
          .update({ status: "paid", paid_at: new Date().toISOString() })
          .eq("id", order.id);

        if (appliedCouponId && serverDiscount > 0) {
          await insertCouponUsageIfNeeded(order.id, appliedCouponId, identification.email, serverDiscount);
        }

        await sendOrderConfirmationEmail({
          orderNumber,
          name: firstName,
          email: identification.email,
          orderId: order.id,
        }).catch((err) => console.error("[checkout] email error:", err));

        return NextResponse.json({
          ok: true,
          kind: "approved",
          orderId: order.id,
          orderNumber,
          attempts: 1,
          maxAttempts: MAX_ATTEMPTS,
          payment: { type: "card", status: "approved" },
        });
      }

      if (mpStatus === "rejected") {
        const statusDetail = (mpRes as { status_detail?: string }).status_detail ?? "cc_rejected_other_reason";
        const kind = classifyMpError(statusDetail);

        if (kind === "definitive_rejection") {
          await getSupabaseServer()
            .from("orders")
            .update({
              status: "cancelled",
              cancelled_at: new Date().toISOString(),
              cancel_reason: "payment_attempts_exhausted",
              payment_error: { status_detail: statusDetail, mp_status: mpStatus },
            })
            .eq("id", order.id);

          return NextResponse.json({
            ok: false,
            kind: "cancelled",
            orderId: order.id,
            attempts: 1,
            maxAttempts: MAX_ATTEMPTS,
            errorMessage: "Pedido cancelado após múltiplas falhas de pagamento. Você pode criar um novo pedido com outro cartão.",
          }, { status: 422 });
        }

        await getSupabaseServer()
          .from("orders")
          .update({
            status: "payment_failed",
            payment_error: { status_detail: statusDetail, mp_status: mpStatus },
          })
          .eq("id", order.id);

        return NextResponse.json({
          ok: false,
          kind,
          orderId: order.id,
          attempts: 1,
          maxAttempts: MAX_ATTEMPTS,
          errorMessage: userMessageFor(kind, 1),
        }, { status: 422 });
      }

      // in_process / pending
      return NextResponse.json({
        ok: true,
        kind: "approved",
        orderId: order.id,
        orderNumber,
        attempts: 1,
        maxAttempts: MAX_ATTEMPTS,
        payment: { type: "card", status: mpStatus },
      });
    }
  } catch (mpErr: unknown) {
    const errMsg = mpErr instanceof Error ? mpErr.message : String(mpErr);
    await getSupabaseServer().from("orders").update({
      status: "payment_failed",
      payment_error: { message: errMsg },
    }).eq("id", order.id);
    return NextResponse.json(
      { error: "Erro ao processar pagamento. Tente novamente." },
      { status: 502 },
    );
  }

  return NextResponse.json({ orderNumber, orderId: order.id });
}
