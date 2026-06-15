/**
 * Page: /admin/orders — listagem de pedidos com filtros server-side Y2K Chrome.
 *
 * Server Component: busca pedidos com filtros derivados de URL (q, status, from, to, page).
 * Repassa resultado e filtros ao OrdersListClient para gestão de estado e UI.
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import { getOrdersList } from "@features/admin/services/ordersList.service";
import { OrdersListClient } from "@features/admin/components/orders/OrdersListClient";

export const dynamic = "force-dynamic";

export default async function AdminV2OrdersPage(props: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    from?: string;
    to?: string;
    page?: string;
  }>;
}) {
  await requireAdmin("/admin/login");

  const sp = await props.searchParams;
  const page = Math.max(1, Number(sp.page ?? 1));

  const result = await getOrdersList({
    q: sp.q,
    status: sp.status,
    from: sp.from,
    to: sp.to,
    page,
  });

  return (
    <OrdersListClient
      result={result}
      initialQ={sp.q ?? ""}
      initialStatus={sp.status ?? ""}
      initialFrom={sp.from ?? ""}
      initialTo={sp.to ?? ""}
      currentPage={page}
    />
  );
}
