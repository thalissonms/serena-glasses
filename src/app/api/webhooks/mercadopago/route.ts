import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { getMpPayment } from "@shared/lib/mercadopago/server";

const MP_STATUS_MAP: Record<string, string> = {
  approved: "paid",
  rejected: "payment_failed",
  cancelled: "cancelled",
  refunded: "refunded",
  charged_back: "refunded",
};

function verifyMpSignature(request: NextRequest, rawBody: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  // Se segredo não configurado, aceita em dev mas rejeita em prod
  if (!secret) return process.env.NODE_ENV !== "production";

  const xSignature = request.headers.get("x-signature");
  const xRequestId = request.headers.get("x-request-id");

  if (!xSignature || !xRequestId) return false;

  // Formato: "ts=<timestamp>,v1=<hash>"
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

    const newStatus = MP_STATUS_MAP[payment.status ?? ""] ?? null;
    if (!newStatus) return NextResponse.json({ ok: true });

    const updateFields: Record<string, unknown> = {
      status: newStatus,
      mp_payment_id: String(paymentId),
    };

    if (newStatus === "paid") {
      updateFields.paid_at = new Date().toISOString();
    }

    const { data: order } = await getSupabaseServer()
      .from("orders")
      .update(updateFields)
      .eq("id", orderId)
      .select("order_number, full_name, email, total, subtotal, discount, coupon_code, payment_method")
      .single();

    // Dispara email de confirmação para PIX/Boleto pagos via webhook
    if (newStatus === "paid" && order && order.payment_method !== "card") {
      const { sendOrderConfirmationEmail } = await import("@features/emails/services/sendOrderEmail");
      sendOrderConfirmationEmail({
        orderNumber: order.order_number,
        name: order.full_name.split(" ")[0],
        email: order.email,
        orderId,
      }).catch((err) => console.error("[webhook/mp] email error:", err));
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[webhook/mp] error:", (err as Error)?.message ?? String(err));
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
