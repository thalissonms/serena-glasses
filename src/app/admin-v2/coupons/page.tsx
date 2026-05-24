/**
 * Page: /admin-v2/coupons — listagem de cupons com tabs Ativos/Expirados/Todos.
 *
 * Busca todos os cupons + contagem de usos por coupon_id em paralelo.
 * Mescla usage_count em cada CouponRow antes de passar ao client component.
 *
 * Usado em: Sidebar → Marketing → Cupons.
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import {
  CouponsListClient,
  type CouponRow,
} from "@features/admin-v2/components/coupons/CouponsListClient";

export default async function CouponsPage() {
  await requireAdmin("/admin-v2/login");
  const supabase = getSupabaseServer();

  const [{ data: coupons }, { data: usageData }] = await Promise.all([
    supabase.from("coupons").select("*").order("created_at", { ascending: false }),
    supabase.from("coupon_usages").select("coupon_id"),
  ]);

  const usageMap = (usageData ?? []).reduce<Record<string, number>>((acc, u) => {
    const key = (u as { coupon_id: string }).coupon_id;
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const rows: CouponRow[] = ((coupons ?? []) as CouponRow[]).map((c) => ({
    ...c,
    usage_count: usageMap[c.id] ?? 0,
  }));

  return (
    <div className="p-8">
      <CouponsListClient coupons={rows} />
    </div>
  );
}
