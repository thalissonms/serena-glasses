import { requireAdmin } from "@shared/lib/auth/admin";
import { getCouponsList } from "@features/admin/services/couponsList.service";
import CouponsClient from "@features/admin/components/CouponsClient";

export default async function AdminCouponsPage() {
  await requireAdmin();
  const coupons = await getCouponsList();
  return <CouponsClient initialCoupons={coupons} />;
}
