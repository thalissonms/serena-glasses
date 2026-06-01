/**
 * API Route: POST /api/webhooks/mercadopago — recebe notificações do Mercado Pago.
 *
 * Valida assinatura HMAC, busca pagamento na API do MP, atualiza status do pedido.
 * Idempotente por mp_payment_id: side-effects (estoque via status, email, coupon_usages)
 * rodam só uma vez. Aceita transição payment_failed → paid (race com retry síncrono).
 *
 * Usado em: MP webhook config (notification_url em cada pagamento criado).
 */
import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { getMpPayment } from "@shared/lib/mercadopago/server";

function verifyMpSignature(request: NextRequest, rawBody: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";

  const xSignature = request.headers.get("x-signature");
  const xRequestId = request.headers.get("x-request-id");

  if (!xSignature || !xRequestId) return false;

  const parts = Object.fromEntries(
    xSignature.split(",").map((part) => part.split("=") as [string, string]),
  );
  const ts = parts["ts"];
  const v1 = parts["v1"];
  if (!ts || !v1) return false;

  const dataId = JSON.parse(rawBody)?.data?.id ?? "";
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

  const expected = createHmac("sha256", secret).update(manifest).digest("hex");

  try {
    return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(v1, "hex"));
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!verifyMpSignature(request, rawBody)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const body = JSON.parse(rawBody);

    if (body.type !== "payment") {
      return NextResponse.json({ ok: true });
    }

    const paymentId = body.data?.id;
    if (!paymentId) return NextResponse.json({ ok: true });

    const payment = await getMpPayment().get({ id: paymentId });

    const orderId = payment.external_reference;
    if (!orderId) return NextResponse.json({ ok: true });

    const mpStatus = payment.status;

    if (mpStatus === "approved") {
      const { data: order } = await getSupabaseServer()
        .from("orders")
        .select("id, status, order_number, full_name, email, coupon_code, mp_payment_id, payment_method")
        .eq("id", orderId)
        .single();

      if (!order) return NextResponse.json({ ok: true });

      if (order.status === "paid") return NextResponse.json({ ok: true });

      if (order.status === "cancelled") {
        console.error("[webhook/mp] late approval on cancelled order", { orderId, paymentId });
        return NextResponse.json({ ok: true });
      }

      // Idempotência: se já temos esse mp_payment_id registrado como paid em outro pedido, ignorar
      if (order.mp_payment_id && order.mp_payment_id === String(paymentId) && order.status === "paid") {
        return NextResponse.json({ ok: true });
      }

      // Transiciona pending ou payment_failed → paid
      await getSupabaseServer()
        .from("orders")
        .update({
          status: "paid",
          paid_at: new Date().toISOString(),
          mp_payment_id: String(paymentId),
        })
        .eq("id", orderId);

      // Registra uso de cupom se ainda não foi registrado (guard de duplicação por order_id)
      if (order.coupon_code) {
        const { data: coupon } = await getSupabaseServer()
          .from("coupons")
          .select("id")
          .eq("code", order.coupon_code)
          .single();

        if (coupon) {
          const { count } = await getSupabaseServer()
            .from("coupon_usages")
            .select("id", { count: "exact", head: true })
            .eq("order_id", orderId);

          if (!count || count === 0) {
            const { data: fullOrder } = await getSupabaseServer()
              .from("orders")
              .select("discount, email")
              .eq("id", orderId)
              .single();

            if (fullOrder) {
              await getSupabaseServer().from("coupon_usages").insert({
                coupon_id: coupon.id,
                order_id: orderId,
                email: fullOrder.email.toLowerCase().trim(),
                discount_applied_cents: fullOrder.discount,
              });
            }
          }
        }
      }

      // Email de confirmação para PIX/Boleto aprovados via webhook
      // Para cartão aprovado via webhook tardio, também envia (payment_failed → paid)
      const { sendOrderConfirmationEmail } = await import("@features/emails/services/sendOrderEmail");
      await sendOrderConfirmationEmail({
        orderNumber: order.order_number,
        name: order.full_name.split(" ")[0],
        email: order.email,
        orderId,
      }).catch((err) => console.error("[webhook/mp] email error:", err));

      return NextResponse.json({ ok: true });
    }

    if (mpStatus === "rejected") {
      await getSupabaseServer()
        .from("orders")
        .update({
          status: "payment_failed",
          mp_payment_id: String(paymentId),
          payment_error: {
            status_detail: (payment as any).status_detail ?? "cc_rejected_other_reason",
            mp_status: mpStatus,
          },
        })
        .eq("id", orderId)
        .in("status", ["pending", "payment_failed"]);

      return NextResponse.json({ ok: true });
    }

    if (mpStatus === "cancelled") {
      await getSupabaseServer()
        .from("orders")
        .update({ status: "cancelled", mp_payment_id: String(paymentId), cancelled_at: new Date().toISOString() })
        .eq("id", orderId)
        .in("status", ["pending", "payment_failed"]);

      return NextResponse.json({ ok: true });
    }

    if (mpStatus === "refunded" || mpStatus === "charged_back") {
      await getSupabaseServer()
        .from("orders")
        .update({ status: "refunded", mp_payment_id: String(paymentId) })
        .eq("id", orderId);

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[webhook/mp] error:", (err as Error)?.message ?? String(err));
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
