import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import type { MeWebhookEvent } from "@shared/lib/melhor-envio/types";

// ME does not support HMAC signing â€” auth via secret token in URL query param
function verifyToken(request: NextRequest): boolean {
  const secret = process.env.MELHOR_ENVIO_WEBHOOK_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  const token = request.nextUrl.searchParams.get("token");
  return token === secret;
}

export async function POST(request: NextRequest) {
  if (!verifyToken(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ ok: true });
  }

  try {
    const body = JSON.parse(rawBody) as MeWebhookEvent;
    const { event, data } = body;
    const meOrderId = data?.id;

    if (!meOrderId) return NextResponse.json({ ok: true });

    const { data: order } = await getSupabaseServer()
      .from("orders")
      .select("id, order_number, full_name, email, me_status, delivery_email_sent_at")
      .eq("me_order_id", meOrderId)
      .maybeSingle();

    if (!order) {
      console.error("[webhook/me] order not found for me_order_id:", meOrderId);
      return NextResponse.json({ ok: true });
    }

    const now = new Date().toISOString();

    switch (event) {
      case "order.posted": {
        // Only send shipped email once â€” idempotency via me_status
        const alreadyPosted = order.me_status === "posted";

        await getSupabaseServer()
          .from("orders")
          .update({
            status: "shipped",
            me_status: "posted",
            tracking_code: data.tracking ?? null,
            updated_at: now,
          })
          .eq("id", order.id);

        if (!alreadyPosted) {
          const { sendOrderShippedEmail } = await import(
            "@features/emails/services/sendOrderEmail"
          );
          await sendOrderShippedEmail({
            orderNumber: order.order_number,
            name: order.full_name.split(" ")[0],
            email: order.email,
            trackingCode: data.tracking,
          }).catch((err) => console.error("[webhook/me] shipped email error:", err));
        }
        break;
      }

      case "order.delivered": {
        const updateFields: Record<string, unknown> = {
          status: "delivered",
          me_status: "delivered",
          updated_at: now,
        };

        const sendDeliveredEmail = !order.delivery_email_sent_at;
        if (sendDeliveredEmail) {
          updateFields.delivery_email_sent_at = now;
        }

        await getSupabaseServer().from("orders").update(updateFields).eq("id", order.id);

        if (sendDeliveredEmail) {
          const { sendOrderDeliveredEmail } = await import(
            "@features/emails/services/sendOrderEmail"
          );
          await sendOrderDeliveredEmail({
            orderNumber: order.order_number,
            name: order.full_name.split(" ")[0],
            email: order.email,
          }).catch((err) => console.error("[webhook/me] delivered email error:", err));
        }
        break;
      }

      case "order.canceled": {
        await getSupabaseServer()
          .from("orders")
          .update({ me_status: "canceled", updated_at: now })
          .eq("id", order.id);
        break;
      }

      case "tracking.updated": {
        const incomingEvents = data.events ?? [];
        if (incomingEvents.length === 0) break;

        // Fetch existing occurred_at values to avoid duplicates (no unique constraint in DB)
        const { data: existing } = await getSupabaseServer()
          .from("order_tracking_events")
          .select("occurred_at")
          .eq("order_id", order.id);

        const existingTimes = new Set((existing ?? []).map((e) => e.occurred_at));

        const newEvents = incomingEvents
          .filter((ev) => !existingTimes.has(ev.date))
          .map((ev) => ({
            order_id: order.id,
            occurred_at: ev.date,
            description: ev.description,
            location: ev.location ?? null,
            raw: ev,
          }));

        if (newEvents.length > 0) {
          await getSupabaseServer().from("order_tracking_events").insert(newEvents);
        }
        break;
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Always return 200 â€” 500 would cause ME to retry indefinitely
    console.error("[webhook/me] error:", (err as Error)?.message ?? String(err));
    return NextResponse.json({ ok: true });
  }
}
