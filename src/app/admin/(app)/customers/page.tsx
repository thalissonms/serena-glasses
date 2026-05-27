/**
 * Page: /admin/customers — listagem SCAFFOLD de clientes com totais de pedidos.
 *
 * Server Component: busca users (limit 200) + agrega pedidos por email em JS.
 * Read-only. CRUD de clientes em desenvolvimento.
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { CustomersListClient } from "@features/admin/components/customers/CustomersListClient";
import type { CustomerRow } from "@features/admin/components/customers/CustomersListClient";

export const dynamic = "force-dynamic";

export default async function AdminV2CustomersPage() {
  await requireAdmin("/admin/login");

  const supabase = getSupabaseServer();

  const [{ data: users }, { data: orders }] = await Promise.all([
    supabase
      .from("users")
      .select("id, email, name, phone, created_at")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("orders")
      .select("email, total_price, status")
      .not("status", "in", "(cancelled,payment_failed)"),
  ]);

  const byEmail: Record<string, { count: number; total: number }> = {};
  for (const o of orders ?? []) {
    const k = (o.email ?? "").toLowerCase();
    if (!k) continue;
    byEmail[k] ??= { count: 0, total: 0 };
    byEmail[k].count += 1;
    byEmail[k].total += Number(o.total_price ?? 0);
  }

  const customers: CustomerRow[] = (users ?? []).map((u) => {
    const agg = byEmail[(u.email ?? "").toLowerCase()] ?? { count: 0, total: 0 };
    return {
      id: u.id,
      email: u.email ?? "",
      name: u.name ?? null,
      phone: u.phone ?? null,
      created_at: u.created_at ?? null,
      total_orders: agg.count,
      total_spent: agg.total,
    };
  });

  return <CustomersListClient customers={customers} />;
}
