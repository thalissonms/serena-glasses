"use client";
/**
 * Component: OrderDetailClient — detalhe interativo de pedido no /admin.
 *
 * Grid 2+1 col: esquerda (itens, cliente, envio, tracking timeline, metadados);
 * direita sticky (status updater, tracking, etiqueta ME, retry, refund).
 * Toda mutação chama a API existente e faz router.refresh() no sucesso.
 *
 * Usado em: src/app/admin/orders/[id]/page.tsx.
 */
import { type ReactNode, useState } from "react";
import { fmtDateTime } from "../../utils/formatDate";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  Truck,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  FileText,
  X as XIcon,
} from "lucide-react";
import { toast } from "sonner";
import { clsx } from "clsx";
import { Button } from "@features/admin/components/primitives/Button";
import { Badge } from "@features/admin/components/primitives/Badge";
import { Modal } from "@features/admin/components/primitives/Modal";
import { Input } from "@features/admin/components/primitives/Input";
import { Select } from "@features/admin/components/primitives/Select";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderDetailOrder {
  id: string;
  order_number: string;
  status: string;
  created_at: string;
  updated_at: string | null;
  full_name: string;
  email: string;
  cpf: string | null;
  phone: string | null;
  street: string | null;
  street_number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  cep: string | null;
  total: number;
  shipping: number | null;
  discount: number;
  coupon_code: string | null;
  payment_method: string;
  mp_payment_id: string | null;
  paid_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  expires_at: string | null;
  cancelled_at: string | null;
  cancel_reason: string | null;
  tracking_code: string | null;
  tracking_carrier: string | null;
  payment_attempts: number;
  me_order_id: string | null;
  me_label_url: string | null;
  me_status: string | null;
  shipping_service_name: string | null;
}

interface OrderDetailItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
  variant_id: string | null;
  color: string | null;
  color_label: string | null;
}

interface TrackingEvent {
  id: string;
  occurred_at: string;
  description: string;
  location: string | null;
}

interface Props {
  order: OrderDetailOrder;
  items: OrderDetailItem[];
  events: TrackingEvent[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: "pending", label: "Aguardando" },
  { value: "paid", label: "Pago" },
  { value: "processing", label: "Processando" },
  { value: "shipped", label: "Enviado" },
  { value: "delivered", label: "Entregue" },
  { value: "cancelled", label: "Cancelado" },
  { value: "payment_failed", label: "Pagamento Falhou" },
  { value: "refunded", label: "Reembolsado" },
];

const STATUS_LABEL: Record<string, string> = Object.fromEntries(
  STATUS_OPTIONS.map((o) => [o.value, o.label]),
);

const REFUNDABLE_STATUSES = new Set(["paid", "processing", "shipped"]);
const VALID_BADGE_STATUSES = new Set([
  "pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded",
]);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtPrice(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return "—";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    cents / 100,
  );
}



function fmtCEP(cep: string | null): string {
  if (!cep) return "—";
  const d = cep.replace(/\D/g, "");
  return d.length === 8 ? `${d.slice(0, 5)}-${d.slice(5)}` : cep;
}

