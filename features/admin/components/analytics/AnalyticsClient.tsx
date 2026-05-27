"use client";
/**
 * Component: AnalyticsClient — dashboard SCAFFOLD de analytics com gráficos CSS Y2K Chrome.
 *
 * KPI cards: receita 30d, pedidos 30d, AOV, crescimento placeholder.
 * Gráfico de barras CSS: receita diária últimos 30 dias.
 * Tabela Top 10 produtos: dados mock estáticos (requer order_items join — em desenvolvimento).
 * Placeholder de conversão.
 * DevBadge fixo no topo.
 *
 * Usado em: src/app/admin/analytics/page.tsx.
 */
import { TrendingUp, ShoppingBag, DollarSign, BarChart2, MousePointerClick } from "lucide-react";
import { DevBadge } from "@features/admin/components/motifs/DevBadge";

export interface DayRevenue {
  day: string;
  revenue: number;
  orders_count: number;
}

interface Props {
  dailyRevenue: DayRevenue[];
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
}

function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function fmtDay(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

const MOCK_TOP_PRODUCTS = [
  { name: "Óculos Solar Oversized", sku: "SUN-0001", revenue: 1248000, qty: 48 },
  { name: "Armação Vintage Round", sku: "OPT-0012", revenue: 956000, qty: 37 },
  { name: "Clip-On Polarizado", sku: "SUN-0034", revenue: 847500, qty: 45 },
  { name: "Óculos Gatinho Retrô", sku: "SUN-0007", revenue: 720000, qty: 30 },
  { name: "Armação Hexagonal", sku: "OPT-0029", revenue: 612000, qty: 24 },
  { name: "Óculos Esportivo UV400", sku: "SUN-0056", revenue: 540000, qty: 36 },
  { name: "Armação Aviador Slim", sku: "OPT-0018", revenue: 432000, qty: 18 },
  { name: "Óculos Cat-Eye Neon", sku: "SUN-0041", revenue: 360000, qty: 15 },
  { name: "Armação Redonda Metal", sku: "OPT-0033", revenue: 288000, qty: 12 },
  { name: "Óculos Quadrado Flat", sku: "SUN-0022", revenue: 240000, qty: 10 },
];

function RevenueBar({ day, revenue, maxRevenue }: {
  day: DayRevenue;
  revenue: number;
  maxRevenue: number;
}) {
  const pct = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
  const isEmpty = revenue === 0;

  return (
    <div className="flex flex-col items-center gap-1 group flex-1 min-w-0">
      <div className="relative w-full flex items-end" style={{ height: "80px" }}>
        <div
          className="w-full transition-all"
          style={{
            height: isEmpty ? "2px" : `${Math.max(pct, 2)}%`,
            background: isEmpty
              ? "rgba(255,255,255,0.05)"
              : pct > 80
                ? "linear-gradient(to top, #FF00B6, #FF6BD6)"
                : pct > 40
                  ? "linear-gradient(to top, #00F0FF, #7FD8FF)"
                  : "linear-gradient(to top, #FFD700, #FFE87A)",
            boxShadow: isEmpty
              ? "none"
              : pct > 80
                ? "0 0 8px rgba(255,0,182,0.4)"
                : pct > 40
                  ? "0 0 8px rgba(0,240,255,0.3)"
                  : "0 0 6px rgba(255,215,0,0.25)",
          }}
        />
        {!isEmpty && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-[#1a1a1a] border border-white/10 font-mono text-[7px] text-white/60 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {formatBRL(revenue)}
            <br />
            {day.orders_count} ped.
          </div>
        )}
      </div>
      <span className="font-mono text-[7px] text-white/20 rotate-45 origin-left translate-x-2">
        {fmtDay(day.day)}
      </span>
    </div>
  );
}

export function AnalyticsClient({
  dailyRevenue,
  totalRevenue,
  totalOrders,
  avgOrderValue,
}: Props) {
  const maxRevenue = Math.max(...dailyRevenue.map((d) => d.revenue), 1);

  const KPIS = [
    {
      label: "Receita 30d",
      value: formatBRL(totalRevenue),
      icon: DollarSign,
      color: "text-[#FFD700]",
      border: "border-[#FFD700]/20",
      glow: "shadow-[0_0_20px_rgba(255,215,0,0.08)]",
    },
    {
      label: "Pedidos 30d",
      value: totalOrders.toString(),
      icon: ShoppingBag,
      color: "text-[#00F0FF]",
      border: "border-[#00F0FF]/20",
      glow: "shadow-[0_0_20px_rgba(0,240,255,0.08)]",
    },
    {
      label: "Ticket Médio",
      value: avgOrderValue > 0 ? formatBRL(avgOrderValue) : "—",
      icon: TrendingUp,
      color: "text-[#FF00B6]",
      border: "border-[#FF00B6]/20",
      glow: "shadow-[0_0_20px_rgba(255,0,182,0.08)]",
    },
    {
      label: "Conversão",
      value: "—",
      icon: MousePointerClick,
      color: "text-white/25",
      border: "border-white/8",
      glow: "",
      scaffold: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <DevBadge />
        <div className="flex items-center gap-3">
          <BarChart2 size={18} className="text-[#FF00B6]" />
          <h1 className="font-shrikhand text-2xl text-white tracking-wide">
            Analytics
          </h1>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/25">
          Últimos 30 dias — UI completa de analytics em desenvolvimento
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-3">
        {KPIS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className={`border ${kpi.border} bg-[#141414] px-5 py-4 ${kpi.glow} shadow-[inset_1px_1px_0_rgba(255,255,255,0.03)]`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/25">
                  {kpi.label}
                </p>
                <Icon size={13} className={kpi.color} />
              </div>
              <p className={`font-mono text-xl ${kpi.color}`}>
                {kpi.value}
              </p>
              {kpi.scaffold && (
                <p className="font-mono text-[7px] text-white/20 mt-1 uppercase tracking-wider">
                  requer pixel/GA
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <div className="border border-white/5 bg-[#141414] p-5 shadow-[inset_1px_1px_0_rgba(255,255,255,0.03)]">
        <div className="flex items-center justify-between mb-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/40">
            Receita Diária — Últimos 30 Dias
          </p>
          <span className="font-mono text-[8px] text-white/20 uppercase tracking-widest">
            hover para detalhes
          </span>
        </div>

        {dailyRevenue.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <span className="font-mono text-[9px] uppercase tracking-widest text-white/20">
              Sem dados de receita no período
            </span>
          </div>
        ) : (
          <div className="flex items-end gap-px overflow-hidden" style={{ height: "100px" }}>
            {dailyRevenue.map((day) => (
              <RevenueBar
                key={day.day}
                day={day}
                revenue={day.revenue}
                maxRevenue={maxRevenue}
              />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-6 pt-3 border-t border-white/5">
          <div className="flex items-center gap-4">
            {[
              { color: "#FF00B6", label: "> 80% do pico" },
              { color: "#00F0FF", label: "> 40% do pico" },
              { color: "#FFD700", label: "< 40% do pico" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5" style={{ backgroundColor: l.color }} />
                <span className="font-mono text-[8px] text-white/25">{l.label}</span>
              </div>
            ))}
          </div>
          <span className="font-mono text-[8px] text-white/20">
            Total: {formatBRL(totalRevenue)}
          </span>
        </div>
      </div>

      {/* Top Products (mock) */}
      <div className="border border-white/5 bg-[#141414] shadow-[inset_1px_1px_0_rgba(255,255,255,0.03)]">
        <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/40">
            Top 10 Produtos por Receita
          </p>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[7px] uppercase tracking-widest border border-[#FFD700]/20 text-[#FFD700]/50">
            dados de demonstração
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#111111]">
                {["#", "Produto", "SKU", "Receita", "Qtd. Vendida"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.2em] text-white/20 font-normal border-b border-white/5 text-left"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_TOP_PRODUCTS.map((p, i) => (
                <tr
                  key={p.sku}
                  className={`border-b border-white/3 transition-colors hover:bg-[#FF00B6]/3 ${
                    i % 2 === 0 ? "bg-[#141414]" : "bg-[#111111]"
                  }`}
                >
                  <td className="px-4 py-2.5">
                    <span
                      className={`font-mono text-[11px] ${
                        i === 0
                          ? "text-[#FFD700]"
                          : i === 1
                            ? "text-white/50"
                            : i === 2
                              ? "text-[#FF6B35]/70"
                              : "text-white/20"
                      }`}
                    >
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[11px] text-white/60">
                    {p.name}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[10px] text-[#00F0FF]/40">
                    {p.sku}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[11px] text-[#FFD700]/70">
                    {formatBRL(p.revenue)}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[11px] text-white/40">
                    {p.qty}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Conversion Placeholder */}
      <div className="border border-white/5 bg-[#141414] p-8 flex flex-col items-center gap-4">
        <MousePointerClick size={28} className="text-white/10" />
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/20">
          Taxa de Conversão & Funil
        </p>
        <p className="font-mono text-[9px] text-white/12 text-center max-w-xs">
          Requer integração com pixel de rastreamento (Meta, GA4 ou TikTok).
          Configure em Admin → Configurações → Pixels.
        </p>
        <span
          className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#FF00B6]/20 font-mono text-[8px] uppercase tracking-[0.25em]"
          style={{
            background: "linear-gradient(90deg, #FF00B6, #00F0FF, #FFD700)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Em Desenvolvimento
        </span>
      </div>

      <p className="font-mono text-[8px] text-white/12 text-center uppercase tracking-[0.3em]">
        Analytics completo em desenvolvimento — top produtos são dados de demonstração
      </p>
    </div>
  );
}
