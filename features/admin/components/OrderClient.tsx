"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { PAYMENT_LABEL, STATUS_COLOR, STATUS_LABEL } from "../consts/orders.const";
import type { OrderInterface } from "../types/orders.interface";
import type { OrdersListResult } from "../services/ordersList.service";
import { formatPrice } from "@features/products/utils/formatPrice";

interface Props extends OrdersListResult {
  filters: { q: string; status: string; from: string; to: string };
}

export default function OrderClient({ orders, total, page, totalPages, filters }: Props) {
  const router = useRouter();
  const [q, setQ] = useState(filters.q);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasFilters = filters.q || filters.status || filters.from || filters.to;

  function buildUrl(overrides: Partial<{ q: string; status: string; from: string; to: string; page: string }>) {
    const params: Record<string, string> = {};

    // q: usa local state para preservar input pendente
    const nextQ = "q" in overrides ? overrides.q : q;
    const nextStatus = "status" in overrides ? overrides.status : filters.status;
    const nextFrom = "from" in overrides ? overrides.from : filters.from;
    const nextTo = "to" in overrides ? overrides.to : filters.to;
    // muda filtro → volta pra página 1; muda página → usa o valor
    const nextPage = "page" in overrides ? overrides.page : "1";

    if (nextQ) params.q = nextQ;
    if (nextStatus) params.status = nextStatus;
    if (nextFrom) params.from = nextFrom;
    if (nextTo) params.to = nextTo;
    if (nextPage && nextPage !== "1") params.page = nextPage;

    const qs = new URLSearchParams(params).toString();
    return qs ? `/admin/orders?${qs}` : "/admin/orders";
  }

  function handleQChange(value: string) {
    setQ(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => router.push(buildUrl({ q: value })), 400);
  }

  function clearFilters() {
    setQ("");
    router.push("/admin/orders");
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-poppins font-black text-2xl text-white uppercase tracking-wide">
            Pedidos
          </h1>
          <p className="font-inter text-sm text-gray-400 mt-1">
            {total} pedido{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-5 flex flex-wrap items-end gap-3">
        {/* Busca */}
        <div className="relative flex-1 min-w-[220px]">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
          />
          <input
            type="text"
            value={q}
            onChange={(e) => handleQChange(e.target.value)}
            placeholder="Número, nome ou e-mail..."
            className="w-full bg-[#0f0f0f] border-2 border-white/20 pl-9 pr-3 py-2 font-inter text-sm text-white placeholder:text-gray-600 outline-none focus:border-brand-pink transition-colors"
          />
        </div>

        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) => router.push(buildUrl({ status: e.target.value }))}
          className="bg-[#0f0f0f] border-2 border-white/20 px-3 py-2 font-poppins text-xs font-bold uppercase tracking-wider text-gray-300 outline-none focus:border-brand-pink transition-colors cursor-pointer"
        >
          <option value="" className="bg-[#0f0f0f]">Todos os status</option>
          {Object.entries(STATUS_LABEL).map(([val, label]) => (
            <option key={val} value={val} className="bg-[#0f0f0f]">
              {label}
            </option>
          ))}
        </select>

        {/* De */}
        <div className="flex flex-col gap-1">
          <label className="font-poppins text-[9px] font-bold uppercase tracking-widest text-gray-600">
            De
          </label>
          <input
            type="date"
            value={filters.from}
            onChange={(e) => router.push(buildUrl({ from: e.target.value }))}
            className="bg-[#0f0f0f] border-2 border-white/20 px-3 py-2 font-inter text-sm text-gray-300 outline-none focus:border-brand-pink transition-colors"
          />
        </div>

        {/* Até */}
        <div className="flex flex-col gap-1">
          <label className="font-poppins text-[9px] font-bold uppercase tracking-widest text-gray-600">
            Até
          </label>
          <input
            type="date"
            value={filters.to}
            onChange={(e) => router.push(buildUrl({ to: e.target.value }))}
            className="bg-[#0f0f0f] border-2 border-white/20 px-3 py-2 font-inter text-sm text-gray-300 outline-none focus:border-brand-pink transition-colors"
          />
        </div>

        {/* Limpar */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 font-poppins text-[10px] font-bold uppercase tracking-wider border border-white/20 text-gray-500 px-3 py-2 hover:border-brand-pink/60 hover:text-brand-pink transition-colors"
          >
            <X size={10} /> Limpar
          </button>
        )}
      </div>

      {/* Tabela */}
      <div className="bg-[#0f0f0f] border-2 border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {["Pedido", "Cliente", "E-mail", "Pagamento", "Total", "Status", "Data", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left font-poppins text-[10px] font-bold uppercase tracking-widest text-gray-500"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4 font-poppins font-bold text-xs text-brand-pink tracking-wider whitespace-nowrap">
                    #{order.order_number}
                  </td>
                  <td className="px-5 py-4 font-inter text-sm text-gray-200 whitespace-nowrap">
                    {order.full_name}
                  </td>
                  <td className="px-5 py-4 font-inter text-xs text-gray-400">{order.email}</td>
                  <td className="px-5 py-4 font-poppins text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    {PAYMENT_LABEL[order.payment_method] ?? order.payment_method}
                  </td>
                  <td className="px-5 py-4 font-poppins font-semibold text-sm text-white whitespace-nowrap">
                    {formatPrice(order.total ?? 0)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`font-poppins text-[10px] font-bold uppercase tracking-wider px-2 py-1 border whitespace-nowrap ${STATUS_COLOR[order.status] ?? STATUS_COLOR.pending}`}
                    >
                      {STATUS_LABEL[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-inter text-xs text-gray-500 whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-poppins text-[10px] font-black uppercase tracking-wider text-white border border-white/20 px-3 py-1.5 hover:border-brand-pink hover:text-brand-pink transition-colors whitespace-nowrap"
                    >
                      Ver →
                    </Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center font-inter text-sm text-gray-600"
                  >
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="font-inter text-xs text-gray-500">
            Página {page} de {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(buildUrl({ page: String(page - 1) }))}
              disabled={page <= 1}
              className="flex items-center gap-1 font-poppins text-[10px] font-bold uppercase tracking-wider border border-white/20 text-gray-400 px-3 py-1.5 hover:border-brand-pink/60 hover:text-brand-pink transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={12} /> Anterior
            </button>
            <button
              onClick={() => router.push(buildUrl({ page: String(page + 1) }))}
              disabled={page >= totalPages}
              className="flex items-center gap-1 font-poppins text-[10px] font-bold uppercase tracking-wider border border-white/20 text-gray-400 px-3 py-1.5 hover:border-brand-pink/60 hover:text-brand-pink transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Próxima <ChevronRight size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
