/**
 * Page: /admin-v2/shipping-zones — SCAFFOLD de zonas de frete.
 *
 * Server Component: sem query DB (tabela shipping_zones inexistente).
 * Delega 100% ao ShippingZonesClient com dados mock.
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import { ShippingZonesClient } from "@features/admin-v2/components/shipping-zones/ShippingZonesClient";

export const dynamic = "force-dynamic";

export default async function AdminV2ShippingZonesPage() {
  await requireAdmin("/admin-v2/login");
  return <ShippingZonesClient />;
}
