"use client";
/**
 * Component: TeamClient — SCAFFOLD de gerenciamento de equipe admin.
 *
 * Lista admins vindos da tabela profiles (role='admin').
 * Cards: email, role badge, created_at. Botão "+ Adicionar Admin" desabilitado.
 * Seção de roles planejados para RBAC granular futuro.
 * DevBadge "RBAC granular em breve".
 *
 * Usado em: src/app/admin-v2/team/page.tsx.
 */
import { Users, ShieldCheck, Clock, Lock, Circle } from "lucide-react";
import { AsciiEmpty } from "@features/admin-v2/components/motifs/AsciiEmpty";

export interface AdminProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string;
  created_at: string | null;
}

interface Props {
  admins: AdminProfile[];
}

const PLANNED_ROLES = [
  {
    key: "super_admin",
    label: "Super Admin",
    description:
      "Acesso total ao painel, incluindo dados financeiros e configurações críticas.",
  },
  {
    key: "editor",
    label: "Editor",
    description:
      "Edita produtos, categorias, banners e stories. Sem acesso a pedidos ou configurações.",
  },
  {
    key: "support",
    label: "Suporte",
    description:
      "Visualiza pedidos e clientes. Pode atualizar status e adicionar notas. Sem ações financeiras.",
  },
  {
    key: "viewer",
    label: "Viewer",
    description: "Acesso somente leitura a dashboard e relatórios.",
  },
];

function fmtDate(ts: string | null) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("pt-BR");
}

function initials(email: string | null, name: string | null) {
  if (name) return name.slice(0, 2).toUpperCase();
  if (email) return email.slice(0, 2).toUpperCase();
  return "??";
}

export function TeamClient({ admins }: Props) {
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
            RBAC granular em breve
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Users size={18} className="text-[#FF00B6]" />
            <h1 className="font-shrikhand text-2xl text-white tracking-wide">
              Equipe Admin
            </h1>
          </div>
          <button
            type="button"
            disabled
            className="flex items-center gap-2 px-4 py-2 font-mono text-[10px] uppercase tracking-widest border border-white/10 text-white/15 cursor-not-allowed"
          >
            <Lock size={11} />
            + Adicionar Admin
          </button>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/25">
          {admins.length} admin{admins.length !== 1 ? "s" : ""} registrados ·
          controle granular de permissões em desenvolvimento
        </p>
      </div>

      {/* Admin cards */}
      {admins.length === 0 ? (
        <AsciiEmpty
          message="Nenhum admin encontrado"
          description="Nenhum perfil com role=admin encontrado na tabela profiles."
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {admins.map((admin) => (
            <div
              key={admin.id}
              className="border border-white/8 bg-[#141414] p-4 hover:border-white/14 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 border border-[#FF00B6]/20 bg-[#FF00B6]/5 flex items-center justify-center font-mono text-[11px] text-[#FF00B6]/60 font-bold">
                  {initials(admin.email, admin.full_name)}
                </div>
                <span className="px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest border border-[#00F0FF]/20 text-[#00F0FF]/60 bg-[#00F0FF]/4">
                  {admin.role}
                </span>
              </div>
              <p className="font-mono text-[11px] text-white font-bold mb-0.5 truncate">
                {admin.email ?? admin.id}
              </p>
              {admin.full_name && (
                <p className="font-mono text-[10px] text-white/40 mb-0 truncate">
                  {admin.full_name}
                </p>
              )}
              <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/5">
                <Clock size={10} className="text-white/15" />
                <span className="font-mono text-[8px] text-white/20 uppercase tracking-wider">
                  desde {fmtDate(admin.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Planned RBAC section */}
      <div>
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/20 mb-3 flex items-center gap-2">
          <ShieldCheck size={11} className="text-white/15" />
          Roles planejados — RBAC granular em desenvolvimento
        </p>
        <div className="border border-white/5 divide-y divide-white/5">
          {PLANNED_ROLES.map((r) => (
            <div
              key={r.key}
              className="flex items-start gap-4 px-4 py-3 opacity-35 hover:opacity-50 transition-opacity"
            >
              <span className="px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest border border-white/10 text-white/30 shrink-0 mt-0.5 whitespace-nowrap">
                {r.key}
              </span>
              <div>
                <p className="font-mono text-[10px] text-white/40 font-bold mb-0.5">
                  {r.label}
                </p>
                <p className="font-mono text-[9px] text-white/20 leading-relaxed">
                  {r.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DB notice */}
      <div className="border border-[#FFD700]/15 bg-[#FFD700]/3 p-3 flex items-start gap-3">
        <Circle size={11} className="text-[#FFD700]/40 shrink-0 mt-0.5" />
        <p className="font-mono text-[9px] text-white/25 leading-relaxed">
          Admins listados vêm de{" "}
          <span className="text-[#00F0FF]/50">profiles WHERE role = &apos;admin&apos;</span>.
          O controle de convites e remoção requer implementação do fluxo RBAC.
        </p>
      </div>
    </div>
  );
}
