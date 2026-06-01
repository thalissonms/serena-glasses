"use client";
/**
 * Component: ShippingZonesClient — SCAFFOLD de zonas de frete.
 *
 * Cards mock por região BR. Filtro por região (client-side). KPI strip.
 * Botão "Configurar zona" desabilitado em cada card.
 * DevBadge "Atualmente frete via Melhor Envio único service".
 *
 * Usado em: src/app/admin/shipping-zones/page.tsx.
 */
import { useState } from "react";
import { Truck, MapPin, Lock, DollarSign, Clock, Package } from "lucide-react";

const ZONES = [
  {
    id: "zone-sp-capital",
    name: "São Paulo Capital",
    region: "SP",
    states: ["SP (capital)"],
    carriers: ["Correios PAC", "Correios SEDEX", "Jadlog"],
    avg_days: "2–4",
    avg_price: "R$ 18,90",
    orders_pct: 34,
    status: "active",
  },
  {
    id: "zone-sudeste",
    name: "Sudeste",
    region: "Sudeste",
    states: ["SP (interior)", "RJ", "MG", "ES"],
    carriers: ["Correios PAC", "Correios SEDEX"],
    avg_days: "4–7",
    avg_price: "R$ 22,50",
    orders_pct: 28,
    status: "active",
  },
  {
    id: "zone-sul",
    name: "Sul",
    region: "Sul",
    states: ["RS", "SC", "PR"],
    carriers: ["Correios PAC", "Correios SEDEX"],
    avg_days: "5–9",
    avg_price: "R$ 24,90",
    orders_pct: 16,
    status: "active",
  },
  {
    id: "zone-nordeste",
    name: "Nordeste",
    region: "Nordeste",
    states: ["BA", "CE", "PE", "MA", "outros"],
    carriers: ["Correios PAC"],
    avg_days: "7–14",
    avg_price: "R$ 28,90",
    orders_pct: 12,
    status: "active",
  },
  {
    id: "zone-norte-co",
    name: "Norte & Centro-Oeste",
    region: "N/CO",
    states: ["AM", "PA", "MT", "GO", "DF", "outros"],
    carriers: ["Correios PAC"],
    avg_days: "10–20",
    avg_price: "R$ 34,90",
    orders_pct: 10,
    status: "limited",
  },
];

const ALL_REGIONS = ["all", ...Array.from(new Set(ZONES.map((z) => z.region)))];

export function ShippingZonesClient() {
  const [region, setRegion] = useState("all");

  const visible = region === "all" ? ZONES : ZONES.filter((z) => z.region === region);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#FF00B6]/20 bg-[#FF00B6]/4 mb-1 self-start">
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-neon-pulse"
            aria-hidden="true"
          />
          <span
            className="font-mono text-[8px] uppercase tracking-[0.3em] font-bold"
            style={{
              background: "linear-gradient(90deg, #FF00B6, #00F0FF, #FFD700)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Atualmente frete via Melhor Envio — serviço único
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Truck size={18} className="text-[#FF00B6]" />
          <h1 className="font-shrikhand text-2xl text-white tracking-wide">
            Zonas de Frete
          </h1>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/25">
          Cobertura nacional via Melhor Envio · zonas abaixo são demonstrativas
        </p>
      </div>

      {/* ME notice */}
      <div className="border border-[#00F0FF]/15 bg-[#00F0FF]/4 p-4 flex items-start gap-3">
        <Truck size={14} className="text-[#00F0FF]/50 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-mono text-[10px] text-[#00F0FF]/60 uppercase tracking-wider">
            Melhor Envio — Cálculo em tempo real no checkout
          </p>
          <p className="font-mono text-[9px] text-white/30 leading-relaxed max-w-xl">
            O frete é calculado via API Melhor Envio no checkout. Configurações avançadas por
            zona (frete grátis regional, tabelas customizadas) requerem a criação da tabela{" "}
            <span className="text-[#00F0FF]/50">shipping_zones</span>.
          </p>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Regiões Cobertas", value: "5", icon: MapPin },
          { label: "Prazo Médio", value: "≈ 6 dias", icon: Clock },
          { label: "Frete Médio", value: "R$ 26,00", icon: DollarSign },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="border border-white/5 bg-[#141414] px-5 py-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={12} className="text-white/20" />
              <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/25">
                {label}
              </p>
            </div>
            <p className="font-mono text-xl text-white/50">{value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="appearance-none pl-3 pr-8 py-2 bg-[#0f0f0f] border border-white/8 focus:border-[#FF00B6]/40 font-mono text-[11px] text-white/40 outline-none transition-colors cursor-pointer"
        >
          {ALL_REGIONS.map((r) => (
            <option key={r} value={r}>
              {r === "all" ? "Todas as regiões" : r}
            </option>
          ))}
        </select>
        <span className="font-mono text-[9px] text-white/20 ml-auto">
          {visible.length} zona{visible.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Zone cards */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {visible.map((zone) => (
          <div
            key={zone.id}
            className="border border-white/8 bg-[#141414] p-4 hover:border-white/14 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#FF00B6]/60 shrink-0" />
                <p className="font-mono text-[12px] text-white font-bold">
                  {zone.name}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {zone.status === "limited" && (
                  <span className="px-2 py-0.5 font-mono text-[7px] uppercase tracking-widest border border-[#FFD700]/30 text-[#FFD700]/60">
                    Limitado
                  </span>
                )}
                <span className="px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest border border-white/8 text-white/25">
                  {zone.region}
                </span>
              </div>
            </div>

            {/* States */}
            <div className="flex flex-wrap gap-1 mb-3">
              {zone.states.map((s) => (
                <span
                  key={s}
                  className="px-2 py-0.5 font-mono text-[7px] uppercase tracking-wider border border-white/5 text-white/20 bg-white/1"
                >
                  {s}
                </span>
              ))}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5">
              <div>
                <p className="font-mono text-[7px] uppercase tracking-wider text-white/15 mb-0.5">
                  Prazo
                </p>
                <p className="font-mono text-[11px] text-white/40">{zone.avg_days} dias</p>
              </div>
              <div>
                <p className="font-mono text-[7px] uppercase tracking-wider text-white/15 mb-0.5">
                  Frete médio
                </p>
                <p className="font-mono text-[11px] text-white/40">{zone.avg_price}</p>
              </div>
              <div>
                <p className="font-mono text-[7px] uppercase tracking-wider text-white/15 mb-0.5">
                  % Pedidos
                </p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-[11px] text-white/40">{zone.orders_pct}%</p>
                  <div className="flex-1 h-1 bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-[#FF00B6]/30"
                      style={{ width: `${zone.orders_pct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Carriers */}
            <div className="mt-3 pt-3 border-t border-white/5">
              <p className="font-mono text-[7px] uppercase tracking-wider text-white/15 mb-1.5">
                Transportadoras
              </p>
              <div className="flex flex-wrap gap-1">
                {zone.carriers.map((c) => (
                  <span
                    key={c}
                    className="flex items-center gap-1 px-2 py-0.5 font-mono text-[7px] uppercase tracking-wider border border-[#00F0FF]/10 text-[#00F0FF]/30"
                  >
                    <Package size={8} />
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled
              className="mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 font-mono text-[8px] uppercase tracking-widest border border-white/5 text-white/12 cursor-not-allowed"
            >
              <Lock size={9} />
              Configurar zona
            </button>
          </div>
        ))}
      </div>

      <p className="font-mono text-[8px] text-white/12 text-center uppercase tracking-[0.3em]">
        Dados demonstrativos · zonas reais requerem tabela shipping_zones
      </p>
    </div>
  );
}
