"use client";
/**
 * Component: LogsClient — SCAFFOLD tabela de error_logs com payload expandível.
 *
 * Tabela: created_at, event_type badge, error_message truncado, payload JSON expandível.
 * Filtros client-side: select event_type, date range.
 * DevBadge no topo.
 *
 * Usado em: src/app/admin/logs/page.tsx.
 */
import { useState, useMemo } from "react";
import { FileText, ChevronDown, ChevronRight, AlertCircle, Info, Zap, Bug, Search } from "lucide-react";
import { DevBadge } from "@features/admin/components/motifs/DevBadge";
import { AsciiEmpty } from "@features/admin/components/motifs/AsciiEmpty";

export interface ErrorLog {
  id: string;
  created_at: string;
  event_type: string;
  error_message: string | null;
  payload: Record<string, unknown> | null;
}

interface Props {
  logs: ErrorLog[];
  eventTypes: string[];
}

const EVENT_TYPE_META: Record<string, { color: string; bg: string; icon: typeof Bug }> = {
  payment_error: { color: "text-red-400", bg: "bg-red-400/10 border-red-400/30", icon: AlertCircle },
  webhook_error: { color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/30", icon: Zap },
  shipping_error: { color: "text-[#FF00B6]", bg: "bg-[#FF00B6]/10 border-[#FF00B6]/30", icon: AlertCircle },
  email_error: { color: "text-[#FFD700]", bg: "bg-[#FFD700]/10 border-[#FFD700]/30", icon: Info },
  auth_error: { color: "text-[#00F0FF]", bg: "bg-[#00F0FF]/10 border-[#00F0FF]/30", icon: AlertCircle },
  system: { color: "text-white/40", bg: "bg-white/5 border-white/10", icon: Bug },
};

function getEventMeta(type: string) {
  return EVENT_TYPE_META[type] ?? {
    color: "text-white/40",
    bg: "bg-white/5 border-white/10",
    icon: Bug,
  };
}

function EventTypeBadge({ type }: { type: string }) {
  const meta = getEventMeta(type);
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest border ${meta.bg} ${meta.color} whitespace-nowrap`}>
      <Icon size={8} />
      {type}
    </span>
  );
}

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

function LogRow({ log }: { log: ErrorLog }) {
  const [expanded, setExpanded] = useState(false);
  const hasPayload = log.payload && Object.keys(log.payload).length > 0;

  return (
    <>
      <tr
        className={`border-b border-white/3 transition-colors hover:bg-[#FF00B6]/3 cursor-pointer ${
          expanded ? "bg-[#1a1a1a]" : ""
        }`}
        onClick={() => hasPayload && setExpanded((v) => !v)}
      >
        <td className="px-4 py-3 font-mono text-[9px] text-white/30 whitespace-nowrap">
          {fmtDateTime(log.created_at)}
        </td>
        <td className="px-4 py-3">
          <EventTypeBadge type={log.event_type} />
        </td>
        <td className="px-4 py-3 font-mono text-[10px] text-white/55 max-w-md">
          <span className="truncate block max-w-sm">
            {log.error_message ?? <span className="text-white/20 italic">sem mensagem</span>}
          </span>
        </td>
        <td className="px-4 py-3">
          {hasPayload ? (
            <button
              type="button"
              className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-widest text-[#00F0FF]/50 hover:text-[#00F0FF] transition-colors"
            >
              {expanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
              payload
            </button>
          ) : (
            <span className="font-mono text-[8px] text-white/15">—</span>
          )}
        </td>
      </tr>
      {expanded && hasPayload && (
        <tr className="border-b border-white/5 bg-[#0a0a0a]">
          <td colSpan={4} className="px-4 py-3">
            <pre className="font-mono text-[9px] text-[#00F0FF]/60 overflow-x-auto max-h-48 leading-relaxed whitespace-pre-wrap break-all">
              {JSON.stringify(log.payload, null, 2)}
            </pre>
          </td>
        </tr>
      )}
    </>
  );
}

export function LogsClient({ logs, eventTypes }: Props) {
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      if (typeFilter !== "all" && log.event_type !== typeFilter) return false;
      if (dateFrom && log.created_at < dateFrom) return false;
      if (dateTo && log.created_at > dateTo + "T23:59:59") return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const inMsg = (log.error_message ?? "").toLowerCase().includes(q);
        const inType = log.event_type.toLowerCase().includes(q);
        if (!inMsg && !inType) return false;
      }
      return true;
    });
  }, [logs, typeFilter, dateFrom, dateTo, search]);

  const countByType = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const l of logs) acc[l.event_type] = (acc[l.event_type] ?? 0) + 1;
    return acc;
  }, [logs]);

  const topType = Object.entries(countByType).sort(([, a], [, b]) => b - a)[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <DevBadge />
        <div className="flex items-center gap-3">
          <FileText size={18} className="text-[#FF00B6]" />
          <h1 className="font-shrikhand text-2xl text-white tracking-wide">
            Logs de Erro
          </h1>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/25">
          Últimos {logs.length} eventos — log completo em desenvolvimento
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Logs", value: logs.length, color: "text-white/60" },
          { label: "Tipos Únicos", value: Object.keys(countByType).length, color: "text-[#00F0FF]" },
          { label: "Tipo + Freq.", value: topType?.[0] ?? "—", color: "text-[#FF00B6]", mono: true },
          { label: "Erros Críticos", value: (countByType["payment_error"] ?? 0) + (countByType["auth_error"] ?? 0), color: "text-red-400" },
        ].map((kpi) => (
          <div key={kpi.label} className="border border-white/5 bg-[#141414] px-5 py-4 shadow-[inset_1px_1px_0_rgba(255,255,255,0.03)]">
            <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/25 mb-1">{kpi.label}</p>
            <p className={`font-mono ${kpi.mono ? "text-[11px] truncate" : "text-2xl"} ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar mensagem ou tipo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-4 py-2 bg-[#0f0f0f] border border-white/8 focus:border-[#FF00B6]/40 font-mono text-[11px] text-white/70 placeholder:text-white/20 outline-none transition-colors w-64"
          />
        </div>
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 bg-[#0f0f0f] border border-white/8 focus:border-[#00F0FF]/40 font-mono text-[11px] text-white/50 outline-none transition-colors cursor-pointer"
          >
            <option value="all">Todos os tipos</option>
            {eventTypes.map((t) => (
              <option key={t} value={t}>{t} ({countByType[t] ?? 0})</option>
            ))}
          </select>
          <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2 bg-[#0f0f0f] border border-white/8 focus:border-[#FF00B6]/30 font-mono text-[10px] text-white/40 outline-none transition-colors"
          />
          <span className="font-mono text-[9px] text-white/20">até</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-2 bg-[#0f0f0f] border border-white/8 focus:border-[#FF00B6]/30 font-mono text-[10px] text-white/40 outline-none transition-colors"
          />
        </div>
        {(typeFilter !== "all" || dateFrom || dateTo || search) && (
          <button
            type="button"
            onClick={() => { setTypeFilter("all"); setDateFrom(""); setDateTo(""); setSearch(""); }}
            className="font-mono text-[9px] uppercase tracking-widest text-white/25 hover:text-white/50 transition-colors border border-white/8 px-3 py-2"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <AsciiEmpty message="Nenhum log encontrado" description="Ajuste os filtros para visualizar eventos" />
      ) : (
        <div className="border border-white/5 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#1a1a1a] shadow-[inset_1px_1px_0_rgba(255,255,255,0.05)]">
                {["TIMESTAMP", "TIPO", "MENSAGEM", "PAYLOAD"].map((h) => (
                  <th key={h} className="px-4 py-3 font-mono text-[8px] uppercase tracking-[0.25em] text-white/25 font-normal border-b border-white/5 text-left whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <LogRow key={log.id} log={log} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="font-mono text-[8px] text-white/12 text-center uppercase tracking-[0.3em]">
        {filtered.length} de {logs.length} logs — clique em payload para expandir JSON
      </p>
    </div>
  );
}
