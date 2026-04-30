import { supabaseServer } from "@shared/lib/supabase/server";
import type { OrderInterface } from "../types/orders.interface";

export interface OrderFilters {
  q?: string;
  status?: string;
  from?: string;
  to?: string;
  page?: number;
}

export interface OrdersListResult {
  orders: OrderInterface[];
  total: number;
  page: number;
  totalPages: number;
}

const PAGE_SIZE = 25;

export async function getOrdersList(filters: OrderFilters = {}): Promise<OrdersListResult> {
  const { q, status, from, to, page = 1 } = filters;
  const offset = (page - 1) * PAGE_SIZE;

  let query = supabaseServer
    .from("orders")
    .select(
      "id, order_number, full_name, email, total, payment_method, status, created_at",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (status) query = query.eq("status", status);
  if (from) query = query.gte("created_at", `${from}T00:00:00`);
  if (to) query = query.lte("created_at", `${to}T23:59:59`);
  if (q) {
    // Vírgulas e parênteses quebram o parser de .or() — sanitiza
    const safeQ = q.replace(/[,()]/g, "");
    if (safeQ) {
      query = query.or(
        `order_number.ilike.%${safeQ}%,full_name.ilike.%${safeQ}%,email.ilike.%${safeQ}%`,
      );
    }
  }

  const { data, count } = await query;
  const total = count ?? 0;

  return {
    orders: (data ?? []) as OrderInterface[],
    total,
    page,
    totalPages: Math.ceil(total / PAGE_SIZE),
  };
}
