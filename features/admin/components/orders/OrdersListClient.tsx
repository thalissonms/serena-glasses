"use client";
/**
 * Component: OrdersListClient — listagem de pedidos com filtros Y2K Chrome.
 *
 * Filtros server-side via URL: q (search), status, from/to (date range), page.
 * Filtro client-side: payment_method (opera sobre a página já carregada).
 * Table: order_number, data, cliente, total, status badge, pagamento icon, ME, ações.
 * Row hover: glow neon na cor do status. Bulk select: placeholder "Em Desenvolvimento".
 *
 * Usado em: src/app/admin/orders/page.tsx.
 */
import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Eye,
  Zap,
  CreditCard,
  FileText,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Square,
  CheckSquare,
} from "lucide-react";
import { clsx } from "clsx";
import type { OrdersListResult } from "@features/admin/services/ordersList.service";
import { Badge } from "@features/admin/components/primitives/Badge";
import { Input } from "@features/admin/components/primitives/Input";
import { Select } from "@features/admin/components/primitives/Select";
import { DateRangePicker } from "@features/admin/components/primitives/DateRangePicker";
import { AsciiEmpty } from "@features/admin/components/motifs/AsciiEmpty";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_CHIPS = [
  { value: "", label: "TODOS", color: null },
  { value: "pending", label: "PENDENTE", color: "#FFD700" },
  { value: "paid", label: "PAGO", color: "var(--brand-pink)" },
  { value: "processing", label: "PROCESSANDO", color: "#3B82F6" },
  { value: "shipped", label: "ENVIADO", color: "var(--brand-pink)" },
  { value: "delivered", label: "ENTREGUE", color: "#10B981" },
  { value: "cancelled", label: "CANCELADO", color: "rgba(255,255,255,0.3)" },
  { value: "refunded", label: "REEMBOLSADO", color: "#EF4444" },
  { value: "payment_failed", label: "FALHOU", color: "#EF4444" },
] as const;

const STATUS_ROW_STYLE: Record<string, { bg: string; border: string; hoverBg: string; hoverBorder: string }> = {
  pending:        { bg: "",               border: "border-l-[#FFD700]/20",   hoverBg: "hover:bg-[#FFD700]/5",    hoverBorder: "hover:border-l-[#FFD700]/50"  },
  paid:           { bg: "",               border: "border-l-brand-pink/20",   hoverBg: "hover:bg-brand-pink/5",    hoverBorder: "hover:border-l-brand-pink/50"  },
  processing:     { bg: "",               border: "border-l-blue-500/20",    hoverBg: "hover:bg-blue-500/5",     hoverBorder: "hover:border-l-blue-500/50"   },
  shipped:        { bg: "",               border: "border-l-[var(--brand-pink)]/20",   hoverBg: "hover:bg-brand-pink/5",    hoverBorder: "hover:border-l-[var(--brand-pink)]/50"  },
  delivered:      { bg: "",               border: "border-l-emerald-500/20", hoverBg: "hover:bg-emerald-500/5",  hoverBorder: "hover:border-l-emerald-500/50"},
  cancelled:      { bg: "",               border: "border-l-white/5",        hoverBg: "hover:bg-white/3",        hoverBorder: ""                             },
  refunded:       { bg: "",               border: "border-l-red-500/20",     hoverBg: "hover:bg-red-500/5",      hoverBorder: "hover:border-l-red-500/50"    },
  payment_failed: { bg: "",               border: "border-l-red-500/20",     hoverBg: "hover:bg-red-500/5",      hoverBorder: "hover:border-l-red-500/50"    },
};

const PAYMENT_OPTIONS = [
  { value: "", label: "Todos pagamentos" },
  { value: "pix", label: "PIX" },
  { value: "credit_card", label: "Cartão de Crédito" },
  { value: "boleto", label: "Boleto" },
  { value: "boleto_bancario", label: "Boleto Bancário" },
  { value: "mercadopago", label: "Mercado Pago" },
];

type BadgeOrderStatus = "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
const BADGE_STATUSES = new Set<string>(["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"]);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatOrderDate(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" }) +
    " " +
    d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  );
}

