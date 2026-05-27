/**
 * Page: /admin/carts — SCAFFOLD de carrinhos abandonados.
 *
 * Server Component: sem query (tabela inexistente). Delega 100% ao CartsClient com mock data.
 * Requer feature flag PERSISTENT_CART_ENABLED e tabelas carts + cart_items para ativação.
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import { CartsClient } from "@features/admin/components/carts/CartsClient";

export const dynamic = "force-dynamic";

export default async function AdminV2CartsPage() {
  await requireAdmin("/admin/login");
  return <CartsClient />;
}
