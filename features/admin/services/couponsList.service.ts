import { supabaseServer } from "@shared/lib/supabase/server";
import type { CouponWithUsageInterface } from "@features/coupons/types/coupon.interface";

export async function getCouponsList(): Promise<CouponWithUsageInterface[]> {
  const [{ data: coupons }, { data: usages }] = await Promise.all([
    supabaseServer.from("coupons").select("*").order("created_at", { ascending: false }),
    supabaseServer.from("coupon_usages").select("coupon_id"),
  ]);

  const usageCount: Record<string, number> = {};
  for (const u of usages ?? []) {
    usageCount[u.coupon_id] = (usageCount[u.coupon_id] ?? 0) + 1;
  }

  return (coupons ?? []).map((c) => ({
    ...c,
    usage_count: usageCount[c.id] ?? 0,
  })) as CouponWithUsageInterface[];
}
