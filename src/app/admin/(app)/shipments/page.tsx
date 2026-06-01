/**
 * Page: /admin/shipments — SCAFFOLD timeline de rastreamento de envios por pedido.
 *
 * Server Component: busca order_tracking_events join orders, agrupa por order_id em JS.
 * Filtros client-side: busca por order_number, select de me_status.
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { ShipmentsClient } from "@features/admin/components/shipments/ShipmentsClient";
import type { TrackingEvent, OrderTimeline } from "@features/admin/components/shipments/ShipmentsClient";

export const dynamic = "force-dynamic";

export default async function AdminV2ShipmentsPage() {
  await requireAdmin("/admin/login");

  const supabase = getSupabaseServer();

  const { data: events } = await supabase
    .from("order_tracking_events")
    .select("id, order_id, me_status, message, created_at, orders(order_number, user_email)")
    .order("created_at", { ascending: false })
    .limit(500);

  const ordersMap = new Map<string, OrderTimeline>();

  for (const raw of events ?? []) {
    const order = (raw.orders as unknown as { order_number: string; user_email: string | null } | null);
    const evt: TrackingEvent = {
      id: raw.id,
      order_id: raw.order_id,
      me_status: raw.me_status ?? "waiting",
      message: raw.message ?? null,
      created_at: raw.created_at ?? "",
      order_number: order?.order_number ?? raw.order_id,
      user_email: order?.user_email ?? null,
    };

    if (!ordersMap.has(raw.order_id)) {
      ordersMap.set(raw.order_id, {
        order_id: raw.order_id,
        order_number: evt.order_number,
        user_email: evt.user_email,
        events: [],
        last_status: evt.me_status,
        last_updated: evt.created_at,
      });
    }

    const timeline = ordersMap.get(raw.order_id)!;
    timeline.events.push(evt);
  }

  const timelines: OrderTimeline[] = Array.from(ordersMap.values()).map((t) => ({
    ...t,
    events: [...t.events].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    ),
    last_status: t.events[0]?.me_status ?? "waiting",
    last_updated: t.events[0]?.created_at ?? "",
  }));

  timelines.sort(
    (a, b) => new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime()
  );

  return <ShipmentsClient timelines={timelines} />;
}
