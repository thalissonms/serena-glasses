/**
 * Service: getDashboardV2Data — métricas completas do dashboard admin.
 *
 * Busca pedidos excluindo cancelled/refunded/payment_failed, calcula métricas por
 * faixa de tempo (hoje/7d/30d/total), sparkline 30 dias, últimos 10 pedidos e
 * alertas de estoque baixo (variants com stock_quantity < 5).
 *
 * Usado em: src/app/admin/page.tsx.
 */
import { getSupabaseServer } from "@shared/lib/supabase/server";

const REVENUE_STATUSES = ["paid", "processing", "shipped", "delivered"] as const;
const EXCLUDED_STATUSES = "(cancelled,refunded,payment_failed)";
const LOW_STOCK_THRESHOLD = 5;

export interface TimeRangeMetrics {
  revenue: number;
  orders: number;
  aov: number;
  customers: number;
}

export interface LatestOrder {
  id: string;
  order_number: string;
  full_name: string;
  total: number | null;
  status: string;
  created_at: string;
  payment_method: string;
}

export interface LowStockItem {
  id: string;
  color_name: string;
  stock_quantity: number;
  product_id: string;
  product_name: string;
  product_slug: string;
}

export interface SparklinePoint {
  date: string;
  revenue: number;
}

export interface DashboardV2Data {
  today: TimeRangeMetrics;
  week: TimeRangeMetrics;
  month: TimeRangeMetrics;
  allTime: TimeRangeMetrics;
  pendingCount: number;
  sparkline: SparklinePoint[];
  latestOrders: LatestOrder[];
  lowStockAlerts: LowStockItem[];
}

type MetricOrder = {
  total: number | null;
  status: string;
  created_at: string;
  email: string;
};

function computeMetrics(orders: MetricOrder[]): TimeRangeMetrics {
  const revenueOrders = orders.filter((o) =>
    (REVENUE_STATUSES as readonly string[]).includes(o.status),
  );
  const revenue = revenueOrders.reduce((sum, o) => sum + (o.total ?? 0), 0);
  const customers = new Set(orders.map((o) => o.email).filter(Boolean)).size;
  return {
    revenue,
    orders: orders.length,
    aov: revenueOrders.length > 0 ? Math.round(revenue / revenueOrders.length) : 0,
    customers,
  };
}

function buildSparkline(orders: MetricOrder[]): SparklinePoint[] {
  const map = new Map<string, number>();
  const now = Date.now();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now - i * 86_400_000);
    map.set(d.toISOString().slice(0, 10), 0);
  }
  const cutoffMs = now - 30 * 86_400_000;
  for (const o of orders) {
    if (!(REVENUE_STATUSES as readonly string[]).includes(o.status)) continue;
    if (new Date(o.created_at).getTime() < cutoffMs) continue;
    const key = o.created_at.slice(0, 10);
    if (map.has(key)) map.set(key, (map.get(key) ?? 0) + (o.total ?? 0));
  }
  return Array.from(map.entries()).map(([date, revenue]) => ({ date, revenue }));
}

type RawLowStock = {
  id: string;
  color_name: string;
  stock_quantity: number;
  product_id: string;
  products: { id: string; name_pt: string; slug: string } | null;
};

export async function getDashboardV2Data(): Promise<DashboardV2Data> {
  const now = new Date();
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).toISOString();
  const weekStart = new Date(now.getTime() - 7 * 86_400_000).toISOString();
  const monthStart = new Date(now.getTime() - 30 * 86_400_000).toISOString();

  const [metricsRes, latestRes, lowStockRes] = await Promise.all([
    getSupabaseServer()
      .from("orders")
      .select("id, total, status, created_at, email")
      .not("status", "in", EXCLUDED_STATUSES)
      .order("created_at", { ascending: false }),

    getSupabaseServer()
      .from("orders")
      .select("id, order_number, full_name, total, status, created_at, payment_method")
      .order("created_at", { ascending: false })
      .limit(10),

    getSupabaseServer()
      .from("product_variants")
      .select("id, color_name, stock_quantity, product_id, products(id, name_pt, slug)")
      .lt("stock_quantity", LOW_STOCK_THRESHOLD)
      .order("stock_quantity", { ascending: true })
      .limit(20),
  ]);

  const allOrders = (metricsRes.data ?? []) as MetricOrder[];

  const latestOrders: LatestOrder[] = (latestRes.data ?? []).map((o) => ({
    id: o.id as string,
    order_number: o.order_number as string,
    full_name: o.full_name as string,
    total: o.total as number | null,
    status: o.status as string,
    created_at: o.created_at as string,
    payment_method: o.payment_method as string,
  }));

  const lowStockAlerts: LowStockItem[] = (
    (lowStockRes.data ?? []) as unknown as RawLowStock[]
  )
    .map((v) => {
      const product = Array.isArray(v.products) ? v.products[0] : v.products;
      if (!product) return null;
      return {
        id: v.id,
        color_name: v.color_name,
        stock_quantity: v.stock_quantity,
        product_id: v.product_id,
        product_name: product.name_pt,
        product_slug: product.slug,
      };
    })
    .filter((item): item is LowStockItem => item !== null);

  return {
    today: computeMetrics(allOrders.filter((o) => o.created_at >= todayStart)),
    week: computeMetrics(allOrders.filter((o) => o.created_at >= weekStart)),
    month: computeMetrics(allOrders.filter((o) => o.created_at >= monthStart)),
    allTime: computeMetrics(allOrders),
    pendingCount: allOrders.filter((o) => o.status === "pending").length,
    sparkline: buildSparkline(allOrders),
    latestOrders,
    lowStockAlerts,
  };
}
