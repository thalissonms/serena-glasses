/**
 * Page: /admin-v2/analytics — dashboard SCAFFOLD de analytics de vendas.
 *
 * Server Component: agrega orders dos últimos 30 dias por dia em JS.
 * Top 10 produtos usa dados mock estáticos (requer order_items join — em desenvolvimento).
 * Placeholder de conversão — requer integração com pixel.
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { AnalyticsClient } from "@features/admin-v2/components/analytics/AnalyticsClient";
import type { DayRevenue } from "@features/admin-v2/components/analytics/AnalyticsClient";

export const dynamic = "force-dynamic";

export default async function AdminV2AnalyticsPage() {
  await requireAdmin("/admin-v2/login");

  const supabase = getSupabaseServer();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: orders } = await supabase
    .from("orders")
    .select("id, total_price, status, created_at")
    .gte("created_at", thirtyDaysAgo.toISOString())
    .not("status", "in", "(cancelled,payment_failed)")
    .order("created_at", { ascending: true });

  const dayMap: Record<string, { revenue: number; count: number }> = {};

  for (let i = 0; i < 30; i++) {
    const d = new Date(thirtyDaysAgo);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    dayMap[key] = { revenue: 0, count: 0 };
  }

  let totalRevenue = 0;
  let totalOrders = 0;

  for (const o of orders ?? []) {
    const key = (o.created_at ?? "").slice(0, 10);
    if (!key || !dayMap[key]) continue;
    const amount = Number(o.total_price ?? 0);
    dayMap[key].revenue += amount;
    dayMap[key].count += 1;
    totalRevenue += amount;
    totalOrders += 1;
  }

  const dailyRevenue: DayRevenue[] = Object.entries(dayMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, v]) => ({
      day,
      revenue: v.revenue,
      orders_count: v.count,
    }));

  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  return (
    <AnalyticsClient
      dailyRevenue={dailyRevenue}
      totalRevenue={totalRevenue}
      totalOrders={totalOrders}
      avgOrderValue={avgOrderValue}
    />
  );
}
