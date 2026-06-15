import { Resend } from "resend";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import {
  buildOrderConfirmedEmail,
  buildOrderReceivedEmail,
  buildOrderShippedEmail,
  buildOrderDeliveredEmail,
  buildOrderCancelledEmail,
  buildOrderPaymentRetryEmail,
  buildReviewRequestEmail,
} from "../templates/orderTemplates";

function getResend(): Resend {
  return new Resend(process.env.RESEND_API_KEY);
}

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

async function send(tag: string, payload: Parameters<Resend["emails"]["send"]>[0]): Promise<void> {
  if (!isResendConfigured()) {
    console.warn(`[email:${tag}] Resend not configured — skipping`);
    return;
  }
  const result = await getResend().emails.send(payload);
  if (result.error) {
    console.error(`[email:${tag}] Resend error →`, result.error);
  } else {
    console.log(`[email:${tag}] sent id=${result.data?.id} to=${payload.to}`);
  }
}

export async function sendOrderConfirmationEmail(params: SendConfirmationParams): Promise<void> {
  const { orderNumber, name, email, orderId } = params;

  const { data: items } = await getSupabaseServer()
    .from("order_items")
    .select("product_name, color_name, quantity, price")
    .eq("order_id", orderId);

  const { data: order } = await getSupabaseServer()
    .from("orders")
    .select("subtotal, discount, total, coupon_code")
    .eq("id", orderId)
    .single();

  await send("confirmation", {
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
  await send("received", {
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
  await send("shipped", {
    from: getFrom(),
    to: params.email,
    subject: `Pedido enviado #${params.orderNumber} 🚚 Serena Glasses`,
    html: buildOrderShippedEmail(params),
  });
}

export async function sendOrderDeliveredEmail(params: {
  orderNumber: string;
  name: string;
  email: string;
}): Promise<void> {
  await send("delivered", {
    from: getFrom(),
    to: params.email,
    subject: `Pedido entregue #${params.orderNumber} ✦ Serena Glasses`,
    html: buildOrderDeliveredEmail({ orderNumber: params.orderNumber, name: params.name }),
  });
}

export async function sendOrderPaymentRetryEmail(params: { orderNumber: string; name: string; email: string }): Promise<void> {
  const shopUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  await send("payment-retry", {
    from: getFrom(),
    to: params.email,
    subject: `Tente novamente o pagamento #${params.orderNumber} ✦ Serena Glasses`,
    html: buildOrderPaymentRetryEmail({ orderNumber: params.orderNumber, name: params.name, shopUrl }),
  });
}

export async function sendOrderCancelledEmail(params: { orderNumber: string; name: string; email: string }): Promise<void> {
  await send("cancelled", {
    from: getFrom(),
    to: params.email,
    subject: `Pedido cancelado #${params.orderNumber} ✦ Serena Glasses`,
    html: buildOrderCancelledEmail({ orderNumber: params.orderNumber, name: params.name }),
  });
}

export async function sendReviewRequestEmail(params: {
  name: string;
  email: string;
  productName: string;
  reviewToken: string;
}): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const reviewUrl = `${baseUrl}/avaliar/${params.reviewToken}`;
  await send("review-request", {
    from: getFrom(),
    to: params.email,
    subject: `Como foi sua experiência? Avalie seu pedido ✦ Serena Glasses`,
    html: buildReviewRequestEmail({
      name: params.name,
      productName: params.productName,
      reviewUrl,
    }),
  });
}

/**
 * Generates review tokens for each product in an order and sends invite emails.
 * One review per product (not per item line — deduped by product_id).
 * Safe to call multiple times — upserts on (order_id, product_id) conflict.
 */
export async function generateAndSendReviewRequests(orderId: string): Promise<void> {
  const supabase = getSupabaseServer();

  const { data: order } = await supabase
    .from("orders")
    .select("id, full_name, email, city, created_at")
    .eq("id", orderId)
    .single();

  if (!order) return;

  const { data: items } = await supabase
    .from("order_items")
    .select("product_id, product_name")
    .eq("order_id", orderId);

  if (!items?.length) return;

  // Dedupe: one review request per product
  const seen = new Set<string>();
  const products = items.filter((i) => {
    if (seen.has(i.product_id)) return false;
    seen.add(i.product_id);
    return true;
  });

  const firstName = order.full_name.split(" ")[0];
  const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

  for (const product of products) {
    const token = crypto.randomUUID();

    const { error } = await supabase.from("product_reviews").upsert(
      {
        product_id: product.product_id,
        order_id: orderId,
        author_name: firstName,
        rating: 5,
        status: "pending",
        verified: true,
        city: order.city ?? null,
        purchased_at: order.created_at,
        review_token: token,
        review_token_expires_at: expiresAt,
      },
      { onConflict: "order_id,product_id", ignoreDuplicates: true },
    );

    if (error) {
      console.error("[review-request] upsert error:", error.message);
      continue;
    }

    await sendReviewRequestEmail({
      name: firstName,
      email: order.email,
      productName: product.product_name,
      reviewToken: token,
    }).catch((err) => console.error("[review-request] email error:", err));
  }
}
