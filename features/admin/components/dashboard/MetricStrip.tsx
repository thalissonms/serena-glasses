"use client";
/**
 * Component: MetricStrip — faixa de 4 métricas com seletor de faixa de tempo.
 *
 * Tabs (Hoje / 7d / 30d / Total) trocam entre os buckets pré-computados no servidor.
 * Cards chrome com shadow-hard-pink, número em font-jocham, label monospace uppercase.
 *
 * Usado em: src/app/admin/page.tsx.
 */
import { useState } from "react";
import { DollarSign, ShoppingCart, TrendingUp, Users } from "lucide-react";
import type { TimeRangeMetrics } from "@features/admin/services/dashboard.service";
import { formatPrice } from "@features/products/utils/formatPrice";

type Range = "today" | "week" | "month" | "allTime";

const RANGES: Array<{ key: Range; label: string }> = [
  { key: "today", label: "Hoje" },
  { key: "week", label: "7 dias" },
  { key: "month", label: "30 dias" },
  { key: "allTime", label: "Total" },
];

interface Props {
  today: TimeRangeMetrics;
  week: TimeRangeMetrics;
  month: TimeRangeMetrics;
  allTime: TimeRangeMetrics;
}

export function MetricStrip({ today, week, month, allTime }: Props) {
  const [range, setRange] = useState<Range>("month");

  const data: Record<Range, TimeRangeMetrics> = { today, week, month, allTime };
  const current = data[range];

  const metrics = [
    {
      label: "Receita",
      value: formatPrice(current.revenue),
      sub: `${current.orders} pedido${current.orders !== 1 ? "s" : ""}`,
      icon: DollarSign,
      accent: "var(--brand-success)",
    },
    {
      label: "Pedidos",
      value: current.orders.toString(),
      sub: current.orders > 0 ? "confirmados" : "sem pedidos",
      icon: ShoppingCart,
      accent: "var(--brand-pink)",
    },
    {
      label: "Ticket Médio",
      value: current.aov > 0 ? formatPrice(current.aov) : "—",
      sub: "por pedido pago",
      icon: TrendingUp,
      accent: "var(--brand-warning)",
    },
    {
      label: "Clientes",
      value: current.customers.toString(),
      sub: "compradores únicos",
      icon: Users,
      accent: "var(--brand-danger)",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-1">
        {RANGES.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setRange(key)}
            className={[
              "px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.25em] border transition-all duration-150 rounded-none",
              range === key
                ? "border-[var(--brand-pink)]/50 text-[var(--brand-pink)] bg-[var(--brand-pink)]/5 shadow-[inset_0_0_15px_rgba(255,0,182,0.1)]"
                : "border-white/10 text-white/30 hover:border-white/20 hover:text-white/50 cursor-pointer bg-transparent",
            ].join(" ")}
          >
            [ {label} ]
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map(({ label, value, sub, icon: Icon, accent }) => (
          <div
            key={label}
            className="bg-[#050505] border border-white/15 p-5 relative overflow-hidden transition-transform duration-150 hover:-translate-x-px hover:-translate-y-px rounded-none"
            style={{ border: `1px solid ${accent}`, boxShadow: `inset 0 0 15px ${accent}0d` }}
          >
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.025]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 2px)",
                backgroundSize: "100% 4px",
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/50">
                  {label}
                </span>
                <Icon size={28} strokeWidth={2.5} style={{ color: accent, opacity: 0.8 }} />
              </div>
              <span
                className="font-poppins font-bold text-[24px] leading-none text-white"
              >
                {value}
              </span>
              <span className="font-mono text-[12px] text-white/30 uppercase">{"//"} {sub}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
