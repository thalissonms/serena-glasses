"use client";
/**
 * Component: CartsClient — SCAFFOLD de carrinhos abandonados.
 *
 * UI 100% mock. Sem tabela real no banco.
 * DevBadge com mensagem "EM DESENVOLVIMENTO — Requer feature flag de carrinho persistente".
 * Tabela fake com 5 linhas mock. Filtros presentes mas desabilitados.
 *
 * Usado em: src/app/admin/carts/page.tsx.
 */
import { ShoppingCart, Search, Lock } from "lucide-react";
import { DevBadge } from "@features/admin/components/motifs/DevBadge";

const MOCK_CARTS = [
  {
    id: "cart-0001",
    user_email: "c***a@gmail.com",
    items: 3,
    value: "R$ 489,90",
    last_activity: "há 2 horas",
    status: "abandoned",
  },
  {
    id: "cart-0002",
    user_email: "m***s@hotmail.com",
    items: 1,
    value: "R$ 189,00",
    last_activity: "há 5 horas",
    status: "abandoned",
  },
  {
    id: "cart-0003",
    user_email: "j***o@gmail.com",
    items: 2,
    value: "R$ 318,00",
    last_activity: "há 1 dia",
    status: "cold",
  },
  {
    id: "cart-0004",
    user_email: "a***r@outlook.com",
    items: 4,
    value: "R$ 756,00",
    last_activity: "há 2 dias",
    status: "cold",
  },
  {
    id: "cart-0005",
    user_email: "l***z@gmail.com",
    items: 1,
    value: "R$ 219,00",
    last_activity: "há 3 dias",
    status: "cold",
  },
];

function StatusChip({ status }: { status: string }) {
  if (status === "abandoned") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest border border-[#FF00B6]/30 bg-[#FF00B6]/8 text-[#FF00B6]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF00B6] animate-pulse" />
        Abandonado
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest border border-white/10 bg-white/3 text-white/30">
      <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
      Frio
    </span>
  );
}

export function CartsClient() {
  return (
    <div className="space-y-6">
      {/* Header + DevBadge */}
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#FF00B6]/20 bg-[#FF00B6]/4 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-neon-pulse shrink-0" aria-hidden="true" />
          <span
            className="font-mono text-[8px] uppercase tracking-[0.3em] font-bold"
            style={{
              background: "linear-gradient(90deg, #FF00B6, #00F0FF, #FFD700)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Em Desenvolvimento — Requer feature flag de carrinho persistente
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ShoppingCart size={18} className="text-[#FF00B6]" />
          <h1 className="font-shrikhand text-2xl text-white tracking-wide">
            Carrinhos Abandonados
          </h1>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/25">
          Requer implementação de carrinho persistente com feature flag — dados abaixo são demonstrativos
        </p>
      </div>

      {/* Feature gate notice */}
      <div className="border border-[#FFD700]/20 bg-[#FFD700]/4 p-4 flex items-start gap-3">
        <Lock size={14} className="text-[#FFD700]/60 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-mono text-[10px] text-[#FFD700]/70 uppercase tracking-wider">
            Feature pendente: Persistent Cart
          </p>
          <p className="font-mono text-[9px] text-white/30 leading-relaxed max-w-xl">
            O rastreamento de carrinhos abandonados requer a ativação da feature flag
            <span className="text-[#00F0FF]/50 mx-1">PERSISTENT_CART_ENABLED</span>
            e a criação da tabela <span className="text-[#00F0FF]/50 mx-1">carts</span> +
            <span className="text-[#00F0FF]/50 mx-1">cart_items</span> no banco.
            Quando ativada, este painel exibirá carrinhos reais com ações de recuperação por e-mail.
          </p>
        </div>
      </div>

      {/* Disabled KPI strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Carrinhos Ativos", value: "—" },
          { label: "Valor Total", value: "—" },
          { label: "Taxa Abandono", value: "—" },
          { label: "Recuperados", value: "—" },
        ].map((kpi) => (
          <div key={kpi.label} className="border border-white/5 bg-[#0f0f0f]/50 px-5 py-4 opacity-40">
            <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/25 mb-1">{kpi.label}</p>
            <p className="font-mono text-2xl text-white/20">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Disabled filters */}
      <div className="flex items-center gap-3 opacity-40 pointer-events-none select-none">
        <div className="relative">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            type="text"
            placeholder="Buscar por email..."
            disabled
            className="pl-8 pr-4 py-2 bg-[#0f0f0f] border border-white/8 font-mono text-[11px] text-white/20 placeholder:text-white/15 outline-none w-64 cursor-not-allowed"
          />
        </div>
        <select
          disabled
          className="appearance-none pl-3 pr-8 py-2 bg-[#0f0f0f] border border-white/8 font-mono text-[11px] text-white/20 outline-none cursor-not-allowed"
        >
          <option>Todos os status</option>
        </select>
        <div className="flex items-center gap-1 px-3 py-2 border border-white/5 font-mono text-[9px] text-white/15">
          <Lock size={9} />
          Filtros bloqueados
        </div>
      </div>

      {/* Mock table */}
      <div className="border border-white/5 overflow-x-auto relative">
        {/* Locked overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#0f0f0f]/70 backdrop-blur-[1px]">
          <Lock size={22} className="text-white/15" />
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/20">
            Dados reais disponíveis após ativação da feature
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

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#1a1a1a]">
              {["ID", "EMAIL", "ITENS", "VALOR", "ÚLTIMA ATIVIDADE", "STATUS", "AÇÃO"].map((h) => (
                <th key={h} className="px-4 py-3 font-mono text-[8px] uppercase tracking-[0.25em] text-white/25 font-normal border-b border-white/5 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_CARTS.map((cart, i) => (
              <tr
                key={cart.id}
                className={`border-b border-white/3 ${i % 2 === 0 ? "bg-[#141414]" : "bg-[#111111]"}`}
              >
                <td className="px-4 py-3 font-mono text-[10px] text-[#00F0FF]/30">{cart.id}</td>
                <td className="px-4 py-3 font-mono text-[10px] text-white/30">{cart.user_email}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-white/30">{cart.items}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-white/30">{cart.value}</td>
                <td className="px-4 py-3 font-mono text-[9px] text-white/20">{cart.last_activity}</td>
                <td className="px-4 py-3">
                  <StatusChip status={cart.status} />
                </td>
                <td className="px-4 py-3">
                  <button
                    disabled
                    className="px-3 py-1.5 font-mono text-[8px] uppercase tracking-widest text-white/15 border border-white/5 bg-white/2 cursor-not-allowed"
                  >
                    Recuperar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="font-mono text-[8px] text-white/12 text-center uppercase tracking-[0.3em]">
        Dados acima são demonstrativos — funcionalidade requer feature flag de carrinho persistente
      </p>
    </div>
  );
}
