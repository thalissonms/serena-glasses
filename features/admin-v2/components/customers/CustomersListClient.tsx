"use client";
/**
 * Component: CustomersListClient — listagem SCAFFOLD de clientes com filtros Y2K Chrome.
 *
 * Filtros client-side: busca por email/nome, ordenação por gasto/pedidos/cadastro.
 * KPI strip: total cadastros, com compras, receita total.
 * Table: nome, email, telefone, total_orders, total_spent, data de cadastro.
 * Read-only — sem CRUD. DevBadge holográfico no topo.
 *
 * Usado em: src/app/admin-v2/customers/page.tsx.
 */
import { useState, useMemo } from "react";
import { Search, Users, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { AsciiEmpty } from "@features/admin-v2/components/motifs/AsciiEmpty";
import { DevBadge } from "@features/admin-v2/components/motifs/DevBadge";

export interface CustomerRow {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  created_at: string | null;
  total_orders: number;
  total_spent: number;
}

interface Props {
  customers: CustomerRow[];
}

type SortKey = "total_spent" | "total_orders" | "created_at";
type SortDir = "asc" | "desc";

function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR");
}

const COLS: {
  label: string;
  sortKey?: SortKey;
}[] = [
  { label: "NOME" },
  { label: "EMAIL" },
  { label: "TELEFONE" },
  { label: "PEDIDOS", sortKey: "total_orders" },
  { label: "GASTO TOTAL", sortKey: "total_spent" },
  { label: "CADASTRO", sortKey: "created_at" },
];

export function CustomersListClient({ customers }: Props) {
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("total_spent");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const filtered = useMemo(() => {
    const lower = q.toLowerCase();
    const src = q
      ? customers.filter(
          (c) =>
            c.email.toLowerCase().includes(lower) ||
            (c.name ?? "").toLowerCase().includes(lower),
        )
      : customers;

    return [...src].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "created_at") {
        cmp = (a.created_at ?? "").localeCompare(b.created_at ?? "");
      } else {
        cmp = a[sortKey] - b[sortKey];
      }
      return sortDir === "desc" ? -cmp : cmp;
    });
  }, [customers, q, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function SortChevron({ k }: { k: SortKey }) {
    if (k !== sortKey)
      return <ArrowUpDown size={9} className="text-white/20" />;
    return sortDir === "desc" ? (
      <ArrowDown size={9} className="text-[#FF00B6]" />
    ) : (
      <ArrowUp size={9} className="text-[#FF00B6]" />
    );
  }

  const totalRevenue = customers.reduce((s, c) => s + c.total_spent, 0);
  const withOrders = customers.filter((c) => c.total_orders > 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <DevBadge />
        <div className="flex items-center gap-3">
          <Users size={18} className="text-[#FF00B6]" />
          <h1 className="font-shrikhand text-2xl text-white tracking-wide">
            Clientes
          </h1>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/25">
          {customers.length} clientes registrados — somente leitura
        </p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Cadastros", value: customers.length.toString() },
          { label: "Com Compras", value: withOrders.toString() },
          { label: "Receita Total", value: formatBRL(totalRevenue) },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="border border-white/5 bg-[#141414] px-5 py-4 shadow-[inset_1px_1px_0_rgba(255,255,255,0.03)]"
          >
            <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/25 mb-1">
              {kpi.label}
            </p>
            <p className="font-mono text-xl text-white/80">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
        />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="BUSCAR POR EMAIL OU NOME..."
          className="w-full pl-9 pr-4 py-2.5 bg-[#141414] border border-white/8 font-mono text-[11px] text-white/70 placeholder:text-white/20 focus:outline-none focus:border-[#FF00B6]/40 transition-all"
        />
      </div>

      {/* Table */}
      <div className="border border-white/5 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#1a1a1a] shadow-[inset_1px_1px_0_rgba(255,255,255,0.05)]">
              {COLS.map((col) => (
                <th
                  key={col.label}
                  onClick={col.sortKey ? () => handleSort(col.sortKey!) : undefined}
                  className={`px-4 py-3 font-mono text-[8px] uppercase tracking-[0.25em] text-white/25 font-normal border-b border-white/5 text-left ${col.sortKey ? "cursor-pointer hover:text-white/50 select-none" : ""}`}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortKey && <SortChevron k={col.sortKey} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <AsciiEmpty
                    message="Nenhum cliente encontrado"
                    description={
                      q ? "Sem resultados para o termo buscado" : undefined
                    }
                  />
                </td>
              </tr>
            ) : (
              filtered.map((c, i) => (
                <tr
                  key={c.id}
                  className={`border-b border-white/3 transition-colors hover:bg-[#FF00B6]/4 ${
                    i % 2 === 0 ? "bg-[#141414]" : "bg-[#111111]"
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-[11px] text-white/60">
                    {c.name ?? <span className="text-white/20">—</span>}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-[#00F0FF]/60">
                    {c.email}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-white/35">
                    {c.phone ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-[11px]">
                    <span
                      className={
                        c.total_orders > 0 ? "text-[#FF00B6]" : "text-white/20"
                      }
                    >
                      {c.total_orders}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px]">
                    <span
                      className={
                        c.total_spent > 0
                          ? "text-[#FFD700]/80"
                          : "text-white/20"
                      }
                    >
                      {c.total_spent > 0 ? formatBRL(c.total_spent) : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] text-white/30">
                    {fmtDate(c.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="font-mono text-[8px] text-white/12 text-center uppercase tracking-[0.3em]">
        {filtered.length} / {customers.length} registros — CRUD em desenvolvimento
      </p>
    </div>
  );
}
