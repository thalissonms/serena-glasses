"use client";
/**
 * Component: AuditClient — SCAFFOLD de log de auditoria de ações admin.
 *
 * UI 100% mock. Tabela com 5 linhas fake. Filtros client-side funcionando.
 * Rows expansíveis mostram JSON diff. DevBadge "Requer tabela audit_logs".
 *
 * Usado em: src/app/admin-v2/audit/page.tsx.
 */
import { useState, useMemo } from "react";
import { ClipboardList, Search, ChevronDown, ChevronRight } from "lucide-react";
import { AsciiEmpty } from "@features/admin-v2/components/motifs/AsciiEmpty";

const MOCK_LOGS = [
  {
    id: "aud-0001",
    timestamp: "2026-05-18T15:42:00Z",
    admin_email: "admin@serenaglasses.com",
    action: "UPDATE",
    target_type: "order",
    target_id: "ord-8821",
    diff: JSON.stringify(
      {
        status: { from: "processing", to: "shipped" },
        tracking_code: { from: null, to: "BR12345678901" },
      },
      null,
      2,
    ),
  },
  {
    id: "aud-0002",
    timestamp: "2026-05-18T14:10:00Z",
    admin_email: "admin@serenaglasses.com",
    action: "CREATE",
    target_type: "coupon",
    target_id: "SUMMER20",
    diff: JSON.stringify({ code: "SUMMER20", discount_pct: 20, active: true }, null, 2),
  },
  {
    id: "aud-0003",
    timestamp: "2026-05-18T12:05:00Z",
    admin_email: "admin@serenaglasses.com",
    action: "DELETE",
    target_type: "banner",
    target_id: "ban-0019",
    diff: JSON.stringify({ id: "ban-0019", title_pt: "Banner Verão" }, null, 2),
  },
  {
    id: "aud-0004",
    timestamp: "2026-05-17T18:33:00Z",
    admin_email: "admin@serenaglasses.com",
    action: "UPDATE",
    target_type: "product",
    target_id: "OCL-0042",
    diff: JSON.stringify(
      { price: { from: 18900, to: 21900 }, active: { from: false, to: true } },
      null,
      2,
    ),
  },
  {
    id: "aud-0005",
    timestamp: "2026-05-17T09:15:00Z",
    admin_email: "admin@serenaglasses.com",
    action: "REFUND",
    target_type: "order",
    target_id: "ord-8790",
    diff: JSON.stringify(
      {
        refund_amount: 18900,
        reason: "Produto com defeito",
        mp_refund_id: "ref_981234",
      },
      null,
      2,
    ),
  },
];

const ACTION_STYLE: Record<string, string> = {
  UPDATE: "border-[#00F0FF]/30 text-[#00F0FF] bg-[#00F0FF]/5",
  CREATE: "border-green-500/30 text-green-400 bg-green-500/5",
  DELETE: "border-[#FF00B6]/30 text-[#FF00B6] bg-[#FF00B6]/5",
  REFUND: "border-[#FFD700]/30 text-[#FFD700] bg-[#FFD700]/5",
};

function fmtTs(ts: string) {
  return new Date(ts).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function AuditClient() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const rows = useMemo(() => {
    let list = MOCK_LOGS;
    if (actionFilter !== "all") list = list.filter((r) => r.action === actionFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.admin_email.includes(q) ||
          r.target_type.includes(q) ||
          r.target_id.toLowerCase().includes(q) ||
          r.action.toLowerCase().includes(q),
      );
    }
    return list;
  }, [search, actionFilter]);

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
            Requer tabela audit_logs
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ClipboardList size={18} className="text-[#FF00B6]" />
          <h1 className="font-shrikhand text-2xl text-white tracking-wide">
            Log de Auditoria
          </h1>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/25">
          Rastreia todas as ações admin com diff · dados abaixo são demonstrativos
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search
            size={12}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por email, tipo, ID..."
            className="pl-8 pr-4 py-2 bg-[#0f0f0f] border border-white/8 focus:border-[#FF00B6]/40 font-mono text-[11px] text-white/60 placeholder:text-white/15 outline-none w-72 transition-colors"
          />
        </div>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="appearance-none pl-3 pr-8 py-2 bg-[#0f0f0f] border border-white/8 focus:border-[#FF00B6]/40 font-mono text-[11px] text-white/40 outline-none transition-colors cursor-pointer"
        >
          <option value="all">Todas as ações</option>
          <option value="UPDATE">UPDATE</option>
          <option value="CREATE">CREATE</option>
          <option value="DELETE">DELETE</option>
          <option value="REFUND">REFUND</option>
        </select>
        <span className="font-mono text-[9px] text-white/20 ml-auto">
          {rows.length} evento{rows.length !== 1 ? "s" : ""} (mock)
        </span>
      </div>

      {/* Table */}
      {rows.length === 0 ? (
        <AsciiEmpty message="Nenhum evento encontrado" />
      ) : (
        <div className="border border-white/5 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#1a1a1a]">
                {["", "TIMESTAMP", "ADMIN", "AÇÃO", "TIPO", "ID ALVO"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 font-mono text-[8px] uppercase tracking-[0.25em] text-white/25 font-normal border-b border-white/5 text-left whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <>
                  <tr
                    key={row.id}
                    className={`border-b border-white/3 cursor-pointer transition-colors ${
                      i % 2 === 0 ? "bg-[#141414]" : "bg-[#111111]"
                    } hover:bg-white/3`}
                    onClick={() => setExpanded(expanded === row.id ? null : row.id)}
                  >
                    <td className="px-3 py-3 text-white/20">
                      {expanded === row.id ? (
                        <ChevronDown size={12} />
                      ) : (
                        <ChevronRight size={12} />
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-[9px] text-white/30 whitespace-nowrap">
                      {fmtTs(row.timestamp)}
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px] text-[#00F0FF]/40">
                      {row.admin_email}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest border ${
                          ACTION_STYLE[row.action] ?? "border-white/10 text-white/30"
                        }`}
                      >
                        {row.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px] text-white/30">
                      {row.target_type}
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px] text-[#FF00B6]/30">
                      {row.target_id}
                    </td>
                  </tr>
                  {expanded === row.id && (
                    <tr
                      key={`${row.id}-diff`}
                      className="bg-[#0c0c0c] border-b border-white/5"
                    >
                      <td colSpan={6} className="px-6 py-4">
                        <p className="font-mono text-[7px] uppercase tracking-[0.3em] text-white/20 mb-2">
                          diff
                        </p>
                        <pre className="font-mono text-[9px] text-[#00F0FF]/50 whitespace-pre-wrap leading-relaxed">
                          {row.diff}
                        </pre>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="font-mono text-[8px] text-white/12 text-center uppercase tracking-[0.3em]">
        Dados demonstrativos — funcionalidade requer criação da tabela audit_logs
      </p>
    </div>
  );
}
