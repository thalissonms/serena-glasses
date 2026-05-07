import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@shared/lib/supabase/server";
import { meRequest } from "@shared/lib/melhor-envio/client";
import type { MeTrackingResponse } from "@shared/lib/melhor-envio/types";

const BATCH_SIZE = 50;

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");

  if (cronSecret && auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch shipped orders that have a ME order id (not yet delivered)
  const { data: eligible, error } = await supabaseServer
    .from("orders")
    .select("id, order_number, full_name, email, me_order_id, delivery_email_sent_at")
    .eq("status", "shipped")
    .not("me_order_id", "is", null)
    .limit(BATCH_SIZE);

  if (error) {
    console.error("[cron/refresh-tracking] fetch error:", error.message);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  if (!eligible || eligible.length === 0) {
    return NextResponse.json({ processed: 0 });
  }

  const meOrderIds = eligible.map((o) => (o as { me_order_id: string }).me_order_id);

  let trackingMap: Record<string, MeTrackingResponse>;
  try {
    const res = await meRequest<Record<string, MeTrackingResponse>>(
      "POST",
      "/api/v2/me/shipment/tracking",
      { orders: meOrderIds },
    );
    trackingMap = res;
  } catch (err) {
    console.error("[cron/refresh-tracking] ME error:", (err as Error)?.message ?? String(err));
    return NextResponse.json({ error: "ME request failed" }, { status: 502 });
  }

  const now = new Date().toISOString();
  let processed = 0;

  for (const order of eligible) {
    const meOrderId = (order as { me_order_id: string }).me_order_id;
    const tracking = trackingMap[meOrderId];
    if (!tracking) continue;

    // Upsert new tracking events
    if (tracking.events && tracking.events.length > 0) {
      const { data: existing } = await supabaseServer
        .from("order_tracking_events")
        .select("occurred_at")
        .eq("order_id", order.id);

      const existingTimes = new Set((existing ?? []).map((e) => e.occurred_at));

      const newEvents = tracking.events
        .filter((ev) => !existingTimes.has(ev.date))
        .map((ev) => ({
          order_id: order.id,
          occurred_at: ev.date,
          description: ev.description,
          location: ev.location ?? null,
          raw: ev,
        }));

      if (newEvents.length > 0) {
        await supabaseServer.from("order_tracking_events").insert(newEvents);
      }
    }

    // Mark delivered if ME says so
    if (tracking.status === "delivered") {
      const sendEmail = !order.delivery_email_sent_at;
      const updateFields: Record<string, unknown> = {
        status: "delivered",
        me_status: "delivered",
        updated_at: now,
      };
      if (sendEmail) updateFields.delivery_email_sent_at = now;

      await supabaseServer.from("orders").update(updateFields).eq("id", order.id);

      if (sendEmail) {
        const { sendOrderDeliveredEmail } = await import(
          "@features/emails/services/sendOrderEmail"
        );
        sendOrderDeliveredEmail({
          orderNumber: order.order_number,
          name: order.full_name.split(" ")[0],
          email: order.email,
        }).catch((err) => console.error("[cron/refresh-tracking] email error:", err));
      }
    }

    processed++;
  }

  console.log(`[cron/refresh-tracking] processed ${processed}/${eligible.length} orders`);
  return NextResponse.json({ processed });
}
