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
      accent: "#00EE88",
    },
    {
      label: "Pedidos",
      value: current.orders.toString(),
      sub: current.orders > 0 ? "confirmados" : "sem pedidos",
      icon: ShoppingCart,
      accent: "#00F0FF",
    },
    {
      label: "Ticket Médio",
      value: current.aov > 0 ? formatPrice(current.aov) : "—",
      sub: "por pedido pago",
      icon: TrendingUp,
      accent: "#FFD700",
    },
    {
      label: "Clientes",
      value: current.customers.toString(),
      sub: "compradores únicos",
      icon: Users,
      accent: "#FF3355",
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
              "px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.25em] border transition-all duration-150",
              range === key
                ? "border-gray-400 text-gray-400 bg-gray-400/8 shadow-[0px_0px_8px] shadow-gray-400/25"
                : "border-white/10 text-white/30 hover:border-white/20 hover:text-white/50 cursor-pointer",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map(({ label, value, sub, icon: Icon, accent }) => (
          <div
            key={label}
            className="bg-[#141414] border border-white/15 p-5 relative overflow-hidden transition-transform duration-150 hover:-translate-x-px hover:-translate-y-px"
            style={{ boxShadow: `4px 4px 0 ${accent}` }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow:
                  "inset 1px 1px 0 rgba(255,255,255,0.06), inset -1px -1px 0 rgba(0,0,0,0.4)",
              }}
              aria-hidden="true"
            />
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
                <span className="font-mono text-1 uppercase tracking-[0.35em] text-white/50">
                  {label}
                </span>
                <Icon size={28} strokeWidth={2.5} style={{ color: accent, opacity: 0.8 }} />
              </div>
              <span
                className="font-family-poppins font-bold text-[24px] leading-none text-white"
                style={{ textShadow: `0 0 20px ${accent}20` }}
              >
                {value}
              </span>
              <span className="font-mono text-[14px] text-white/30">{sub}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
