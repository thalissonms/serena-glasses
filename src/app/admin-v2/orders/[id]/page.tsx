/**
 * Page: /admin-v2/orders/[id] — detalhe de pedido no painel admin v2.
 *
 * Server Component: busca pedido, itens, cores das variantes e eventos de
 * tracking em paralelo. Passa tudo serializado ao OrderDetailClient.
 *
 * Usado em: rota /admin-v2/orders/[id].
 */
import { notFound } from "next/navigation";
import { requireAdmin } from "@shared/lib/auth/admin";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { OrderDetailClient } from "@features/admin-v2/components/orders/OrderDetailClient";

export const dynamic = "force-dynamic";

export default async function AdminV2OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const db = getSupabaseServer();

  const [orderResult, itemsResult, eventsResult] = await Promise.all([
    db
      .from("orders")
      .select(
        "id, order_number, status, created_at, updated_at, full_name, email, cpf, phone," +
        " street, street_number, complement, neighborhood, city, state, cep," +
        " total, shipping, discount, coupon_code, payment_method," +
        " mp_payment_id, paid_at, shipped_at, delivered_at, expires_at," +
        " cancelled_at, cancel_reason, tracking_code, tracking_carrier," +
        " payment_attempts, me_order_id, me_label_url, me_status, shipping_service_name",
      )
      .eq("id", id)
      .single(),
    db
      .from("order_items")
      .select("id, product_name, quantity, price, variant_id")
      .eq("order_id", id),
    db
      .from("order_tracking_events")
      .select("id, occurred_at, description, location")
      .eq("order_id", id)
      .order("occurred_at", { ascending: false }),
  ]);

  if (orderResult.error || !orderResult.data) notFound();

  const variantIds = (itemsResult.data ?? [])
    .map((i) => i.variant_id)
    .filter(Boolean) as string[];

  const colorMap = new Map<string, { color: string | null; color_label: string | null }>();
  if (variantIds.length > 0) {
    const { data: variants } = await (db.from("product_variants") as any)
      .select("id, color, color_label")
      .in("id", variantIds);
    for (const v of (variants ?? []) as any[]) {
      colorMap.set(v.id as string, { color: v.color ?? null, color_label: v.color_label ?? null });
    }
  }

  const items = (itemsResult.data ?? []).map((item) => ({
    ...item,
    color: colorMap.get(item.variant_id ?? "")?.color ?? null,
    color_label: colorMap.get(item.variant_id ?? "")?.color_label ?? null,
  }));

  return (
    <OrderDetailClient
      order={orderResult.data as any}
      items={items}
      events={(eventsResult.data ?? []) as any}
    />
  );
}