function formatOrderTotal(cents: number | null): string {
  if (cents === null || cents === undefined) return "—";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

function PaymentCell({ method }: { method: string }) {
  if (method === "pix") {
    return (
      <span className="inline-flex items-center gap-1.5">
        <Zap size={13} className="text-brand-pink" />
        <span className="font-mono text-[11px] text-white/40">{"// "}PIX</span>
      </span>
    );
  }
  if (method === "credit_card") {
    return (
      <span className="inline-flex items-center gap-1.5">
        <CreditCard size={13} className="text-blue-400" />
        <span className="font-mono text-[11px] text-white/40">{"// "}Cartão</span>
      </span>
    );
  }
  if (method === "boleto" || method === "boleto_bancario") {
    return (
      <span className="inline-flex items-center gap-1.5">
        <FileText size={13} className="text-[#FFD700]" />
        <span className="font-mono text-[11px] text-white/40">{"// "}Boleto</span>
      </span>
    );
  }
  if (method === "mercadopago") {
    return (
      <span className="inline-flex items-center gap-1.5">
        <DollarSign size={13} className="text-[#00B1EA]" />
        <span className="font-mono text-[11px] text-white/40">{"// "}MercadoPago</span>
      </span>
    );
  }
  return <span className="font-mono text-[11px] text-white/25">{"// "}{method ?? "—"}</span>;
}

function StatusCell({ status }: { status: string }) {
  if (BADGE_STATUSES.has(status)) {
    return <Badge variant={status as BadgeOrderStatus} />;
  }
  if (status === "payment_failed") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.25em] border text-red-400 border-red-500/30 bg-red-500/8">{"// "}FALHOU
      </span>
    );
  }
  return <span className="font-mono text-[11px] text-white/25">{"// "}{status}</span>;
}

function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p);
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  result: OrdersListResult;
  initialQ: string;
  initialStatus: string;
  initialFrom: string;
  initialTo: string;
  currentPage: number;
}

