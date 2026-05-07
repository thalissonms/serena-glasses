import { getSupabaseServer } from "@shared/lib/supabase/server";
import type { OrderInterface } from "../types/orders.interface";

export interface DashboardData {
  orders: OrderInterface[];
  productsCount: number;
}

/**
 * Dados agregados pro dashboard. Diferente de `getOrdersList` (paginado),
 * aqui pegamos TODOS os pedidos para calcular receita/contagens corretas.
 * Selecionamos sÃ³ as colunas que o dashboard usa pra manter o payload leve.
 */
export async function getDashboardData(): Promise<DashboardData> {
  const [ordersRes, productsRes] = await Promise.all([
    getSupabaseServer()
      .from("orders")
      .select(
        "id, order_number, full_name, email, total, payment_method, status, created_at",
      )
      .order("created_at", { ascending: false }),
    getSupabaseServer()
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("active", true),
  ]);

  return {
    orders: (ordersRes.data ?? []) as OrderInterface[],
    productsCount: productsRes.count ?? 0,
  };
}
