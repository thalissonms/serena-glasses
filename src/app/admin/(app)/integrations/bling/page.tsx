/**
 * Page: /admin/integrations/bling — SCAFFOLD de integração Bling ERP.
 *
 * Server Component: sem query DB. Delega 100% ao BlingClient.
 * Plano de implementação em AGENT/bling-integration-plan.md.
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import { BlingClient } from "@features/admin/components/integrations/BlingClient";

export const dynamic = "force-dynamic";

export default async function AdminV2BlingPage() {
  await requireAdmin("/admin/login");
  return <BlingClient />;
}