function fmtCPF(cpf: string | null): string {
  if (!cpf) return "—";
  const d = cpf.replace(/\D/g, "");
  return d.length === 11
    ? `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
    : cpf;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="bg-[#0a0a0a] border border-white/6 shadow-[inset_1px_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#0a0a0a]/50">
        <span className="text-white/20">{icon}</span>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">{"// "}{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function DataRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5 border-b border-white/4 last:border-0">
      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/25 shrink-0">{"// "}{label}
      </span>
      <span
        className={clsx(
          "text-right truncate max-w-[60%]",
          mono
            ? "font-mono text-[12px] text-white/55"
            : "font-poppins text-[14px] text-white/60",
        )}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  if (VALID_BADGE_STATUSES.has(status)) {
    return <Badge variant={status as any /* eslint-disable-line @typescript-eslint/no-explicit-any */} />;
  }
  if (status === "payment_failed") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.25em] border text-red-400 border-red-500/30 bg-red-500/8">{"// "}FALHOU
      </span>
    );
  }
  return <span className="font-mono text-[11px] text-white/25">{"// "}{status}</span>;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function OrderDetailClient({ order, items, events }: Props) {
  const router = useRouter();

  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [trackingCode, setTrackingCode] = useState(order.tracking_code ?? "");
  const [trackingCarrier, setTrackingCarrier] = useState(order.tracking_carrier ?? "");
  const [metadataExpanded, setMetadataExpanded] = useState(false);
  const [statusConfirmOpen, setStatusConfirmOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);

  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [isSavingTracking, setIsSavingTracking] = useState(false);
  const [isGeneratingLabel, setIsGeneratingLabel] = useState(false);
  const [isCancellingLabel, setIsCancellingLabel] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isRefunding, setIsRefunding] = useState(false);

  const itemsTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const isRefundable = REFUNDABLE_STATUSES.has(order.status);
  const canGenerateLabel = order.status === "paid" && !order.me_order_id;
  const canCancelLabel =
    !!order.me_order_id && order.me_status !== "posted" && order.me_status !== "delivered";

  async function handleSaveStatus() {
    setIsSavingStatus(true);
    setStatusConfirmOpen(false);
    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: selectedStatus }),
    });
    setIsSavingStatus(false);
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({}));
      toast.error(error ?? "Erro ao atualizar status");
      return;
    }
    toast.success(`Status atualizado para "${STATUS_LABEL[selectedStatus] ?? selectedStatus}"`);
    router.refresh();
  }

  async function handleSaveTracking() {
    setIsSavingTracking(true);
    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tracking_code: trackingCode, tracking_carrier: trackingCarrier }),
    });
    setIsSavingTracking(false);
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({}));
      toast.error(error ?? "Erro ao salvar rastreio");
      return;
    }
    toast.success("Rastreio salvo com sucesso");
    router.refresh();
  }

  async function handleGenerateLabel() {
    setIsGeneratingLabel(true);
    const res = await fetch(`/api/admin/orders/${order.id}/shipment`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setIsGeneratingLabel(false);
    if (!res.ok) {
      toast.error(data.error ?? "Erro ao gerar etiqueta");
      return;
    }
    if (data.me_label_url) {
      window.open(data.me_label_url, "_blank", "noopener,noreferrer");
      toast.success("Etiqueta gerada com sucesso");
    } else {
      toast.success("Etiqueta gerada — URL ainda sendo processada. Recarregue em segundos.");
    }
    router.refresh();
  }

  async function handleCancelLabel() {
    setIsCancellingLabel(true);
    const res = await fetch(`/api/admin/orders/${order.id}/shipment`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    setIsCancellingLabel(false);
    if (!res.ok) {
      toast.error(data.error ?? "Erro ao cancelar etiqueta");
      return;
    }
    toast.success("Etiqueta cancelada no Melhor Envio");
    router.refresh();
  }

  async function handleRetryPayment() {
    setIsRetrying(true);
    const res = await fetch(`/api/admin/orders/${order.id}/retry`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setIsRetrying(false);
    if (!res.ok) {
      toast.error(data.error ?? "Erro ao reativar pedido");
      return;
    }
    toast.success("Pedido reativado — cliente recebe nova janela de 24h");
    router.refresh();
  }

  async function handleRefund() {
    setIsRefunding(true);
    setRefundModalOpen(false);
    const res = await fetch(`/api/admin/orders/${order.id}/refund`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setIsRefunding(false);
    if (!res.ok) {
      toast.error(data.error ?? "Erro ao processar reembolso");
      return;
    }
    toast.success("Reembolso processado com sucesso");
    router.refresh();
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-full pb-10">

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex flex-col gap-0.5">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-white/20 hover:text-brand-pink transition-colors mb-2"
          >
            <ArrowLeft size={13} />
            Pedidos
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-[Shrikhand] text-4xl text-white tracking-wider leading-none">
              #{order.order_number}
            </h1>
            <OrderStatusBadge status={order.status} />
            <span className="font-mono text-[12px] text-white/20">{"// "}{fmtDateTime(order.created_at)}
            </span>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="font-mono text-3xl text-white font-bold tabular-nums">
            {fmtPrice(order.total)}
          </div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-white/20 mt-0.5">{"// "}{order.payment_method}
          </div>
        </div>
      </div>

      {/* ── 3-column Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">

        {/* ── Left Column (2/3) ── */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Items Table */}
          <SectionCard title="Itens do Pedido" icon={<Package size={15} />}>
            <div className="overflow-x-auto -mx-1">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Produto", "Cor", "Qtd", "Preço unit.", "Subtotal"].map((h) => (
                      <th
                        key={h}
                        className="py-2 px-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/20 font-normal text-left first:pl-0 last:pr-0 last:text-right"
                      >{"// "}{h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-white/4 hover:bg-white/2 transition-colors"
                    >
                      <td className="py-3 pl-0 px-2">
                        <span className="font-poppins text-[14px] text-white/70">
                          {item.product_name}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        {item.color ? (
                          <span className="inline-flex items-center gap-1.5">
                            <span
                              className="w-3 h-3 rounded-none border border-white/10 shrink-0"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="font-mono text-[11px] text-white/30">{"// "}{item.color_label ?? item.color}
                            </span>
                          </span>
                        ) : (
                          <span className="font-mono text-[11px] text-white/15">{"// "}—</span>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        <span className="font-mono text-[13px] text-white/50 tabular-nums">
                          ×{item.quantity}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="font-mono text-[13px] text-white/50 tabular-nums">
                          {fmtPrice(item.price)}
                        </span>
                      </td>
                      <td className="py-3 pr-0 px-2 text-right">
                        <span className="font-mono text-[14px] text-white/80 font-bold tabular-nums">
                          {fmtPrice(item.price * item.quantity)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals breakdown */}
            <div className="mt-4 pt-4 border-t border-white/6 flex flex-col gap-1.5 max-w-[260px] ml-auto">
              <div className="flex justify-between gap-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/20">{"// "}Subtotal
                </span>
                <span className="font-mono text-[13px] text-white/40 tabular-nums">
                  {fmtPrice(itemsTotal)}
                </span>
              </div>
              {(order.shipping ?? 0) > 0 && (
                <div className="flex justify-between gap-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/20">{"// "}Frete
                  </span>
                  <span className="font-mono text-[13px] text-white/40 tabular-nums">
                    +{fmtPrice(order.shipping)}
                  </span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between gap-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-brand-pink/40">{"// "}Desconto{order.coupon_code ? ` (${order.coupon_code})` : ""}
                  </span>
                  <span className="font-mono text-[13px] text-brand-pink/60 tabular-nums">
                    −{fmtPrice(order.discount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between gap-4 pt-2 border-t border-white/6">
                <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-white/50 font-bold">{"// "}Total
                </span>
                <span className="font-mono text-[17px] text-white font-bold tabular-nums">
                  {fmtPrice(order.total)}
                </span>
              </div>
            </div>
          </SectionCard>

          {/* Customer Card */}
          <SectionCard title="Cliente" icon={<User size={15} />}>
            <div className="flex flex-col">
              <DataRow label="Nome" value={order.full_name} />
              <DataRow label="Email" value={order.email} mono />
              <DataRow label="CPF" value={fmtCPF(order.cpf)} mono />
              <DataRow label="Telefone" value={order.phone ?? "—"} mono />
            </div>
          </SectionCard>

          {/* Shipping Card */}
          <SectionCard title="Endereço de Entrega" icon={<MapPin size={15} />}>
            <div className="flex flex-col">
              <DataRow label="CEP" value={fmtCEP(order.cep)} mono />
              <DataRow
                label="Endereço"
                value={
                  order.street
                    ? `${order.street}, ${order.street_number ?? "s/n"}${order.complement ? ` — ${order.complement}` : ""}`
                    : "—"
                }
              />
              <DataRow label="Bairro" value={order.neighborhood ?? "—"} />
              <DataRow
                label="Cidade / Estado"
                value={order.city ? `${order.city} / ${order.state}` : "—"}
              />
              <DataRow label="Serviço de frete" value={order.shipping_service_name ?? "—"} />
            </div>
          </SectionCard>

          {/* Tracking Events Timeline */}
          <SectionCard title="Eventos de Rastreio" icon={<Clock size={15} />}>
            {events.length === 0 ? (
              <div className="py-6 text-center">
                <span className="font-mono text-[11px] uppercase tracking-widest text-white/15">{"// "}Nenhum evento de rastreio registrado
                </span>
              </div>
            ) : (
              <div className="flex flex-col">
                {events.map((event, i) => (
                  <div key={event.id} className="flex gap-3 pb-4 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div
                        className={clsx(
                          "w-2 h-2 rounded-none border mt-1.5 shrink-0",
                          i === 0
                            ? "border-brand-pink bg-brand-pink/30 shadow-[0_0_6px_var(--brand-pink)]"
                            : "border-white/15 bg-transparent",
                        )}
                      />
                      {i < events.length - 1 && (
                        <div className="w-px flex-1 bg-white/6 mt-1 min-h-[16px]" />
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5 pb-1">
                      <span className="font-mono text-[11px] uppercase tracking-widest text-white/20">{"// "}{fmtDateTime(event.occurred_at)}
                        {event.location ? ` · ${event.location}` : ""}
                      </span>
                      <span className="font-poppins text-[14px] text-white/60">
                        {event.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Metadata Block (collapsible) */}
          <div className="bg-[#0a0a0a] border border-white/6">
            <button
              onClick={() => setMetadataExpanded((v) => !v)}
              className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 px-4 py-3 text-left hover:bg-white/2 transition-colors"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/25">{"// "}Metadados do Pedido
              </span>
              {metadataExpanded ? (
                <ChevronUp size={15} className="text-white/15" />
              ) : (
                <ChevronDown size={15} className="text-white/15" />
              )}
            </button>
            {metadataExpanded && (
              <div className="px-4 pb-4 border-t border-white/5">
                <div className="flex flex-col mt-3">
                  <DataRow label="ID do pedido" value={order.id} mono />
                  <DataRow label="MP Payment ID" value={order.mp_payment_id ?? "—"} mono />
                  <DataRow label="Método de pagamento" value={order.payment_method} mono />
                  <DataRow
                    label="Tentativas de pagamento"
                    value={String(order.payment_attempts)}
                    mono
                  />
                  <DataRow label="Pago em" value={fmtDateTime(order.paid_at)} mono />
                  <DataRow label="Enviado em" value={fmtDateTime(order.shipped_at)} mono />
                  <DataRow label="Entregue em" value={fmtDateTime(order.delivered_at)} mono />
                  <DataRow label="Expira em" value={fmtDateTime(order.expires_at)} mono />
                  <DataRow label="Cancelado em" value={fmtDateTime(order.cancelled_at)} mono />
                  <DataRow label="Motivo cancel." value={order.cancel_reason ?? "—"} mono />
                  {order.coupon_code && (
                    <>
                      <DataRow label="Cupom aplicado" value={order.coupon_code} mono />
                      <DataRow label="Desconto (cents)" value={String(order.discount)} mono />
                    </>
                  )}
                  <DataRow label="ME Order ID" value={order.me_order_id ?? "—"} mono />
                  <DataRow label="ME Status" value={order.me_status ?? "—"} mono />
                  <DataRow label="Atualizado em" value={fmtDateTime(order.updated_at)} mono />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column (1/3) — Sticky Actions Panel ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <div
              style={{
                boxShadow:
                  "4px 4px 0 var(--brand-pink), inset 1px 1px 0 rgba(255,255,255,0.06), inset -1px -1px 0 rgba(0,0,0,0.4)",
              }}
              className="bg-[#0a0a0a] border-2 border-brand-pink/30"
            >
              {/* Panel header */}
              <div className="px-4 py-3 border-b border-brand-pink/15 bg-linear-to-r from-[var(--brand-pink)]/10 via-[var(--brand-pink)]/5 to-transparent">
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand-pink/60">{"// "}Painel de Ações
                </span>
              </div>

              <div className="p-4 flex flex-col gap-5">

                {/* Status Updater */}
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/25">{"// "}Status
                  </span>
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                    options={STATUS_OPTIONS}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setStatusConfirmOpen(true)}
                    disabled={selectedStatus === order.status || isSavingStatus}
                    loading={isSavingStatus}
                    className="w-full"
                  >
                    Salvar Status
                  </Button>
                </div>

                <div className="border-t border-white/5" />

                {/* Tracking */}
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/25">{"// "}Rastreio Manual
                  </span>
                  <Input
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    placeholder="Código de rastreio"
                  />
                  <Input
                    value={trackingCarrier}
                    onChange={(e) => setTrackingCarrier(e.target.value)}
                    placeholder="Transportadora"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleSaveTracking}
                    loading={isSavingTracking}
                    className="w-full"
                  >
                    <Truck size={14} />
                    Salvar Rastreio
                  </Button>
                </div>

                <div className="border-t border-white/5" />

                {/* Melhor Envio Label */}
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/25">{"// "}Melhor Envio
                  </span>

                  {canGenerateLabel && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleGenerateLabel}
                      loading={isGeneratingLabel}
                      className="w-full"
                    >
                      <FileText size={14} />
                      Gerar Etiqueta ME
                    </Button>
                  )}

                  {isGeneratingLabel && (
                    <p className="font-mono text-[10px] uppercase tracking-widest text-brand-pink/50 animate-pulse text-center">{"// "}Aguardando Melhor Envio...
                    </p>
                  )}

                  {order.me_label_url && (
                    <a
                      href={order.me_label_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-brand-pink border border-brand-pink/30 hover:border-brand-pink hover:shadow-[0_0_8px_rgba(255,0,182,0.2)] transition-all duration-150"
                    >
                      <ExternalLink size={13} />
                      Abrir Etiqueta PDF
                    </a>
                  )}

                  {order.me_order_id && !order.me_label_url && (
                    <div className="font-mono text-[11px] text-[#FFD700]/50 border border-[#FFD700]/15 px-3 py-2">{"// "}Etiqueta gerada — URL ainda sendo processada
                    </div>
                  )}

                  {canCancelLabel && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleCancelLabel}
                      loading={isCancellingLabel}
                      className="w-full"
                    >
                      <XIcon size={14} />
                      Cancelar Etiqueta ME
                    </Button>
                  )}

                  {order.me_status && (
                    <div className="font-mono text-[10px] uppercase tracking-widest text-white/15 text-right">{"// "}ME: {order.me_status}
                    </div>
                  )}

                  {!canGenerateLabel && !order.me_order_id && (
                    <div className="font-mono text-[11px] text-white/15 border border-white/5 px-3 py-2">{"// "}{order.status !== "paid"
                        ? "Disponível apenas para pedidos pagos"
                        : "Etiqueta já gerada"}
                    </div>
                  )}
                </div>

                {/* Retry Payment (payment_failed only) */}
                {order.status === "payment_failed" && (
                  <>
                    <div className="border-t border-white/5" />
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/25">{"// "}Pagamento
                        </span>
                        <span className="font-mono text-[11px] text-red-400/50">{"// "}{order.payment_attempts}/4 tentativas
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRetryPayment}
                        loading={isRetrying}
                        className="w-full"
                      >
                        <RefreshCw size={14} />
                        Reativar para Retry
                      </Button>
                      <p className="font-mono text-[10px] text-white/20 leading-relaxed">{"// "}Reseta para &quot;Pendente&quot; e abre janela de 24h para nova tentativa.
                      </p>
                    </div>
                  </>
                )}

                {/* Refund */}
                {isRefundable && (
                  <>
                    <div className="border-t border-red-500/10" />
                    <div className="flex flex-col gap-2">
                      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-red-400/35">{"// "}Zona de Perigo
                      </span>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setRefundModalOpen(true)}
                        disabled={isRefunding}
                        loading={isRefunding}
                        className="w-full"
                      >
                        <AlertTriangle size={14} />
                        Emitir Reembolso
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Status Confirm Modal ── */}
      <Modal
        open={statusConfirmOpen}
        onOpenChange={setStatusConfirmOpen}
        title="Confirmar Mudança de Status"
        description="Esta ação pode disparar emails automáticos"
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setStatusConfirmOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveStatus}
              loading={isSavingStatus}
            >
              Confirmar
            </Button>
          </>
        }
      >
        <p className="font-poppins text-[15px] text-white/60 leading-relaxed">
          Alterar status de{" "}
          <span className="text-brand-pink font-bold">
            {STATUS_LABEL[order.status] ?? order.status}
          </span>{" "}
          para{" "}
          <span className="text-brand-pink font-bold">
            {STATUS_LABEL[selectedStatus] ?? selectedStatus}
          </span>
          ?
        </p>
        {(selectedStatus === "shipped" || selectedStatus === "cancelled") && (
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#FFD700]/55 mt-3 border border-[#FFD700]/15 px-3 py-2">{"// "}{selectedStatus === "shipped"
              ? "Um email de envio será enviado ao cliente."
              : "Um email de cancelamento será enviado ao cliente."}
          </p>
        )}
      </Modal>

      {/* ── Refund Confirm Modal ── */}
      <Modal
        open={refundModalOpen}
        onOpenChange={setRefundModalOpen}
        title="Confirmar Reembolso"
        description="Esta ação é irreversível"
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setRefundModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleRefund}
              loading={isRefunding}
            >
              <AlertTriangle size={14} />
              Confirmar Reembolso
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <p className="font-poppins text-[15px] text-white/60 leading-relaxed">
            Você está prestes a reembolsar{" "}
            <span className="text-white font-bold">{fmtPrice(order.total)}</span> ao cliente{" "}
            <span className="text-brand-pink font-semibold">{order.full_name}</span>.
          </p>
          <div className="border border-red-500/20 bg-red-500/5 p-3 flex flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-400/60 font-bold">{"// "}Efeitos em cascata:
            </span>
            <ul className="font-mono text-[12px] text-white/35 flex flex-col gap-1 mt-1">
              <li>· Reembolso processado no Mercado Pago</li>
              <li>· Etiqueta ME cancelada (se gerada e não postada)</li>
              <li>· Email de cancelamento enviado ao cliente</li>
              <li>· Status do pedido alterado para &quot;Reembolsado&quot;</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
}


