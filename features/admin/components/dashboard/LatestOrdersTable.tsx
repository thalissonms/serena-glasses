/**
 * Component: LatestOrdersTable — tabela compacta dos 10 últimos pedidos.
 *
 * Exibe order#, cliente, valor (font-jocham), status badge com neon glow e data.
 * Server Component: sem interatividade, apenas display de dados passados via props.
 *
 * Usado em: src/app/admin/page.tsx.
 */
import Link from "next/link";
import type { LatestOrder } from "@features/admin/services/dashboard.service";
import { formatPrice } from "@features/products/utils/formatPrice";

const STATUS_NEON: Record<string, { bg: string; color: string }> = {
  pending: {
    bg: "rgba(255,215,0,0.08)",
    color: "#FFD700",
  },
  paid: {
    bg: "rgba(255,0,182,0.08)",
    color: "var(--brand-pink)",
  },
  processing: {
    bg: "rgba(80,120,255,0.1)",
    color: "#8899FF",
  },
  shipped: {
    bg: "rgba(160,60,255,0.1)",
    color: "#BB77FF",
  },
  delivered: {
    bg: "rgba(0,240,120,0.08)",
    color: "#00EE88",
  },
  cancelled: {
    bg: "rgba(255,50,80,0.08)",
    color: "#FF5566",
  },
  refunded: {
    bg: "rgba(255,120,0,0.08)",
    color: "#FF8844",
  },
  payment_failed: {
    bg: "rgba(255,0,60,0.08)",
    color: "#FF2244",
  },
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Aguardando",
  paid: "Pago",
  processing: "Processando",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
  refunded: "Reembolso",
  payment_failed: "Falha",
};

function shortDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

interface Props {
  orders: LatestOrder[];
}

export function LatestOrdersTable({ orders }: Props) {
  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="font-mono text-[11px] uppercase tracking-widest text-white/15">
          Sem pedidos recentes
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full min-w-[480px]">
        <thead>
          <tr>
            {["Pedido", "Cliente", "Valor", "Status", "Data"].map((h) => (
              <th
                key={h}
                className="pb-3 font-mono text-[14px] uppercase tracking-[0.3em] text-brand-pink/60 text-left border-b border-white/5"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const neon =
              STATUS_NEON[order.status] ?? STATUS_NEON.cancelled;
            return (
              <tr
                key={order.id}
                className="border-b border-white/4 hover:bg-white/2 transition-colors"
              >
                <td className="py-2.5 pr-4">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-mono text-[13px] text-brand-blue/80 hover:text-brand-blue transition-colors"
                  >
                    #{order.order_number}
                  </Link>
                </td>
                <td className="py-2.5 pr-4 max-w-25">
                  <span className="font-poppins text-[13px] text-white/55 truncate block">
                    {order.full_name}
                  </span>
                </td>
                <td className="py-2.5 pr-4">
                  <span className="font-poppins font-bold text-[16px] text-white leading-none">
                    {order.total !== null ? formatPrice(order.total) : "—"}
                  </span>
                </td>
                <td className="py-2.5 pr-4">
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.15em] px-2 py-1 whitespace-nowrap rounded-none"
                    style={{
                      background: neon.bg,
                      color: neon.color,
                      border: `1px solid ${neon.color}4d`,
                      boxShadow: 'inset 0 0 15px rgba(255,0,182,0.05)',
                    }}
                  >
                    {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                </td>
                <td className="py-2.5">
                  <span className="font-mono text-[13px] text-white/70">
                    {shortDate(order.created_at)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