export function OrdersListClient({
  result,
  initialQ,
  initialStatus,
  initialFrom,
  initialTo,
  currentPage,
}: Props) {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [localQ, setLocalQ] = useState(initialQ);
  const [dateRange, setDateRange] = useState({ from: initialFrom, to: initialTo });
  const [paymentFilter, setPaymentFilter] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // ── URL push helper ──────────────────────────────────────────────────────

  function buildAndPush(opts: {
    q: string;
    status: string;
    from: string;
    to: string;
    page: number;
  }) {
    const params = new URLSearchParams();
    if (opts.q) params.set("q", opts.q);
    if (opts.status) params.set("status", opts.status);
    if (opts.from) params.set("from", opts.from);
    if (opts.to) params.set("to", opts.to);
    if (opts.page > 1) params.set("page", String(opts.page));
    const qs = params.toString();
    router.push(`/admin/orders${qs ? "?" + qs : ""}`);
  }

  // ── Filter handlers ──────────────────────────────────────────────────────

  function handleQChange(value: string) {
    setLocalQ(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      buildAndPush({ q: value, status: initialStatus, from: dateRange.from, to: dateRange.to, page: 1 });
    }, 400);
  }

  function handleDateChange(range: { from: string; to: string }) {
    setDateRange(range);
    buildAndPush({ q: localQ, status: initialStatus, from: range.from, to: range.to, page: 1 });
  }

  function handleStatusClick(status: string) {
    const next = status === initialStatus ? "" : status;
    buildAndPush({ q: localQ, status: next, from: dateRange.from, to: dateRange.to, page: 1 });
  }

  function handlePageClick(page: number) {
    buildAndPush({ q: localQ, status: initialStatus, from: dateRange.from, to: dateRange.to, page });
  }

  function handleClearAll() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setLocalQ("");
    setDateRange({ from: "", to: "" });
    setPaymentFilter("");
    router.push("/admin/orders");
  }

  // ── Row selection ────────────────────────────────────────────────────────

  const visibleOrders = useMemo(() => {
    if (!paymentFilter) return result.orders;
    return result.orders.filter(
      (o) => o.payment_method === paymentFilter
    );
  }, [result.orders, paymentFilter]);

  const allSelected = visibleOrders.length > 0 && selectedRows.size === visibleOrders.length;

  function toggleRow(id: string) {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  function toggleAll() {
    setSelectedRows(
      allSelected ? new Set() : new Set(visibleOrders.map((o) => o.id))
    );
  }

  const hasFilters =
    !!initialQ || !!initialStatus || !!dateRange.from || !!dateRange.to || !!paymentFilter;

  const pageNumbers = getPageNumbers(currentPage, result.totalPages);

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col min-h-full">

      {/* ── Page header ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 px-6 py-4 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3">
          <ShoppingBag size={19} className="text-brand-pink" />
          <h1 className="font-[Shrikhand] text-2xl text-white tracking-wider">PEDIDOS</h1>
          <span className="font-mono text-[11px] uppercase tracking-widest text-white/20 border border-white/8 px-2 py-0.5">{"// "}{result.total.toLocaleString("pt-BR")} total
          </span>
          {initialStatus && (
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/15 border border-white/5 px-2 py-0.5">{"// "}filtrado
            </span>
          )}
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/15 border border-white/5 px-3 py-1.5">{"// "}Pedidos entram pelo storefront
        </span>
      </div>

      {/* ── Sticky filter bar ── */}
      <div className="sticky top-0 z-20 bg-[#050505]/95 backdrop-blur-sm border-b border-white/5 px-6 pt-3 pb-3 shrink-0">

        {/* Row 1: text search + date range + payment + clear */}
        <div className="flex items-end gap-3 flex-wrap mb-3">
          <div className="min-w-[220px] flex-1 max-w-[300px]">
            <Input
              value={localQ}
              onChange={(e) => handleQChange(e.target.value)}
              placeholder="Número, nome, e-mail..."
              prefix={<Search size={14} />}
              suffix={
                localQ ? (
                  <button
                    onClick={() => handleQChange("")}
                    className="text-white/20 hover:text-white/60 transition-colors"
                  >
                    <X size={13} />
                  </button>
                ) : null
              }
            />
          </div>

          <DateRangePicker
            value={dateRange}
            onChange={handleDateChange}
            label="Período"
          />

          <div className="min-w-[180px]">
            <Select
              value={paymentFilter}
              onValueChange={setPaymentFilter}
              options={PAYMENT_OPTIONS}
              label="Pagamento"
            />
          </div>

          {hasFilters && (
            <button
              onClick={handleClearAll}
              className="self-end flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-white/25 hover:text-brand-pink border border-white/5 hover:border-brand-pink/30 px-3 py-2.5 transition-all duration-150"
            >
              <X size={12} />
              Limpar
            </button>
          )}
        </div>

        {/* Row 2: status chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUS_CHIPS.map((chip) => {
            const isActive = initialStatus === chip.value || (!initialStatus && chip.value === "");
            const activeStyle =
              isActive && chip.color
                ? {
                    borderColor: chip.color,
                    color: chip.color,
                    backgroundColor: chip.color + "18",
                    boxShadow: `0 0 8px ${chip.color}35`,
                  }
                : undefined;

            return (
              <button
                key={chip.value}
                onClick={() => handleStatusClick(chip.value)}
                style={activeStyle}
                className={clsx(
                  "font-mono text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 border transition-all duration-150",
                  isActive && !chip.color
                    ? "border-brand-pink text-brand-pink bg-brand-pink/8 shadow-[0_0_8px_rgba(255,0,182,0.25)]"
                    : !isActive
                    ? "border-white/8 text-white/25 hover:border-white/20 hover:text-white/50"
                    : "",
                )}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Bulk action bar ── */}
      {selectedRows.size > 0 && (
        <div className="shrink-0 bg-[#0a0a0a] border-b border-brand-pink/15 px-6 py-2 flex items-center gap-4">
          <span className="font-mono text-[11px] uppercase tracking-widest text-brand-pink">{"// "}{selectedRows.size} selecionado{selectedRows.size !== 1 ? "s" : ""}
          </span>
          <button
            onClick={() => setSelectedRows(new Set())}
            className="font-mono text-[10px] uppercase tracking-widest text-white/20 hover:text-white/50 transition-colors"
          >{"// "}Limpar seleção
          </button>
          <div className="ml-auto">
            <Badge variant="dev" label="Ações em massa — Em Desenvolvimento" />
          </div>
        </div>
      )}

      {/* ── Table ── */}
      <div className="flex-1 overflow-auto">
        {visibleOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <AsciiEmpty />
            <p className="font-mono text-[12px] uppercase tracking-widest text-white/20">{"// "}{hasFilters
                ? "Nenhum pedido com esses filtros"
                : "Nenhum pedido ainda"}
            </p>
            {hasFilters && (
              <button
                onClick={handleClearAll}
                className="font-mono text-[11px] uppercase tracking-widest text-brand-pink hover:underline transition-all"
              >{"// "}Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#0a0a0a] shadow-[inset_1px_1px_0_rgba(255,255,255,0.05),inset_-1px_-1px_0_rgba(0,0,0,0.3)]">
                  <th className="px-4 py-3 w-8 border-b border-white/5">
                    <button onClick={toggleAll} className="text-white/20 hover:text-white/50 transition-colors">
                      {allSelected
                        ? <CheckSquare size={16} className="text-brand-pink" />
                        : <Square size={16} />
                      }
                    </button>
                  </th>
                  {[
                    "Pedido",
                    "Data",
                    "Cliente",
                    "Total",
                    "Status",
                    "Pagamento",
                    "ME",
                    "Ações",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/25 font-normal border-b border-white/5 text-left"
                    >{"// "}{h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {visibleOrders.map((order, i) => {
                  const isSelected = selectedRows.has(order.id);
                  const rowStyle = STATUS_ROW_STYLE[order.status] ?? STATUS_ROW_STYLE.cancelled;

                  return (
                    <tr
                      key={order.id}
                      onClick={() => toggleRow(order.id)}
                      className={clsx(
                        "border-b border-white/3 border-l-2 transition-all duration-150 group cursor-pointer",
                        i % 2 === 0 ? "bg-[#0a0a0a]" : "bg-[#0a0a0a]",
                        rowStyle.border,
                        rowStyle.hoverBg,
                        rowStyle.hoverBorder,
                        isSelected && "!bg-brand-pink/6 !border-l-[var(--brand-pink)]/40",
                      )}
                    >
                      {/* Checkbox */}
                      <td
                        className="px-4 py-3 w-8"
                        onClick={(e) => { e.stopPropagation(); toggleRow(order.id); }}
                      >
                        <div className="text-white/20 group-hover:text-white/40 transition-colors">
                          {isSelected
                            ? <CheckSquare size={16} className="text-brand-pink" />
                            : <Square size={16} />
                          }
                        </div>
                      </td>

                      {/* Order number */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-[13px] text-brand-pink/80 tracking-wider group-hover:text-brand-pink transition-colors">
                          #{order.order_number}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-mono text-[12px] text-white/35">{"// "}{formatOrderDate(order.created_at)}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-poppins text-[14px] text-white/65 font-medium leading-tight group-hover:text-white/85 transition-colors">
                            {order.full_name}
                          </span>
                          <span className="font-mono text-[11px] text-white/20 truncate max-w-[180px]">{"// "}{order.email}
                          </span>
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-mono text-[15px] text-white/75 font-bold tabular-nums group-hover:text-white/90 transition-colors">
                          {formatOrderTotal(order.total)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusCell status={order.status} />
                      </td>

                      {/* Payment */}
                      <td className="px-4 py-3">
                        <PaymentCell method={order.payment_method} />
                      </td>

                      {/* ME mini-badge (scaffold) */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-[11px] text-white/12">{"// "}—</span>
                      </td>

                      {/* Actions */}
                      <td
                        className="px-4 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-white/20 hover:text-brand-pink border border-white/8 hover:border-brand-pink/30 hover:shadow-[0_0_8px_rgba(255,0,182,0.15)] px-2 py-1 transition-all duration-150"
                        >
                          <Eye size={13} />
                          Ver
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Pagination footer ── */}
      {(result.totalPages > 1 || paymentFilter) && (
        <div className="shrink-0 border-t border-white/5 px-6 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-widest text-white/20">{"// "}Pág. {currentPage} / {result.totalPages}
              {" · "}
              {result.total.toLocaleString("pt-BR")} pedidos
            </span>
            {paymentFilter && (
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#FFD700]/40">{"// "}Filtro de pagamento ativo (client-side)
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Page size — scaffold */}
            <div className="flex items-center gap-1.5 mr-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/12">{"// "}por pág.</span>
              <Badge variant="dev" label="25" />
            </div>

            <button
              disabled={currentPage <= 1}
              onClick={() => handlePageClick(currentPage - 1)}
              className="p-1.5 border border-white/8 text-white/20 hover:border-white/25 hover:text-white/50 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-150"
            >
              <ChevronLeft size={15} />
            </button>

            {pageNumbers.map((p, idx) =>
              p === "…" ? (
                <span key={`ellipsis-${idx}`} className="font-mono text-[12px] text-white/15 px-1">{"// "}…
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => handlePageClick(p)}
                  className={clsx(
                    "w-7 h-7 font-mono text-[12px] border transition-all duration-150",
                    p === currentPage
                      ? "border-brand-pink text-brand-pink bg-brand-pink/8 shadow-[0_0_6px_rgba(255,0,182,0.2)]"
                      : "border-white/8 text-white/25 hover:border-white/25 hover:text-white/55",
                  )}
                >
                  {p}
                </button>
              )
            )}

            <button
              disabled={currentPage >= result.totalPages}
              onClick={() => handlePageClick(currentPage + 1)}
              className="p-1.5 border border-white/8 text-white/20 hover:border-white/25 hover:text-white/50 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-150"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
