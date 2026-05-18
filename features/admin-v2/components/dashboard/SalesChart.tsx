"use client";
/**
 * Component: SalesChart — gráfico de barras SVG de receita dos últimos 30 dias.
 *
 * Scaffold visual: dados reais do sparkline (calculados no servidor), renderizados como
 * barras SVG com neon pink. Sem dependência de biblioteca externa de charts.
 *
 * Usado em: src/app/admin-v2/page.tsx.
 */
import { useState } from "react";
import type { SparklinePoint } from "@features/admin-v2/services/dashboard.service";
import { formatPrice } from "@features/products/utils/formatPrice";

interface Props {
  data: SparklinePoint[];
}

export function SalesChart({ data }: Props) {
  const [hovered, setHovered] = useState<SparklinePoint | null>(null);

  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);
  const hasData = data.some((d) => d.revenue > 0);

  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);

function formatLabel(iso: string) {
  const [_, month, day] = iso.split("-");
  return `${day}/${month}`;
}

  return (
    <div
      className="bg-[#141414] border border-white/10 p-5 relative overflow-hidden shadow-[4px_4px_0px] shadow-gray-500"

    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow:
            "inset 1px 1px 0 rgba(255,255,255,0.06), inset -1px -1px 0 rgba(0,0,0,0.4)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/40">
              Receita — Últimos 30 dias
            </p>
            {hasData && (
                <span className="flex flex-col font-family-poppins font-bold text-xl text-white mt-1">
                  <span className="font-mono text-[10px] text-white/25 uppercase">
                    {hovered
                      ? hovered.date.slice(5).replace("-", "/")
                      : "total"}
                  </span>
                  {hovered
                    ? formatPrice(hovered.revenue)
                    : formatPrice(totalRevenue)}
                </span>
            )}
          </div>
          <span className="font-mono font-bold text-1 tracking-wider text-brand-pink/60 border border-brand-pink/15 px-2 py-0.5">
            30d
          </span>
        </div>

        {!hasData ? (
          <div className="h-24 flex items-center justify-center">
            <p className="font-mono text-[9px] uppercase tracking-widest text-white/15">
              Sem dados de receita
            </p>
          </div>
        ) : (
          <div className="flex items-end gap-px h-24 group/chart">
            {data.map((point) => {
              const pct =
                maxRevenue > 0 ? (point.revenue / maxRevenue) * 100 : 0;
              const isActive = hovered?.date === point.date;
              return (
                <div
                  key={point.date}
                  className="flex-1 flex flex-col justify-end cursor-default"
                  onMouseEnter={() => setHovered(point)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div
                    className="w-full transition-all duration-150"
                    style={{
                      height: `${Math.max(pct, point.revenue > 0 ? 2 : 0)}%`,
                      background:
                        point.revenue > 0
                          ? isActive
                            ? "linear-gradient(to top, #FF00B6, #FF88E0)"
                            : "linear-gradient(to top, #FF00B6cc, #FF00B666)"
                          : "rgba(255,255,255,0.04)",
                      boxShadow:
                        isActive && point.revenue > 0
                          ? "0 0 8px rgba(255,0,182,0.6)"
                          : "none",
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-between mt-2">
          <span className="font-mono text-1 text-white/25">
            {data[0] ? formatLabel(data[0].date) : ""}
          </span>
          <span className="font-mono text-1 text-white/25">
            {data[data.length - 1]
              ? formatLabel(data[data.length - 1].date)
              : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
