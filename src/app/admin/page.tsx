import { requireAdmin } from "@shared/lib/auth/admin";
import DashboardClient from "@features/admin/components/DashboardClient";
import { getDashboardData } from "@features/admin/services/dashboardData.service";

export default async function AdminDashboard() {
  await requireAdmin();
  const { orders, productsCount } = await getDashboardData();

  return <DashboardClient orders={orders} productsCount={productsCount} />;
}
