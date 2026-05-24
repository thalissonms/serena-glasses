"use client";
/**
 * Component: EmailsClient — SCAFFOLD de templates de e-mail transacional.
 *
 * Lista os templates de features/emails/templates/orderTemplates.ts (hardcoded).
 * Cards com nome, trigger, descrição, função. Preview button abre modal com iframe mock.
 * Editor desabilitado — badge "Editor em breve".
 *
 * Usado em: src/app/admin-v2/emails/page.tsx.
 */
import { useState } from "react";
import { Mail, Eye, Code2, X, Lock } from "lucide-react";
import { DevBadge } from "@features/admin-v2/components/motifs/DevBadge";

const EMAIL_TEMPLATES = [
  {
    key: "order_received",
    name: "Pedido Recebido",
    trigger: "Criação do pedido (pré-pagamento)",
    description:
      "Confirmação imediata após o cliente finalizar o checkout, aguardando aprovação do pagamento.",
    fn: "buildOrderReceivedEmail",
    subject: "Recebemos seu pedido #{{ORDER_NUMBER}}",
  },
  {
    key: "order_confirmed",
    name: "Pedido Confirmado",
    trigger: "Pagamento aprovado via Mercado Pago",
    description:
      "Enviado quando o webhook do MP confirma o pagamento. Inclui itens, total e estimativa de envio.",
    fn: "buildOrderConfirmedEmail",
    subject: "Pagamento confirmado! #{{ORDER_NUMBER}}",
  },
  {
    key: "order_shipped",
    name: "Pedido Enviado",
    trigger: "Admin insere código de rastreamento",
    description:
      "Enviado quando o admin adiciona o tracking code no painel. Contém link de rastreamento Melhor Envio.",
    fn: "buildOrderShippedEmail",
    subject: "Seu pedido saiu para entrega! #{{ORDER_NUMBER}}",
  },
  {
    key: "order_delivered",
    name: "Pedido Entregue",
    trigger: "Status atualizado para 'delivered'",
    description:
      "Confirmação de entrega. Convida o cliente a avaliar o produto via link direto.",
    fn: "buildOrderDeliveredEmail",
    subject: "Seu pedido foi entregue! #{{ORDER_NUMBER}}",
  },
  {
    key: "order_cancelled",
    name: "Pedido Cancelado",
    trigger: "Admin cancela ou webhook MP de cancelamento",
    description:
      "Notifica o cliente sobre o cancelamento. Inclui motivo e prazo estimado de reembolso se aplicável.",
    fn: "buildOrderCancelledEmail",
    subject: "Pedido #{{ORDER_NUMBER}} cancelado",
  },
  {
    key: "payment_retry",
    name: "Lembrete de Pagamento",
    trigger: "Pedido pendente há mais de 24h",
    description:
      "Lembrete automático para pedidos com pagamento ainda não aprovado. Link de retry incluído.",
    fn: "buildOrderPaymentRetryEmail",
    subject: "Seu pedido ainda está aguardando pagamento",
  },
];

