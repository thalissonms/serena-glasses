"use client";
/**
 * Component: CouponUsageClient — SCAFFOLD analytics de uso de cupons.
 *
 * Cards top 10 cupons por receita descontada: código, total_uses, total_discount_cents,
 * top emails (lista). Filtro de date range client-side.
 * DevBadge no topo.
 *
 * Usado em: src/app/admin/coupons/usage/page.tsx.
 */
import { useState, useMemo } from "react";
import { Tag, TrendingDown, Users, Percent, ChevronDown } from "lucide-react";
import { DevBadge } from "@features/admin/components/motifs/DevBadge";
import { AsciiEmpty } from "@features/admin/components/motifs/AsciiEmpty";

export interface CouponUsageRecord {
  id: string;
  coupon_id: string;
  coupon_code: string;
  discount_type: string;
  order_id: string | null;
  user_email: string | null;
  discount_amount_cents: number;
  created_at: string;
}

export interface CouponStat {
  coupon_id: string;
  coupon_code: string;
  discount_type: string;
  total_uses: number;
  total_discount_cents: number;
  top_emails: string[];
}

interface Props {
  usages: CouponUsageRecord[];
}

function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function DiscountTypeBadge({ type }: { type: string }) {
  const map: Record<string, { label: string; color: string }> = {
    percentage: { label: "%", color: "text-brand-pink border-brand-pink/30 bg-brand-pink/8" },
    fixed_amount: { label: "R$", color: "text-[#FFD700] border-[#FFD700]/30 bg-[#FFD700]/8" },
    free_shipping: { label: "FRETE", color: "text-emerald-400 border-emerald-400/30 bg-emerald-400/8" },
  };
  const meta = map[type] ?? { label: type, color: "text-white/40 border-white/10 bg-white/5" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest border ${meta.color}`}>
      {meta.label}
    </span>
  );
}

const NEON_PALETTE = [
  { border: "border-brand-pink/25", glow: "shadow-[0_0_20px_rgba(255,0,182,0.06)]", accent: "text-brand-pink", bar: "var(--brand-pink)" },
  { border: "border-brand-pink/25", glow: "shadow-[0_0_20px_rgba(255,0,182,0.06)]", accent: "text-brand-pink", bar: "brand-pink" },
  { border: "border-[#FFD700]/25", glow: "shadow-[0_0_20px_rgba(255,215,0,0.06)]", accent: "text-[#FFD700]", bar: "#FFD700" },
  { border: "border-white/10", glow: "", accent: "text-white/40", bar: "rgba(255,255,255,0.15)" },
];

function getPalette(index: number) {
  if (index === 0) return NEON_PALETTE[0];
  if (index === 1) return NEON_PALETTE[1];
  if (index === 2) return NEON_PALETTE[2];
  return NEON_PALETTE[3];
}

function CouponCard({ stat, rank, maxDiscount }: { stat: CouponStat; rank: number; maxDiscount: number }) {
  const [showEmails, setShowEmails] = useState(false);
  const palette = getPalette(rank);
  const barPct = maxDiscount > 0 ? (stat.total_discount_cents / maxDiscount) * 100 : 0;

  return (
    <div className={`border ${palette.border} bg-[#0a0a0a] ${palette.glow} shadow-[inset_1px_1px_0_rgba(255,255,255,0.03)] flex flex-col gap-3 p-5`}>
      {/* Rank + code */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className={`font-mono text-2xl font-bold ${palette.accent} leading-none`}>
            {String(rank + 1).padStart(2, "0")}
          </span>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[15px] font-bold text-white/80 tracking-widest uppercase">
              {stat.coupon_code}
            </span>
            <DiscountTypeBadge type={stat.discount_type} />
          </div>
        </div>
        <div className="text-right">
          <p className={`font-mono text-lg font-bold ${palette.accent}`}>
            {formatBRL(stat.total_discount_cents)}
          </p>
          <p className="font-mono text-[10px] text-white/25 uppercase tracking-widest">{"// "}descontado</p>
        </div>
      </div>

      {/* Bar */}
      <div className="w-full h-1 bg-white/5">
        <div
          className="h-full transition-all"
          style={{
            width: `${barPct}%`,
            background: palette.bar,
            boxShadow: `0 0 6px ${palette.bar}66`,
          }}
        />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="border border-white/5 bg-[#050505] px-3 py-2">
          <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mb-0.5">{"// "}Usos</p>
          <p className={`font-mono text-lg ${palette.accent}`}>{stat.total_uses}</p>
        </div>
        <div className="border border-white/5 bg-[#050505] px-3 py-2">
          <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mb-0.5">{"// "}Ticket Médio</p>
          <p className="font-mono text-[15px] text-white/50">
            {stat.total_uses > 0 ? formatBRL(Math.round(stat.total_discount_cents / stat.total_uses)) : "—"}
          </p>
        </div>
      </div>

      {/* Top emails */}
      {stat.top_emails.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowEmails((v) => !v)}
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-white/25 hover:text-white/50 transition-colors"
          >
            <Users size={12} />
            {stat.top_emails.length} cliente{stat.top_emails.length !== 1 ? "s" : ""}
            <ChevronDown size={12} className={`transition-transform ${showEmails ? "rotate-180" : ""}`} />
          </button>
          {showEmails && (
            <ul className="mt-2 flex flex-col gap-0.5">
              {stat.top_emails.slice(0, 5).map((email) => (
                <li key={email} className="font-mono text-[11px] text-white/30 truncate pl-3 border-l border-white/8">{"// "}{email}
                </li>
              ))}
              {stat.top_emails.length > 5 && (
                <li className="font-mono text-[10px] text-white/20 pl-3">{"// "}+{stat.top_emails.length - 5} outros
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export function CouponUsageClient({ usages }: Props) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = useMemo(() => {
    return usages.filter((u) => {
      if (dateFrom && u.created_at < dateFrom) return false;
      if (dateTo && u.created_at > dateTo + "T23:59:59") return false;
      return true;
    });
  }, [usages, dateFrom, dateTo]);

  const stats = useMemo<CouponStat[]>(() => {
    const map = new Map<string, CouponStat>();
    for (const u of filtered) {
      if (!map.has(u.coupon_code)) {
        map.set(u.coupon_code, {
          coupon_id: u.coupon_id,
          coupon_code: u.coupon_code,
          discount_type: u.discount_type,
          total_uses: 0,
          total_discount_cents: 0,
          top_emails: [],
        });
      }
      const s = map.get(u.coupon_code)!;
      s.total_uses += 1;
      s.total_discount_cents += u.discount_amount_cents;
      if (u.user_email && !s.top_emails.includes(u.user_email)) {
        s.top_emails.push(u.user_email);
      }
    }
    return Array.from(map.values()).sort((a, b) => b.total_discount_cents - a.total_discount_cents).slice(0, 10);
  }, [filtered]);

  const totals = useMemo(() => ({
    totalUses: filtered.length,
    totalDiscount: filtered.reduce((s, u) => s + u.discount_amount_cents, 0),
    uniqueCoupons: new Set(filtered.map((u) => u.coupon_code)).size,
    uniqueEmails: new Set(filtered.map((u) => u.user_email).filter(Boolean)).size,
  }), [filtered]);

  const maxDiscount = stats[0]?.total_discount_cents ?? 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <DevBadge />
        <div className="flex items-center gap-3">
          <Tag size={18} className="text-brand-pink" />
          <h1 className="font-poppins font-black text-2xl text-white tracking-wide">
            Uso de Cupons
          </h1>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/25">{"// "}Top 10 cupons por desconto total — analytics completo em desenvolvimento
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {[
          { label: "Total de Usos", value: totals.totalUses, color: "text-white/60", icon: Tag },
          { label: "Desconto Total", value: formatBRL(totals.totalDiscount), color: "text-brand-pink", icon: TrendingDown },
          { label: "Cupons Únicos", value: totals.uniqueCoupons, color: "text-brand-pink", icon: Percent },
          { label: "Clientes Únicos", value: totals.uniqueEmails, color: "text-[#FFD700]", icon: Users },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="border border-white/5 bg-[#0a0a0a] px-5 py-4 shadow-[inset_1px_1px_0_rgba(255,255,255,0.03)]">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 mb-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/25">{"// "}{kpi.label}</p>
                <Icon size={15} className={kpi.color} />
              </div>
              <p className={`font-mono text-xl ${kpi.color}`}>{kpi.value}</p>
            </div>
          );
        })}
      </div>

      {/* Date range filter */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] uppercase tracking-widest text-white/25">{"// "}Período:</span>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="px-3 py-2 bg-[#050505] border border-white/8 focus:border-brand-pink/30 font-mono text-[12px] text-white/40 outline-none transition-colors"
        />
        <span className="font-mono text-[11px] text-white/20">{"// "}até</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="px-3 py-2 bg-[#050505] border border-white/8 focus:border-brand-pink/30 font-mono text-[12px] text-white/40 outline-none transition-colors"
        />{"// "}{(dateFrom || dateTo) && (
          <button
            type="button"
            onClick={() => { setDateFrom(""); setDateTo(""); }}
            className="font-mono text-[11px] uppercase tracking-widest text-white/25 hover:text-white/50 transition-colors border border-white/8 px-3 py-2"
          >{"// "}Limpar
          </button>
        )}
      </div>

      {/* Cards grid */}
      {stats.length === 0 ? (
        <AsciiEmpty message="Nenhum uso de cupom" description="Sem dados no período selecionado" />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {stats.map((stat, i) => (
            <CouponCard key={stat.coupon_id} stat={stat} rank={i} maxDiscount={maxDiscount} />
          ))}
        </div>
      )}

      <p className="font-mono text-[10px] text-white/12 text-center uppercase tracking-[0.3em]">{"// "}{stats.length} cupons exibidos de {totals.uniqueCoupons} únicos — clique nos cards para expandir emails
      </p>
    </div>
  );
}
