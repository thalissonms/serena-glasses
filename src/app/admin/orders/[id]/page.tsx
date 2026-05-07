import { getSupabaseServer } from "@shared/lib/supabase/server";
import { requireAdmin } from "@shared/lib/auth/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, CreditCard, Package, Truck } from "lucide-react";
import OrderStatusUpdater from "@features/admin/components/OrderStatusUpdater";
import RefundButton from "@features/admin/components/RefundButton";
import RetryPaymentButton from "@features/admin/components/RetryPaymentButton";
import GenerateLabelButton from "@features/admin/components/GenerateLabelButton";
import { PAYMENT_LABEL } from "@features/admin/consts/orders.const";

function formatBRL(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const { data: order } = await getSupabaseServer()
    .from("orders")
    .select("*, order_items(*), me_order_id, me_label_url, me_status, shipping_service_id, shipping_service_name")
    .eq("id", id)
    .single();

  if (!order) notFound();

  const createdAt = new Date(order.created_at).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1.5 font-poppins text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-brand-pink transition-colors mb-3"
          >
            <ArrowLeft size={12} /> Voltar aos pedidos
          </Link>
          <h1 className="font-poppins font-black text-2xl text-white uppercase tracking-wide">
            #{order.order_number}
          </h1>
          <p className="font-inter text-sm text-gray-400 mt-1">{createdAt}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <OrderStatusUpdater
            orderId={id}
            currentStatus={order.status}
            trackingCode={(order as any).tracking_code}
            carrier={(order as any).tracking_carrier}
          />
          <RefundButton
            orderId={id}
            currentStatus={order.status}
            hasMpPaymentId={!!(order as any).mp_payment_id}
          />
          <RetryPaymentButton orderId={id} currentStatus={order.status} />
          <GenerateLabelButton
            orderId={id}
            currentStatus={order.status}
            meOrderId={(order as any).me_order_id ?? null}
            meLabelUrl={(order as any).me_label_url ?? null}
            shippingServiceId={(order as any).shipping_service_id ?? null}
          />
        </div>
      </div>

      {((order as any).shipping_service_name || (order as any).me_status) && (
        <div className="bg-[#0f0f0f] border-2 border-purple-500/20 p-4 mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Truck size={14} className="text-purple-400 shrink-0" />
            <div>
              <p className="font-poppins font-black text-xs text-gray-400 uppercase tracking-widest mb-1">
                Envio
              </p>
              {(order as any).shipping_service_name && (
                <p className="font-inter text-sm text-white">{(order as any).shipping_service_name}</p>
              )}
            </div>
          </div>
          {(order as any).me_status && (
            <span className="font-poppins font-black text-[10px] uppercase tracking-widest border px-2 py-1 border-purple-500/40 text-purple-400">
              {(order as any).me_status === "generated" && "Etiqueta gerada"}
              {(order as any).me_status === "posted" && "Postado"}
              {(order as any).me_status === "delivered" && "Entregue"}
              {(order as any).me_status === "canceled" && "Etiqueta cancelada"}
            </span>
          )}
        </div>
      )}

      {((order as any).tracking_code || (order as any).tracking_carrier) && (
        <div className="bg-[#0f0f0f] border-2 border-purple-500/30 p-4 mb-4 flex items-center gap-3">
          <Truck size={14} className="text-purple-400 shrink-0" />
          <div className="flex-1">
            <p className="font-poppins font-black text-xs text-gray-400 uppercase tracking-widest mb-1">Rastreio</p>
            {(order as any).tracking_code && (
              <p className="font-mono text-sm text-white">{(order as any).tracking_code}</p>
            )}
            {(order as any).tracking_carrier && (
              <p className="font-inter text-xs text-gray-500">{(order as any).tracking_carrier}</p>
            )}
          </div>
        </div>
      )}

      {(order as any).payment_error && (
        <div className="bg-[#0f0f0f] border-2 border-red-500/30 p-4 mb-4">
          <p className="font-poppins font-black text-xs text-red-400 uppercase tracking-widest mb-2">
            Erro de pagamento
          </p>
          {(order as any).payment_error?.status_detail && (
            <p className="font-mono text-xs text-gray-300">
              status_detail: {(order as any).payment_error.status_detail}
            </p>
          )}
          {(order as any).payment_error?.message && (
            <p className="font-mono text-xs text-gray-300">{(order as any).payment_error.message}</p>
          )}
          {(order as any).payment_error?.mp_status && (
            <p className="font-mono text-xs text-gray-500 mt-1">
              mp_status: {(order as any).payment_error.mp_status}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Customer */}
        <div className="bg-[#0f0f0f] border-2 border-white/10 p-5">
          <h2 className="font-poppins font-black text-xs text-gray-400 uppercase tracking-widest mb-4">
            Cliente
          </h2>
          <p className="font-poppins font-bold text-sm text-white">{order.full_name}</p>
          <p className="font-inter text-sm text-gray-400 mt-1">{order.email}</p>
          {order.phone && <p className="font-inter text-sm text-gray-400">{order.phone}</p>}
          {order.cpf && (
            <p className="font-inter text-xs text-gray-600 mt-2">CPF: {order.cpf}</p>
          )}
        </div>

        {/* Payment */}
        <div className="bg-[#0f0f0f] border-2 border-white/10 p-5">
          <h2 className="font-poppins font-black text-xs text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <CreditCard size={12} /> Pagamento
          </h2>
          <p className="font-poppins font-semibold text-sm text-white">
            {PAYMENT_LABEL[order.payment_method] ?? order.payment_method}
            {order.payment_method === "card" && order.installments > 1
              ? ` · ${order.installments}×`
              : ""}
          </p>
          <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="font-inter text-xs text-gray-500">Subtotal</span>
              <span className="font-poppins text-xs text-gray-300">
                {formatBRL(order.subtotal ?? 0)}
              </span>
            </div>
            {(order as { discount?: number }).discount != null && (order as { discount?: number }).discount! > 0 && (
              <div className="flex justify-between">
                <span className="font-inter text-xs text-gray-500 flex items-center gap-1.5">
                  Desconto
                  {(order as { coupon_code?: string | null }).coupon_code && (
                    <span className="font-mono text-[10px] bg-brand-pink/10 text-brand-pink border border-brand-pink/30 px-1.5 py-0.5">
                      {(order as { coupon_code?: string | null }).coupon_code}
                    </span>
                  )}
                </span>
                <span className="font-poppins text-xs text-brand-pink">
                  -{formatBRL((order as { discount?: number }).discount!)}
                </span>
              </div>
            )}
            <div className="flex justify-between pt-1 border-t border-white/10 mt-1">
              <span className="font-inter text-xs text-gray-500">Total</span>
              <span className="font-poppins font-black text-sm text-brand-pink">
                {formatBRL(order.total ?? 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-[#0f0f0f] border-2 border-white/10 p-5">
          <h2 className="font-poppins font-black text-xs text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <MapPin size={12} /> Endereço de entrega
          </h2>
          <p className="font-inter text-sm text-gray-300">
            {order.street}, {order.street_number}
            {order.complement ? ` — ${order.complement}` : ""}
          </p>
          <p className="font-inter text-sm text-gray-300">
            {order.neighborhood} · {order.city} / {order.state}
          </p>
          <p className="font-inter text-xs text-gray-500 mt-1">CEP {order.cep}</p>
        </div>

        {/* Items */}
        <div className="bg-[#0f0f0f] border-2 border-white/10 p-5">
          <h2 className="font-poppins font-black text-xs text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Package size={12} /> Itens ({order.order_items?.length ?? 0})
          </h2>
          <div className="flex flex-col gap-3">
            {order.order_items?.map((item: {
              id: string;
              product_name: string;
              color_name: string;
              quantity: number;
              price: number;
            }) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-poppins font-bold text-xs text-white">{item.product_name}</p>
                  <p className="font-inter text-[10px] text-gray-500 mt-0.5">
                    {item.color_name} · {item.quantity}×
                  </p>
                </div>
                <span className="font-poppins font-semibold text-xs text-gray-300">
                  {formatBRL(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