const MOCK_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: 'Poppins', Arial, sans-serif; background: #fff5fa; margin: 0; padding: 24px; }
    .wrap { max-width: 580px; margin: 0 auto; background: #fff; border: 1px solid #fce7f3; }
    .hdr { background: #0f0f0f; padding: 28px 24px; text-align: center; }
    .hdr h1 { color: #FF00B6; font-size: 20px; margin: 0; letter-spacing: 2px; text-transform: uppercase; }
    .hdr p { color: #888; font-size: 11px; margin: 6px 0 0; }
    .body { padding: 24px; }
    .body p { color: #333; font-size: 13px; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    td { padding: 12px 8px; border-bottom: 1px solid #fce7f3; font-size: 13px; }
    .total-row td { border: none; font-weight: 700; font-size: 16px; color: #FF00B6; padding-top: 16px; }
    .footer { background: #f9f9f9; padding: 16px 24px; text-align: center; font-size: 11px; color: #aaa; border-top: 1px solid #fce7f3; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="hdr">
      <h1>Serena Glasses</h1>
      <p>Pedido confirmado</p>
    </div>
    <div class="body">
      <p>Olá, <strong>Cliente</strong>! Seu pedido foi confirmado com sucesso.</p>
      <table>
        <tr><td>Óculos Modelo XYZ · Rosa · 1x</td><td style="text-align:right">R$ 189,00</td></tr>
        <tr><td>Óculos Modelo ABC · Preto · 1x</td><td style="text-align:right">R$ 219,00</td></tr>
        <tr class="total-row"><td>Total</td><td style="text-align:right">R$ 408,00</td></tr>
      </table>
      <p style="font-size:12px;color:#999">Entrega estimada: 5–8 dias úteis via Correios PAC.</p>
    </div>
    <div class="footer">Serena Glasses &mdash; deco.thalisson@gmail.com</div>
  </div>
</body>
</html>`;

export function EmailsClient() {
  const [preview, setPreview] = useState<(typeof EMAIL_TEMPLATES)[0] | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <DevBadge />
        <div className="flex items-center gap-3">
          <Mail size={18} className="text-[#FF00B6]" />
          <h1 className="font-shrikhand text-2xl text-white tracking-wide">
            Templates de E-mail
          </h1>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/25">
          {EMAIL_TEMPLATES.length} templates transacionais · via Resend · editor visual em breve
        </p>
      </div>

      {/* Editor locked notice */}
      <div className="border border-[#FFD700]/20 bg-[#FFD700]/4 p-4 flex items-start gap-3">
        <Lock size={14} className="text-[#FFD700]/60 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-mono text-[10px] text-[#FFD700]/70 uppercase tracking-wider">
            Editor Visual — Em breve
          </p>
          <p className="font-mono text-[9px] text-white/30 leading-relaxed max-w-xl">
            Templates gerados via funções TypeScript em{" "}
            <span className="text-[#00F0FF]/50">
              features/emails/templates/orderTemplates.ts
            </span>{" "}
            e enviados via Resend. O editor visual permitirá customizar HTML/CSS sem
            necessidade de deploy.
          </p>
        </div>
      </div>

      {/* Template list */}
      <div className="space-y-3">
        {EMAIL_TEMPLATES.map((tpl) => (
          <div
            key={tpl.key}
            className="border border-white/8 bg-[#141414] hover:border-white/14 transition-colors"
          >
            <div className="flex items-start justify-between p-4 gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 border border-[#FF00B6]/20 bg-[#FF00B6]/5 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail size={14} className="text-[#FF00B6]/60" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-mono text-[12px] text-white font-bold tracking-wide">
                      {tpl.name}
                    </p>
                    <span className="px-2 py-0.5 font-mono text-[7px] uppercase tracking-widest border border-[#00F0FF]/20 text-[#00F0FF]/60 bg-[#00F0FF]/3">
                      {tpl.key}
                    </span>
                  </div>
                  <p className="font-mono text-[9px] text-white/25 uppercase tracking-wider mb-1.5">
                    Trigger: {tpl.trigger}
                  </p>
                  <p className="font-mono text-[10px] text-white/40 leading-relaxed">
                    {tpl.description}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-mono text-[7px] text-white/15 uppercase tracking-wider">
                      Subject:
                    </span>
                    <span className="font-mono text-[8px] text-white/25 italic">
                      {tpl.subject}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setPreview(tpl)}
                  className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest border border-[#00F0FF]/20 text-[#00F0FF]/60 hover:border-[#00F0FF]/40 hover:text-[#00F0FF]/80 transition-colors"
                >
                  <Eye size={11} />
                  Preview
                </button>
                <button
                  type="button"
                  disabled
                  className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest border border-white/5 text-white/15 cursor-not-allowed"
                >
                  <Code2 size={11} />
                  Editar
                </button>
              </div>
            </div>
            <div className="border-t border-white/5 px-4 py-2 flex items-center gap-2 bg-white/1">
              <span className="font-mono text-[7px] uppercase tracking-[0.3em] text-white/12">
                Função:
              </span>
              <code className="font-mono text-[8px] text-[#FF00B6]/30">{tpl.fn}()</code>
            </div>
          </div>
        ))}
      </div>

      {/* Preview modal */}
      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setPreview(null)}
        >
          <div
            className="bg-[#0f0f0f] border border-white/10 w-full max-w-2xl max-h-[80vh] flex flex-col shadow-[4px_4px_0_#FF00B6]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/8 shrink-0">
              <div>
                <p className="font-mono text-[11px] text-white font-bold">
                  {preview.name}
                </p>
                <p className="font-mono text-[8px] text-white/25 uppercase tracking-wider mt-0.5">
                  Preview com dados demonstrativos
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="p-1.5 text-white/30 hover:text-white/70 border border-white/5 hover:border-white/15 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-white">
              <iframe
                srcDoc={MOCK_HTML}
                title={`Preview: ${preview.name}`}
                className="w-full h-[480px] border-none"
                sandbox="allow-same-origin"
              />
            </div>
            <div className="border-t border-white/5 p-3 flex items-center gap-2 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
              <p className="font-mono text-[8px] text-white/20 uppercase tracking-wider">
                Template real usa dados reais do pedido · via {preview.fn}()
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
