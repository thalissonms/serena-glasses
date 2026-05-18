"use client";
/**
 * Component: ShipmentsClient — SCAFFOLD timeline de rastreamento agrupada por pedido.
 *
 * Agrupa order_tracking_events por order_id em timeline vertical com conectores.
 * Badges me_status com cores neon por categoria de evento.
 * Filtros: busca por order_number, select de me_status.
 * DevBadge no topo.
 *
 * Usado em: src/app/admin-v2/shipments/page.tsx.
 */
import { useState, useMemo } from "react";
import { Truck, Search, ChevronDown, ChevronRight, Clock, Package, CheckCircle, AlertTriangle, XCircle, MapPin } from "lucide-react";
import { DevBadge } from "@features/admin-v2/components/motifs/DevBadge";
import { AsciiEmpty } from "@features/admin-v2/components/motifs/AsciiEmpty";

export interface TrackingEvent {
  id: string;
  order_id: string;
  me_status: string;
  message: string | null;
  created_at: string;
  order_number: string;
  user_email: string | null;
}

export interface OrderTimeline {
  order_id: string;
  order_number: string;
  user_email: string | null;
  events: TrackingEvent[];
  last_status: string;
  last_updated: string;
}

interface Props {
  timelines: OrderTimeline[];
}

const ME_STATUS_LABELS: Record<string, { label: string; color: string; bg: string; icon: typeof Truck }> = {
  posted: { label: "Postado", color: "text-[#00F0FF]", bg: "bg-[#00F0FF]/10 border-[#00F0FF]/30", icon: Package },
  in_transit: { label: "Em Trânsito", color: "text-[#FFD700]", bg: "bg-[#FFD700]/10 border-[#FFD700]/30", icon: Truck },
  out_for_delivery: { label: "Saiu p/ Entrega", color: "text-[#FF00B6]", bg: "bg-[#FF00B6]/10 border-[#FF00B6]/30", icon: MapPin },
  delivered: { label: "Entregue", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/30", icon: CheckCircle },
  failed: { label: "Falha", color: "text-red-400", bg: "bg-red-400/10 border-red-400/30", icon: XCircle },
  exception: { label: "Exceção", color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/30", icon: AlertTriangle },
  waiting: { label: "Aguardando", color: "text-white/40", bg: "bg-white/5 border-white/10", icon: Clock },
};

function getStatusMeta(status: string) {
  return ME_STATUS_LABELS[status] ?? {
    label: status,
    color: "text-white/50",
    bg: "bg-white/5 border-white/10",
    icon: Clock,
  };
}

function StatusBadge({ status }: { status: string }) {
  const meta = getStatusMeta(status);
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest border ${meta.bg} ${meta.color}`}>
      <Icon size={9} />
      {meta.label}
    </span>
  );
}

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

function TimelineRow({ timeline }: { timeline: OrderTimeline }) {
  const [expanded, setExpanded] = useState(false);
  const lastMeta = getStatusMeta(timeline.last_status);
  const LastIcon = lastMeta.icon;

  return (
    <div className="border border-white/5 bg-[#141414] shadow-[inset_1px_1px_0_rgba(255,255,255,0.03)]">
      {/* Order header */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 px-5 py-3.5 text-left hover:bg-white/2 transition-colors group"
      >
        <span className={`shrink-0 transition-transform ${expanded ? "rotate-90" : ""}`}>
          <ChevronRight size={13} className="text-white/25 group-hover:text-white/50" />
        </span>
        <span className="font-mono text-[11px] text-[#00F0FF]/70 shrink-0 w-28">
          #{timeline.order_number}
        </span>
        <span className="font-mono text-[10px] text-white/30 flex-1 min-w-0 truncate">
          {timeline.user_email ?? "—"}
        </span>
        <span className="shrink-0">
          <StatusBadge status={timeline.last_status} />
        </span>
        <span className="font-mono text-[9px] text-white/20 shrink-0">
          {fmtDateTime(timeline.last_updated)}
        </span>
        <span className="font-mono text-[9px] text-white/20 shrink-0 w-16 text-right">
          {timeline.events.length} evento{timeline.events.length !== 1 ? "s" : ""}
        </span>
      </button>

      {/* Events timeline */}
      {expanded && (
        <div className="px-5 pb-4 border-t border-white/5">
          <div className="ml-4 mt-3 flex flex-col gap-0">
            {timeline.events.map((evt, i) => {
              const meta = getStatusMeta(evt.me_status);
              const Icon = meta.icon;
              const isLast = i === timeline.events.length - 1;
              return (
                <div key={evt.id} className="relative flex gap-4">
                  {/* Connector line */}
                  {!isLast && (
                    <span className="absolute left-3 top-5 bottom-0 w-px bg-white/6" />
                  )}
                  {/* Node */}
                  <div className="relative z-10 shrink-0 flex items-center justify-center w-6 h-6 mt-1.5 border border-white/10 bg-[#0f0f0f]"
                    style={{ boxShadow: isLast ? `0 0 8px ${meta.color.replace("text-", "").replace("[", "").replace("]", "")}22` : "none" }}>
                    <Icon size={10} className={meta.color} />
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0 pb-4">
                    <div className="flex items-center gap-3 mb-1">
                      <StatusBadge status={evt.me_status} />
                      <span className="font-mono text-[9px] text-white/20">
                        {fmtDateTime(evt.created_at)}
                      </span>
                    </div>
                    {evt.message && (
                      <p className="font-mono text-[10px] text-white/40 leading-relaxed">
                        {evt.message}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const ALL_STATUSES = Object.keys(ME_STATUS_LABELS);

export function ShipmentsClient({ timelines }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return timelines.filter((t) => {
      const matchSearch = search.trim() === "" || t.order_number.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || t.last_status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [timelines, search, statusFilter]);

  const counts = useMemo(() => {
    const acc: Record<string, number> = { all: timelines.length };
    for (const t of timelines) {
      acc[t.last_status] = (acc[t.last_status] ?? 0) + 1;
    }
    return acc;
  }, [timelines]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <DevBadge />
        <div className="flex items-center gap-3">
          <Truck size={18} className="text-[#FF00B6]" />
          <h1 className="font-shrikhand text-2xl text-white tracking-wide">
            Rastreamento de Envios
          </h1>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/25">
          {timelines.length} pedido{timelines.length !== 1 ? "s" : ""} com eventos de rastreamento
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total", value: counts.all ?? 0, color: "text-white/60" },
          { label: "Em Trânsito", value: counts.in_transit ?? 0, color: "text-[#FFD700]" },
          { label: "Saiu p/ Entrega", value: counts.out_for_delivery ?? 0, color: "text-[#FF00B6]" },
          { label: "Entregue", value: counts.delivered ?? 0, color: "text-emerald-400" },
        ].map((kpi) => (
          <div key={kpi.label} className="border border-white/5 bg-[#141414] px-5 py-4 shadow-[inset_1px_1px_0_rgba(255,255,255,0.03)]">
            <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/25 mb-1">{kpi.label}</p>
            <p className={`font-mono text-2xl ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por número do pedido..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0f0f0f] border border-white/8 focus:border-[#FF00B6]/40 font-mono text-[11px] text-white/70 placeholder:text-white/20 outline-none transition-colors"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 bg-[#0f0f0f] border border-white/8 focus:border-[#00F0FF]/40 font-mono text-[11px] text-white/50 outline-none transition-colors cursor-pointer"
          >
            <option value="all">Todos os status</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{ME_STATUS_LABELS[s].label}</option>
            ))}
          </select>
          <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
        </div>
      </div>

      {/* Timeline list */}
      {filtered.length === 0 ? (
        <AsciiEmpty
          message="Nenhum evento de rastreamento"
          description="Sem pedidos com rastreamento no filtro atual"
        />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((t) => (
            <TimelineRow key={t.order_id} timeline={t} />
          ))}
        </div>
      )}

      <p className="font-mono text-[8px] text-white/12 text-center uppercase tracking-[0.3em]">
        {filtered.length} pedido{filtered.length !== 1 ? "s" : ""} exibidos — clique para expandir timeline
      </p>
    </div>
  );
}
