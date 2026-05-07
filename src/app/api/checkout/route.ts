import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@shared/lib/supabase/server";
import { mpPayment } from "@shared/lib/mercadopago/server";
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

// ─── Server-side validation schema ────────────────────────────────────────────
// Card fields are stripped on the client before POST — only method + installments arrive.
const checkoutBodySchema = z.object({
  formData: z.object({
    identification: z.object({
      fullName: z.string().min(2),
      cpf: z.string().length(14),
      birthDate: z.string().min(1),
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
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
// The cron job queries WHERE status='pending' AND expires_at < now() every 5 min.
const PIX_WINDOW_MS    = 30 * 60 * 1000;
const BOLETO_WINDOW_MS = 2 * 24 * 60 * 60 * 1000;

// ─── Handler ──────────────────────────────────────────────────────────────────
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

  const { formData, items, couponCode, anonymousId, shippingServiceId, shippingServiceName, shippingPrice, cardToken, cardPaymentMethodId, cardInstallments } = parsed.data;
  const { identification, address, payment } = formData;

  // Cartão requer token
  if (payment.method === PaymentMethod.Card && !cardToken) {
    return NextResponse.json({ error: "Token do cartão ausente." }, { status: 400 });
  }

  // Validação de estoque
  const shortages = await checkStockAvailability(
    items.map((i) => ({ variantId: i.variantId, quantity: i.quantity, productName: i.name })),
  );
  if (shortages.length > 0) {
    return NextResponse.json({ error: "Estoque insuficiente", shortages }, { status: 409 });
  }

  // Preços server-side — não confia nos valores do cliente
  const variantIds = items.map((i) => i.variantId);
  const { data: dbVariants, error: priceError } = await supabaseServer
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

  // Cupom server-side
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
    // discount_type already loaded by validateCoupon — no extra DB round-trip needed
    isFreeShippingCoupon = couponResult.coupon.discount_type === "free_shipping";
  }

  // Validação server-side do frete — recalcula e rejeita tampering
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

  // Cria pedido
  const { data: order, error: orderError } = await supabaseServer
    .from("orders")
    .insert({
      order_number: orderNumber,
      status: "pending",
      full_name: identification.fullName,
      email: identification.email,
      cpf: identification.cpf,
      birth_date: identification.birthDate || null,
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
    })
    .select("id")
    .single();

  if (orderError) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }

  await supabaseServer.from("order_items").insert(
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

  if (appliedCouponId && serverDiscount > 0) {
    await supabaseServer.from("coupon_usages").insert({
      coupon_id: appliedCouponId,
      order_id: order.id,
      email: identification.email.toLowerCase().trim(),
      discount_applied_cents: serverDiscount,
    });
  }

  // ─── Mercado Pago ──────────────────────────────────────────────────────────
  const payer = buildMpPayer(identification);
  const amountBRL = serverTotal / 100;
  const description = `Serena Glasses #${orderNumber}`;
  const notificationUrl = getNotificationUrl();
  const firstName = payer.first_name;

  try {
    if (payment.method === PaymentMethod.PIX) {
      const mpRes = await mpPayment.create({
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

      sendOrderReceivedEmail({
        orderNumber,
        name: firstName,
        email: identification.email,
      }).catch(() => {});

      const txData = (mpRes as any).point_of_interaction?.transaction_data;
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
      const mpRes = await mpPayment.create({
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

      // Email de "aguardando pagamento"
      sendOrderReceivedEmail({
        orderNumber,
        name: firstName,
        email: identification.email,
      }).catch(() => {});

      const txDetails = (mpRes as any).transaction_details;
      const barcode = (mpRes as any).barcode?.content ?? "";
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
      const mpRes = await mpPayment.create({
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
        requestOptions: { idempotencyKey: order.id },
      });

      const mpStatus = mpRes.status;

      if (mpStatus === "approved") {
        await supabaseServer
          .from("orders")
          .update({ status: "paid", paid_at: new Date().toISOString(), mp_payment_id: String(mpRes.id) })
          .eq("id", order.id);

        sendOrderConfirmationEmail({
          orderNumber,
          name: firstName,
          email: identification.email,
          orderId: order.id,
        }).catch(() => {});

        return NextResponse.json({ orderNumber, payment: { type: "card", status: "approved" } });
      }

      if (mpStatus === "rejected") {
        const statusDetail = (mpRes as any).status_detail ?? "cc_rejected_other_reason";
        await supabaseServer.from("orders").update({
          status: "payment_failed",
          mp_payment_id: String(mpRes.id),
          payment_error: { status_detail: statusDetail, mp_status: mpStatus },
        }).eq("id", order.id);
        const reasons: Record<string, string> = {
          cc_rejected_insufficient_amount: "Saldo insuficiente.",
          cc_rejected_bad_filled_card_number: "Número do cartão inválido.",
          cc_rejected_bad_filled_security_code: "CVV inválido.",
          cc_rejected_bad_filled_date: "Data de vencimento inválida.",
          cc_rejected_call_for_authorize: "Entre em contato com o banco para autorizar.",
        };
        return NextResponse.json(
          { error: reasons[statusDetail] ?? "Pagamento recusado. Tente outro cartão." },
          { status: 422 },
        );
      }

      // in_process / pending
      return NextResponse.json({ orderNumber, payment: { type: "card", status: mpStatus } });
    }
  } catch (mpErr: any) {
    const errMsg = mpErr?.message ?? String(mpErr);
    await supabaseServer.from("orders").update({
      status: "payment_failed",
      payment_error: { message: errMsg },
    }).eq("id", order.id);
    return NextResponse.json(
      { error: "Erro ao processar pagamento. Tente novamente." },
      { status: 502 },
    );
  }

  return NextResponse.json({ orderNumber });
}
