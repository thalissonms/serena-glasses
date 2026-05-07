import { NextResponse } from "next/server";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { withAdmin } from "@shared/lib/auth/withAdmin";

// Resets a payment_failed order to pending so the customer can retry.
// Does NOT re-charge — it's an admin signal to give the customer another window.
export const POST = withAdmin<{ id: string }>(async (_req, { params }) => {
  const { id } = await params;

  const { data: order } = await getSupabaseServer()
    .from("orders")
    .select("status, payment_method")
    .eq("id", id)
    .single();

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.status !== "payment_failed") {
    return NextResponse.json({ error: "Only payment_failed orders can be retried" }, { status: 409 });
  }

  // Give 24 h for all methods; customer will start a new checkout
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const { error } = await getSupabaseServer()
    .from("orders")
    .update({
      status: "pending",
      payment_error: null,
      mp_payment_id: null,
      expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
});
