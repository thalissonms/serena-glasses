"use client";
/**
 * Component: BlingClient — SCAFFOLD de integração Bling ERP.
 *
 * Card de status "Não conectado". Botão "Conectar" desabilitado.
 * Pré-requisitos para ativação. Plano de implementação em 4 fases
 * extraído de AGENT/bling-integration-plan.md. DevBadge.
 *
 * Usado em: src/app/admin/integrations/bling/page.tsx.
 */
import { Zap, Lock, ExternalLink, ArrowRight, Circle, CheckCircle2 } from "lucide-react";
import { DevBadge } from "@features/admin/components/motifs/DevBadge";

const PHASES = [
  {
    num: 1,
    title: "Credenciais & OAuth",
    items: [
      "App criado no painel Bling (Mais → API → Aplicativos)",
      "Tabela bling_tokens no Supabase (singleton, uma linha)",
      "Vars: BLING_CLIENT_ID, BLING_CLIENT_SECRET, BLING_WEBHOOK_SECRET",
      "Client lib shared/lib/bling/client.ts com auto-refresh de token OAuth 2.0",
    ],
  },
  {
    num: 2,
    title: "Criação de Pedidos no Bling",
    items: [
      "createOrderInBling() chamado após pagamento MP aprovado (webhook existente)",
      "Mapeia order Supabase → formato Bling v3: cliente, itens, endereço",
      "Bling gera NF-e automaticamente após receber o pedido",
    ],
  },
  {
    num: 3,
    title: "Sincronização de Estoque",
    items: [
      "Endpoint POST /api/webhooks/bling recebe atualizações de estoque",
      "Valida assinatura via BLING_WEBHOOK_SECRET (HMAC-SHA256)",
      "Atualiza product_variants.stock no Supabase em tempo real",
    ],
  },
  {
    num: 4,
    title: "Dashboard de Monitoramento",
    items: [
      "Card de saúde: expiração do token, último sync, erros recentes",
      "Botão de re-sincronização manual de estoque",
      "Log de pedidos enviados ao Bling com status e ID NF-e",
    ],
  },
];

const PREREQS = [
  "Conta Bling ativa com API v3 habilitada",
  "App criado no painel Bling com escopos: pedidos.vendas, produtos, estoques, notasfiscais",
  "Redirect URI configurado: https://serenaglasses.com/api/bling/callback",
  "Variáveis BLING_CLIENT_ID, BLING_CLIENT_SECRET, BLING_WEBHOOK_SECRET no Vercel",
  "Migration executada: CREATE TABLE bling_tokens (...)",
];

export function BlingClient() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <DevBadge />
        <div className="flex items-center gap-3">
          <Zap size={18} className="text-brand-pink" />
          <h1 className="font-shrikhand text-2xl text-white tracking-wide">
            Bling ERP
          </h1>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/25">
          {"// Integração NF-e · estoque · pedidos · API v3 OAuth 2.0"}
        </p>
      </div>

      {/* Status card */}
      <div className="border border-white/8 bg-[#050505] p-6 hover:border-brand-pink/30 hover:shadow-[inset_0_0_15px_rgba(255,0,182,0.05)] transition-colors">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 border border-white/8 bg-[#050505] flex items-center justify-center shrink-0">
              <Zap size={22} className="text-white/15" />
            </div>
            <div>
              <p className="font-mono text-[16px] text-white font-bold mb-1">Bling ERP</p>
              <p className="font-mono text-[11px] text-white/30 leading-relaxed max-w-sm mb-3">
                Sistema ERP brasileiro para emissão de NF-e, controle de estoque e gestão
                financeira. Integração via OAuth 2.0 + API v3.
              </p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-none bg-white/12" />
                <span className="font-mono text-[12px] text-white/30 uppercase tracking-widest">
                  Não conectado
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <button
              type="button"
              disabled
              className="flex items-center gap-2 px-5 py-2.5 font-mono text-[12px] uppercase tracking-widest border border-white/8 text-white/15 cursor-not-allowed"
            >
              <Lock size={14} />
              [ CONECTAR BLING ]
            </button>
            <a
              href="https://developer.bling.com.br/bling-api"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest border border-white/5 text-white/20 hover:text-white/35 hover:border-white/10 transition-colors"
            >
              <ExternalLink size={12} />
              [ DOCUMENTAÇÃO API ]
            </a>
          </div>
        </div>
      </div>

      {/* Pre-requisites */}
      <div className="border border-[#FFD700]/20 bg-[#FFD700]/4 p-4">
        <p className="font-mono text-[12px] text-[#FFD700]/70 uppercase tracking-wider mb-3">
          Pré-requisitos para ativação
        </p>
        <div className="space-y-2">
          {PREREQS.map((item) => (
            <div key={item} className="flex items-start gap-2">
              <Circle size={12} className="text-[#FFD700]/30 shrink-0 mt-0.5" />
              <p className="font-mono text-[11px] text-white/30 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Integration flow diagram */}
      <div className="border border-white/5 bg-[#0a0a0a] p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/20 mb-4">
          {"// Fluxo de dados"}
        </p>
        <div className="space-y-2 font-mono text-[11px] text-white/30 leading-loose">
          <p>
            <span className="text-brand-pink/50">Checkout pago</span>
            <span className="text-white/15 mx-2">──►</span>
            /api/webhooks/mercadopago
            <span className="text-white/15 mx-2">──►</span>
            <span className="text-brand-pink/40">createOrderInBling()</span>
            <span className="text-white/15 mx-2">──►</span>
            <span className="text-[#FFD700]/40">Bling gera NF-e</span>
          </p>
          <p>
            <span className="text-brand-pink/50">Bling altera estoque</span>
            <span className="text-white/15 mx-2">──►</span>
            /api/webhooks/bling
            <span className="text-white/15 mx-2">──►</span>
            <span className="text-brand-pink/40">atualiza product_variants.stock</span>
          </p>
        </div>
      </div>

      {/* Implementation phases */}
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/20 mb-4">
          {"// Plano de implementação — 4 fases"}
        </p>
        <div className="space-y-3">
          {PHASES.map((phase) => (
            <div key={phase.num} className="border border-white/5 bg-[#050505] hover:border-brand-pink/20 transition-colors">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                <span className="w-6 h-6 border border-white/8 flex items-center justify-center font-mono text-[11px] text-white/30 shrink-0">
                  {phase.num}
                </span>
                <ArrowRight size={13} className="text-white/10 shrink-0" />
                <span className="font-mono text-[13px] text-white/60 font-bold">
                  {phase.title}
                </span>
                <span className="ml-auto px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest border border-white/5 text-white/15">
                  Pendente
                </span>
              </div>
              <div className="px-4 py-3 space-y-1.5">
                {phase.items.map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <Circle size={11} className="text-white/12 shrink-0 mt-0.5" />
                    <p className="font-mono text-[11px] text-white/25 leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* When connected */}
      <div className="border border-white/5 p-4 opacity-30">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/25 mb-3 flex items-center gap-2">
          <CheckCircle2 size={14} />
          {"// Quando conectado, este painel mostrará"}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "Status do token OAuth (expira em…)",
            "Último pedido enviado ao Bling",
            "Estoque sincronizado há…",
            "NF-es emitidas este mês",
          ].map((item) => (
            <div
              key={item}
              className="border border-white/5 bg-[#050505] px-3 py-2 font-mono text-[10px] text-white/20"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <p className="font-mono text-[10px] text-white/12 text-center uppercase tracking-[0.3em]">
        {"// Plano completo em AGENT/bling-integration-plan.md"}
      </p>
    </div>
  );
}
