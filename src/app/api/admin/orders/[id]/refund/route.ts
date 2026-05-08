import { NextResponse } from "next/server";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { getMpRefund } from "@shared/lib/mercadopago/server";
import { withAdmin } from "@shared/lib/auth/withAdmin";
import { meRequest } from "@shared/lib/melhor-envio/client";
import { sendOrderCancelledEmail } from "@features/emails/services/sendOrderEmail";

export const POST = withAdmin<{ id: string }>(async (_req, { params }) => {
  const { id } = await params;

  const { data: order, error: fetchError } = await getSupabaseServer()
    .from("orders")
    .select("id, order_number, status, mp_payment_id, full_name, email, me_order_id, me_status")
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

  // Cancel ME label if generated but not yet posted (G4)
  const meOrderId = (order as any).me_order_id as string | null;
  const meStatus = (order as any).me_status as string | null;
  if (meOrderId && meStatus === "generated") {
    try {
      await meRequest("POST", "/api/v2/me/shipment/cancel", { orders: [meOrderId] });
      await getSupabaseServer()
        .from("orders")
        .update({ me_order_id: null, me_label_url: null, me_status: "canceled" })
        .eq("id", id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[admin/refund] ME cancel error (non-fatal):", msg);
    }
  } else if (meOrderId && meStatus === "posted") {
    console.warn(`[admin/refund] order ${id} label already posted — skipping ME cancel`);
  }

  try {
    await getMpRefund().create({ payment_id: Number(mpId), requestOptions: {} });
  } catch (err: any) {
    const msg = err?.cause?.message ?? err?.message ?? String(err);
    console.error("[admin/refund] MP refund error:", msg);
    return NextResponse.json(
      { error: `Erro ao processar reembolso: ${msg}` },
      { status: 502 },
    );
  }

  const now = new Date().toISOString();
  const { error: updateError } = await getSupabaseServer()
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

  await sendOrderCancelledEmail({
    orderNumber: order.order_number,
    name: order.full_name.split(" ")[0],
    email: order.email,
  }).catch((err) => console.error("[admin/refund] email error:", err));

  return NextResponse.json({ ok: true });
});
