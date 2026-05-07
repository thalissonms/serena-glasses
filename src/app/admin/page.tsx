import { unstable_cache } from "next/cache";
import { requireAdmin } from "@shared/lib/auth/admin";
import DashboardClient from "@features/admin/components/DashboardClient";
import MelhorEnvioStatusCard from "@features/admin/components/MelhorEnvioStatusCard";
import { getDashboardData } from "@features/admin/services/dashboardData.service";
import { meRequest } from "@shared/lib/melhor-envio/client";

// Cached 5 minutes — avoids adding ME API latency to every dashboard SSR render
const getMeHealth = unstable_cache(
  async (): Promise<{ connected: boolean; accountEmail: string | null }> => {
    try {
      const me = await meRequest<{ email: string }>("GET", "/api/v2/me");
      return { connected: true, accountEmail: me.email };
    } catch {
      return { connected: false, accountEmail: null };
    }
  },
  ["me-health"],
  { revalidate: 300 },
);

export default async function AdminDashboard() {
  await requireAdmin();
  const [{ orders, productsCount }, health] = await Promise.all([
    getDashboardData(),
    getMeHealth(),
  ]);

  return (
    <div>
      <div className="p-8 pb-0">
        <MelhorEnvioStatusCard connected={health.connected} accountEmail={health.accountEmail} />
      </div>
      <DashboardClient orders={orders} productsCount={productsCount} />
    </div>
  );
}
