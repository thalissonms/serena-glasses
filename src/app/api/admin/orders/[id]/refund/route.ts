import { NextResponse } from "next/server";
import { supabaseServer } from "@shared/lib/supabase/server";
import { mpRefund } from "@shared/lib/mercadopago/server";
import { withAdmin } from "@shared/lib/auth/withAdmin";
import { sendOrderCancelledEmail } from "@features/emails/services/sendOrderEmail";

export const POST = withAdmin<{ id: string }>(async (_req, { params }) => {
  const { id } = await params;

  const { data: order, error: fetchError } = await supabaseServer
    .from("orders")
    .select("id, order_number, status, mp_payment_id, full_name, email")
    .eq("id", id)
    .single();

  if (fetchError || !order) {
    return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
  }

  if (order.status === "refunded") {
    return NextResponse.json({ error: "Pedido já foi reembolsado" }, { status: 409 });
  }

  if (!["paid", "processing", "shipped"].includes(order.status)) {
    return NextResponse.json(
      { error: "Reembolso disponível apenas para pedidos pagos, em processamento ou enviados" },
      { status: 422 },
    );
  }

  const mpId = (order as any).mp_payment_id;
  if (!mpId) {
    return NextResponse.json(
      { error: "ID de pagamento MP não encontrado neste pedido" },
      { status: 422 },
    );
  }

  try {
    await mpRefund.create({ payment_id: Number(mpId), requestOptions: {} });
  } catch (err: any) {
    const msg = err?.cause?.message ?? err?.message ?? String(err);
    console.error("[admin/refund] MP refund error:", msg);
    return NextResponse.json(
      { error: `Erro ao processar reembolso: ${msg}` },
      { status: 502 },
    );
  }

  const now = new Date().toISOString();
  const { error: updateError } = await supabaseServer
    .from("orders")
    .update({
      status: "refunded",
      cancelled_at: now,
      cancel_reason: "refunded",
      updated_at: now,
    })
    .eq("id", id);

  if (updateError) {
    console.error("[admin/refund] DB update error:", updateError.message);
    return NextResponse.json({ error: "Reembolso processado mas falha ao atualizar pedido" }, { status: 500 });
  }

  sendOrderCancelledEmail({
    orderNumber: order.order_number,
    name: order.full_name.split(" ")[0],
    email: order.email,
  }).catch((err) => console.error("[admin/refund] email error:", err));

  return NextResponse.json({ ok: true });
});
