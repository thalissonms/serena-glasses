"use client";
/**
 * Component: InventoryListClient — alertas SCAFFOLD de estoque baixo com tabs Y2K Chrome.
 *
 * Tabs: Todos (<10) / Baixo (<5) / Crítico (=0).
 * Sort por stock_quantity ASC (padrão).
 * Table: código variante, produto + cor, swatch cor, estoque, flag in_stock, ação Restock desabilitada.
 * DevBadge no topo.
 *
 * Usado em: src/app/admin/inventory/page.tsx.
 */
import { useState, useMemo } from "react";
import { Warehouse, AlertTriangle, XCircle, Package } from "lucide-react";
import { AsciiEmpty } from "@features/admin/components/motifs/AsciiEmpty";
import { DevBadge } from "@features/admin/components/motifs/DevBadge";

export interface InventoryVariant {
  id: string;
  product_id: string;
  product_name: string;
  product_code: string | null;
  variant_code: string | null;
  color_name: string;
  color_hex: string;
  stock_quantity: number;
  in_stock: boolean | null;
}

interface Props {
  variants: InventoryVariant[];
}

type Tab = "all" | "low" | "critical";

const TABS: { value: Tab; label: string; threshold: (q: number) => boolean }[] = [
  { value: "all", label: "Todos < 10", threshold: (q) => q < 10 },
  { value: "low", label: "Baixo < 5", threshold: (q) => q > 0 && q < 5 },
  { value: "critical", label: "Crítico = 0", threshold: (q) => q === 0 },
];

function StockBadge({ qty }: { qty: number }) {
  if (qty === 0)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[11px] border border-red-500/30 bg-red-500/8 text-red-400">
        <XCircle size={12} />
        ZERADO
      </span>
    );
  if (qty < 3)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[11px] border border-brand-pink/30 bg-brand-pink/8 text-brand-pink">
        <AlertTriangle size={12} />
        CRÍTICO
      </span>
    );
  return (
    <span className="px-2 py-0.5 font-mono text-[11px] border border-[#FFD700]/30 bg-[#FFD700]/8 text-[#FFD700]">{"// "}BAIXO
    </span>
  );
}

export function InventoryListClient({ variants }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const filtered = useMemo(() => {
    const threshold = TABS.find((t) => t.value === activeTab)!.threshold;
    return [...variants]
      .filter((v) => threshold(v.stock_quantity))
      .sort((a, b) => a.stock_quantity - b.stock_quantity);
  }, [variants, activeTab]);

  const counts = useMemo(
    () => ({
      all: variants.length,
      low: variants.filter((v) => v.stock_quantity > 0 && v.stock_quantity < 5).length,
      critical: variants.filter((v) => v.stock_quantity === 0).length,
    }),
    [variants],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <DevBadge />
        <div className="flex items-center gap-3">
          <Warehouse size={18} className="text-brand-pink" />
          <h1 className="font-poppins font-black text-2xl text-white tracking-wide">
            Inventário
          </h1>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/25">{"// "}{variants.length} variantes com estoque abaixo de 10 unidades
        </p>
      </div>

      {/* Alert strip */}
      {counts.critical > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 border border-red-500/30 bg-red-500/5">
          <XCircle size={17} className="text-red-400 shrink-0" />
          <p className="font-mono text-[12px] text-red-400/80 uppercase tracking-wider">{"// "}{counts.critical} variante{counts.critical > 1 ? "s" : ""} com estoque zerado — reposição necessária
          </p>
        </div>
      )}

      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { label: "Estoque < 10", value: counts.all, color: "text-[#FFD700]/80" },
          { label: "Estoque < 5", value: counts.low, color: "text-brand-pink" },
          { label: "Estoque = 0", value: counts.critical, color: "text-red-400" },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="border border-white/5 bg-[#0a0a0a] px-5 py-4 shadow-[inset_1px_1px_0_rgba(255,255,255,0.03)]"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/25 mb-1">{"// "}{kpi.label}
            </p>
            <p className={`font-mono text-2xl ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-white/8">
        {TABS.map((tab) => {
          const active = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest border-b-2 transition-all -mb-px ${
                active
                  ? "border-brand-pink text-brand-pink"
                  : "border-transparent text-white/30 hover:text-white/50"
              }`}
            >
              {tab.label}
              <span
                className={`ml-2 ${active ? "text-brand-pink" : "text-white/20"}`}
              >
                ({counts[tab.value]})
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="border border-white/5 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0a0a0a] shadow-[inset_1px_1px_0_rgba(255,255,255,0.05)]">
              {[
                "CÓDIGO",
                "PRODUTO",
                "COR",
                "ESTOQUE",
                "STATUS LOJA",
                "AÇÃO",
              ].map((label) => (
                <th
                  key={label}
                  className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/25 font-normal border-b border-white/5 text-left"
                >{"// "}{label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <AsciiEmpty
                    message="Nenhuma variante nesta categoria"
                    description="Estoque saudável neste filtro"
                  />
                </td>
              </tr>
            ) : (
              filtered.map((v, i) => (
                <tr
                  key={v.id}
                  className={`border-b border-white/3 transition-colors ${
                    v.stock_quantity === 0
                      ? "hover:bg-red-500/4"
                      : "hover:bg-brand-pink/4"
                  } ${i % 2 === 0 ? "bg-[#0a0a0a]" : "bg-[#0a0a0a]"}`}
                >
                  <td className="px-4 py-3 font-mono text-[12px] text-brand-pink/50">{"// "}{v.variant_code ??
                      `${v.product_code ?? "—"}-${v.color_name.slice(0, 3).toUpperCase()}`}
                  </td>
                  <td className="px-4 py-3 font-mono text-[13px] text-white/60">
                    {v.product_name}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 border border-white/10 shrink-0"
                        style={{ backgroundColor: v.color_hex }}
                      />
                      <span className="font-mono text-[12px] text-white/40">{"// "}{v.color_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-lg font-bold ${
                          v.stock_quantity === 0
                            ? "text-red-400"
                            : v.stock_quantity < 3
                              ? "text-brand-pink"
                              : "text-[#FFD700]"
                        }`}
                      >
                        {v.stock_quantity}
                      </span>
                      <StockBadge qty={v.stock_quantity} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-mono text-[11px] uppercase tracking-widest ${
                        v.in_stock ? "text-emerald-400/70" : "text-red-400/50"
                      }`}
                    >
                      {v.in_stock ? "Ativo" : "Pausado"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative group/restock">
                      <button
                        type="button"
                        disabled
                        className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-white/15 border border-white/5 bg-white/2 cursor-not-allowed"
                      >
                        <Package size={13} />
                        Repor
                      </button>
                      <div className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-[#0a0a0a] border border-white/10 font-mono text-[10px] text-white/50 whitespace-nowrap opacity-0 group-hover/restock:opacity-100 transition-opacity pointer-events-none z-10">{"// "}Gestão de reposição em breve
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="font-mono text-[10px] text-white/12 text-center uppercase tracking-[0.3em]">{"// "}{filtered.length} variantes exibidas — ações de reposição em desenvolvimento
      </p>
    </div>
  );
}
