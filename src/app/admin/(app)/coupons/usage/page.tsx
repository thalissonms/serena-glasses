/**
 * Page: /admin/coupons/usage — SCAFFOLD analytics de uso de cupons.
 *
 * Server Component: busca coupon_usages join coupons, normaliza em JS.
 * Renderiza top 10 por desconto total via CouponUsageClient com filtro de date range.
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { CouponUsageClient } from "@features/admin/components/coupons/CouponUsageClient";
import type { CouponUsageRecord } from "@features/admin/components/coupons/CouponUsageClient";

export const dynamic = "force-dynamic";

export default async function AdminV2CouponUsagePage() {
  await requireAdmin("/admin/login");

  const supabase = getSupabaseServer();

  const { data: raw } = await supabase
    .from("coupon_usages")
    .select("id, coupon_id, order_id, user_email, discount_amount, created_at, coupons(code, discount_type)")
    .order("created_at", { ascending: false })
    .limit(1000);

  const usages: CouponUsageRecord[] = (raw ?? []).map((r) => {
    const coupon = (r.coupons as unknown as { code: string; discount_type: string } | null);
    return {
      id: r.id,
      coupon_id: r.coupon_id,
      coupon_code: coupon?.code ?? r.coupon_id,
      discount_type: coupon?.discount_type ?? "fixed_amount",
      order_id: r.order_id ?? null,
      user_email: r.user_email ?? null,
      discount_amount_cents: Math.round(Number(r.discount_amount ?? 0) * 100),
      created_at: r.created_at ?? "",
    };
  });

  return <CouponUsageClient usages={usages} />;
}
