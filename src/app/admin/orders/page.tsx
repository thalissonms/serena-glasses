import { requireAdmin } from "@shared/lib/auth/admin";
import OrderClient from "@features/admin/components/OrderClient";
import { getOrdersList } from "@features/admin/services/ordersList.service";

interface Props {
  searchParams: Promise<{
    q?: string;
    status?: string;
    from?: string;
    to?: string;
    page?: string;
  }>;
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  await requireAdmin();
  const params = await searchParams;

  const result = await getOrdersList({
    q: params.q,
    status: params.status,
    from: params.from,
    to: params.to,
    page: params.page ? Math.max(1, parseInt(params.page, 10)) : 1,
  });

  return (
    <OrderClient
      {...result}
      filters={{
        q: params.q ?? "",
        status: params.status ?? "",
        from: params.from ?? "",
        to: params.to ?? "",
      }}
    />
  );
}
