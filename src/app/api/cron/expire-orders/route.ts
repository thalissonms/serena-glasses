import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@shared/lib/supabase/server";
import { sendOrderCancelledEmail } from "@features/emails/services/sendOrderEmail";

const BATCH_SIZE = 100;

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");

  // In production, CRON_SECRET must match. In dev without the var, allow.
  if (cronSecret && auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: expired, error } = await supabaseServer
    .from("orders")
    .select("id, order_number, email, full_name, payment_method")
    .eq("status", "pending")
    .lt("expires_at", new Date().toISOString())
    .limit(BATCH_SIZE);

  if (error) {
    console.error("[cron/expire-orders] fetch error:", error.message);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  if (!expired || expired.length === 0) {
    return NextResponse.json({ cancelled: 0 });
  }

  const ids = expired.map((o) => o.id);
  const now = new Date().toISOString();

  const { error: updateError } = await supabaseServer
    .from("orders")
    .update({ status: "cancelled", cancelled_at: now, cancel_reason: "expired" })
    .in("id", ids);

  if (updateError) {
    console.error("[cron/expire-orders] update error:", updateError.message);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  // Fire-and-forget — email failures don't rollback the cancellation
  await Promise.allSettled(
    expired.map((order) => {
      const [first] = order.full_name.split(" ");
      return sendOrderCancelledEmail({
        orderNumber: order.order_number,
        name: first,
        email: order.email,
      });
    }),
  );

  console.log(`[cron/expire-orders] cancelled ${expired.length} orders`);
  return NextResponse.json({ cancelled: expired.length });
}
