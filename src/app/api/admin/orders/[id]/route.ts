import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@shared/lib/supabase/server";
import { withAdmin } from "@shared/lib/auth/withAdmin";
import { ORDER_STATUSES } from "@features/admin/consts/orders.const";

export const PATCH = withAdmin<{ id: string }>(async (req, { params }) => {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const { status, tracking_code, tracking_carrier } = body;

  if (status && !ORDER_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updateFields: Record<string, unknown> = {};
  if (status) {
    updateFields.status = status;
    updateFields.updated_at = new Date().toISOString();
    if (status === "shipped") updateFields.shipped_at = new Date().toISOString();
    if (status === "delivered") updateFields.delivered_at = new Date().toISOString();
  }
  if (tracking_code !== undefined) updateFields.tracking_code = tracking_code;
  if (tracking_carrier !== undefined) updateFields.tracking_carrier = tracking_carrier;

  if (Object.keys(updateFields).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  // Dispara email de envio quando muda para shipped
  if (status === "shipped") {
    const { data: order } = await supabaseServer
      .from("orders")
      .select("order_number, full_name, email")
      .eq("id", id)
      .single();

    if (order) {
      const { sendOrderShippedEmail } = await import("@features/emails/services/sendOrderEmail");
      sendOrderShippedEmail({
        orderNumber: order.order_number,
        name: order.full_name.split(" ")[0],
        email: order.email,
        trackingCode: tracking_code,
        carrier: tracking_carrier,
      }).catch((err) => console.error("[admin/orders] shipped email error:", err));
    }
  }

  // Dispara email de cancelamento
  if (status === "cancelled") {
    const { data: order } = await supabaseServer
      .from("orders")
      .select("order_number, full_name, email")
      .eq("id", id)
      .single();

    if (order) {
      const { sendOrderCancelledEmail } = await import("@features/emails/services/sendOrderEmail");
      sendOrderCancelledEmail({
        orderNumber: order.order_number,
        name: order.full_name.split(" ")[0],
        email: order.email,
      }).catch((err) => console.error("[admin/orders] cancelled email error:", err));
    }
  }

  const { error } = await supabaseServer
    .from("orders")
    .update(updateFields)
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
});
