import { Resend } from "resend";
import { supabaseServer } from "@shared/lib/supabase/server";
import {
  buildOrderConfirmedEmail,
  buildOrderReceivedEmail,
  buildOrderShippedEmail,
  buildOrderCancelledEmail,
} from "../templates/orderTemplates";

const resend = new Resend(process.env.RESEND_API_KEY);

function isResendConfigured(): boolean {
  const key = process.env.RESEND_API_KEY;
  return !!key && !key.includes("SUBSTITUA");
}

function getFrom(): string {
  return `Serena Glasses <${process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev"}>`;
}

export interface SendConfirmationParams {
  orderNumber: string;
  name: string;
  email: string;
  orderId: string;
}

export async function sendOrderConfirmationEmail(params: SendConfirmationParams): Promise<void> {
  if (!isResendConfigured()) return;

  const { orderNumber, name, email, orderId } = params;

  const { data: items } = await supabaseServer
    .from("order_items")
    .select("product_name, color_name, quantity, price")
    .eq("order_id", orderId);

  const { data: order } = await supabaseServer
    .from("orders")
    .select("subtotal, discount, total, coupon_code")
    .eq("id", orderId)
    .single();

  await resend.emails.send({
    from: getFrom(),
    to: email,
    subject: `Pagamento confirmado #${orderNumber} ✦ Serena Glasses`,
    html: buildOrderConfirmedEmail({
      orderNumber,
      name,
      items: (items ?? []).map((i) => ({
        name: i.product_name,
        colorName: i.color_name,
        quantity: i.quantity,
        price: i.price,
      })),
      subtotal: order?.subtotal ?? 0,
      discount: order?.discount ?? 0,
      total: order?.total ?? 0,
      couponCode: order?.coupon_code,
    }),
  });
}

export async function sendOrderReceivedEmail(params: { orderNumber: string; name: string; email: string }): Promise<void> {
  if (!isResendConfigured()) return;

  await resend.emails.send({
    from: getFrom(),
    to: params.email,
    subject: `Pedido recebido #${params.orderNumber} ✦ Serena Glasses`,
    html: buildOrderReceivedEmail({ orderNumber: params.orderNumber, name: params.name }),
  });
}

export async function sendOrderShippedEmail(params: {
  orderNumber: string;
  name: string;
  email: string;
  trackingCode?: string;
  carrier?: string;
}): Promise<void> {
  if (!isResendConfigured()) return;

  await resend.emails.send({
    from: getFrom(),
    to: params.email,
    subject: `Pedido enviado #${params.orderNumber} 🚚 Serena Glasses`,
    html: buildOrderShippedEmail(params),
  });
}

export async function sendOrderCancelledEmail(params: { orderNumber: string; name: string; email: string }): Promise<void> {
  if (!isResendConfigured()) return;

  await resend.emails.send({
    from: getFrom(),
    to: params.email,
    subject: `Pedido cancelado #${params.orderNumber} ✦ Serena Glasses`,
    html: buildOrderCancelledEmail({ orderNumber: params.orderNumber, name: params.name }),
  });
}
