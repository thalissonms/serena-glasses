import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { sendOrderPaymentRetryEmail } from "@features/emails/services/sendOrderEmail";

const BATCH_SIZE = 100;
const RETRY_DELAY_MS = 2 * 60 * 60 * 1000; // 2h apÃ³s falha antes de notificar
const RETRY_WINDOW_MS = 2 * 24 * 60 * 60 * 1000; // 2 dias para o cliente refazer o pedido

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");

  if (cronSecret && auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const threshold = new Date(Date.now() - RETRY_DELAY_MS).toISOString();

  const { data: failed, error } = await getSupabaseServer()
    .from("orders")
    .select("id, order_number, email, full_name")
    .eq("status", "payment_failed")
    .lt("created_at", threshold)
    .limit(BATCH_SIZE);

  if (error) {
    console.error("[cron/retry-failed-payments] fetch error:", error.message);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  if (!failed || failed.length === 0) {
    return NextResponse.json({ retried: 0 });
  }

  const ids = failed.map((o) => o.id);
  const newExpiresAt = new Date(Date.now() + RETRY_WINDOW_MS).toISOString();
  const now = new Date().toISOString();

  const { error: updateError } = await getSupabaseServer()
    .from("orders")
    .update({
      status: "pending",
      payment_error: null,
      mp_payment_id: null,
      expires_at: newExpiresAt,
      updated_at: now,
    })
    .in("id", ids);

  if (updateError) {
    console.error("[cron/retry-failed-payments] update error:", updateError.message);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  // Fire-and-forget â€” email failures don't rollback the status reset
  await Promise.allSettled(
    failed.map((order) => {
      const [first] = order.full_name.split(" ");
      return sendOrderPaymentRetryEmail({
        orderNumber: order.order_number,
        name: first,
        email: order.email,
      });
    }),
  );

  console.log(`[cron/retry-failed-payments] retried ${failed.length} orders`);
  return NextResponse.json({ retried: failed.length });
}
