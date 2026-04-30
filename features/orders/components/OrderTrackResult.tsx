import { MapPin, CreditCard, Package, Truck } from "lucide-react";
import { formatPrice } from "@features/products/utils/formatPrice";

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  pending:    { label: "Aguardando pagamento", bg: "bg-yellow-100", text: "text-yellow-800" },
  paid:       { label: "Pagamento confirmado", bg: "bg-green-100",  text: "text-green-800"  },
  processing: { label: "Em processamento",     bg: "bg-blue-100",   text: "text-blue-800"   },
  shipped:    { label: "Enviado",              bg: "bg-purple-100", text: "text-purple-800" },
  delivered:  { label: "Entregue",             bg: "bg-green-100",  text: "text-green-800"  },
  cancelled:  { label: "Cancelado",            bg: "bg-red-100",    text: "text-red-800"    },
};

const PAYMENT_LABEL: Record<string, string> = {
  card:   "Cartão de crédito",
  pix:    "PIX",
  boleto: "Boleto bancário",
};

interface OrderItem {
  id: string;
  product_name: string;
  color_name: string;
  price: number;
  quantity: number;
}

interface Order {
  order_number: string;
  status: string;
  created_at: string;
  full_name: string;
  street: string;
  street_number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  payment_method: string;
  installments: number;
  subtotal: number;
  total: number;
  tracking_code?: string | null;
  tracking_carrier?: string | null;
  order_items: OrderItem[];
}

interface OrderTrackResultProps {
  order: Order;
}

export default function OrderTrackResult({ order }: OrderTrackResultProps) {
  const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
  const createdAt = new Date(order.created_at).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="w-full max-w-lg mx-auto mt-8 flex flex-col gap-4">
      {/* Header */}
      <div className="border-4 border-black dark:border-brand-pink shadow-[6px_6px_0_#FF00B6] bg-white dark:bg-[#1a1a1a] p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="font-poppins text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Número do pedido
            </p>
            <p className="font-poppins font-black text-xl tracking-wider text-black dark:text-white mt-0.5">
              #{order.order_number}
            </p>
          </div>
          <span
            className={`font-poppins text-xs font-bold uppercase tracking-wider px-3 py-1.5 border-2 border-black ${status.bg} ${status.text} whitespace-nowrap`}
          >
            {status.label}
          </span>
        </div>
        <p className="font-inter text-xs text-gray-400 dark:text-gray-500">Pedido realizado em {createdAt}</p>
      </div>

      {/* Tracking */}
      {(order.tracking_code || order.tracking_carrier) && (
        <div className="border-4 border-black dark:border-purple-500 shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#a855f7] bg-white dark:bg-[#1a1a1a]">
          <div className="flex items-center gap-2 px-5 py-4 border-b-2 border-black dark:border-purple-500/50">
            <Truck size={14} className="text-purple-500" />
            <h2 className="font-poppins font-black text-xs uppercase tracking-wider">Rastreio</h2>
          </div>
          <div className="px-5 py-4">
            {order.tracking_code && (
              <p className="font-mono font-bold text-sm text-black dark:text-white">{order.tracking_code}</p>
            )}
            {order.tracking_carrier && (
              <p className="font-inter text-xs text-gray-500 dark:text-gray-400 mt-0.5">{order.tracking_carrier}</p>
            )}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="border-4 border-black dark:border-brand-pink shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#FF00B6] bg-white dark:bg-[#1a1a1a]">
        <div className="flex items-center gap-2 px-5 py-4 border-b-2 border-black dark:border-brand-pink/50">
          <Package size={14} className="text-brand-pink" />
          <h2 className="font-poppins font-black text-xs uppercase tracking-wider">
            Itens do pedido
          </h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-brand-pink/20">
          {order.order_items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 px-5 py-3">
              <div className="flex-1 min-w-0">
                <p className="font-poppins font-bold text-sm truncate">{item.product_name}</p>
                <p className="font-inter text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {item.color_name} · {item.quantity}×
                </p>
              </div>
              <span className="font-poppins font-semibold text-sm shrink-0">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t-2 border-black dark:border-brand-pink/50 px-5 py-4 flex justify-between items-baseline">
          <span className="font-poppins font-black text-sm uppercase tracking-wide">Total</span>
          <span className="font-yellowtail text-2xl text-brand-pink leading-none">
            {formatPrice(order.total)}
          </span>
        </div>
      </div>

      {/* Address */}
      <div className="border-4 border-black dark:border-brand-pink shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#FF00B6] bg-white dark:bg-[#1a1a1a]">
        <div className="flex items-center gap-2 px-5 py-4 border-b-2 border-black dark:border-brand-pink/50">
          <MapPin size={14} className="text-brand-pink" />
          <h2 className="font-poppins font-black text-xs uppercase tracking-wider">
            Endereço de entrega
          </h2>
        </div>
        <div className="px-5 py-4">
          <p className="font-poppins font-semibold text-sm">{order.full_name}</p>
          <p className="font-inter text-sm text-gray-600 dark:text-gray-400 mt-1">
            {order.street}, {order.street_number}
            {order.complement ? ` — ${order.complement}` : ""}
          </p>
          <p className="font-inter text-sm text-gray-600 dark:text-gray-400">
            {order.neighborhood} · {order.city} / {order.state}
          </p>
          <p className="font-inter text-xs text-gray-400 dark:text-gray-500 mt-1">CEP {order.cep}</p>
        </div>
      </div>

      {/* Payment */}
      <div className="border-4 border-black dark:border-brand-pink shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#FF00B6] bg-white dark:bg-[#1a1a1a]">
        <div className="flex items-center gap-2 px-5 py-4 border-b-2 border-black dark:border-brand-pink/50">
          <CreditCard size={14} className="text-brand-pink" />
          <h2 className="font-poppins font-black text-xs uppercase tracking-wider">Pagamento</h2>
        </div>
        <div className="px-5 py-4">
          <p className="font-poppins font-semibold text-sm">
            {PAYMENT_LABEL[order.payment_method] ?? order.payment_method}
            {order.payment_method === "card" && order.installments > 1
              ? ` · ${order.installments}×`
              : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
