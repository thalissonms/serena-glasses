"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  ShoppingBag,
  DollarSign,
  Clock,
  Package,
  Truck,
  LucideIcon,
} from "lucide-react";
import { formatPrice } from "@features/products/utils/formatPrice";
import { filterBySearch } from "../utils/filterBySearch";
import { TableSearch } from "./AdminTableSearch";
import { OrderInterface } from "../types/orders.interface";
import { STATUS_COLOR, STATUS_LABEL } from "../consts/orders.const";

/* ================= TYPES ================= */


type FilterType = "all" | "paid" | "pending" | "toSend";

/* ================= CONSTANTS ================= */

const FILTER_LABEL: Record<FilterType, string> = {
  all: "Todos os pedidos",
  paid: "Pedidos pagos",
  pending: "Pedidos aguardando pagamento",
  toSend: "Pedidos para envio",
};
const FILTER_ICON: Record<FilterType, LucideIcon> = {
  all: ShoppingBag,
  paid: DollarSign,
  pending: Clock,
  toSend: Truck,
};

/* ================= COMPONENT ================= */

interface Props {
  orders: OrderInterface[];
  productsCount: number;
}

export default function DashboardClient({ orders, productsCount }: Props) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");

  /* ================= FINANCIAL ================= */

  const paidOrders = useMemo(
    () =>
      orders.filter((o) =>
        ["paid", "processing", "shipped", "delivered"].includes(o.status),
      ),
    [orders],
  );

  const pendingOrders = useMemo(
    () => orders.filter((o) => o.status === "pending"),
    [orders],
  );

  const validOrders = useMemo(
    () => orders.filter((o) => o.status !== "cancelled"),
    [orders],
  );

  const revenuePaid = useMemo(
    () => paidOrders.reduce((sum, o) => sum + (o.total ?? 0), 0),
    [paidOrders],
  );

  const revenuePending = useMemo(
    () => pendingOrders.reduce((sum, o) => sum + (o.total ?? 0), 0),
    [pendingOrders],
  );

  const revenueTotal = useMemo(
    () => validOrders.reduce((sum, o) => sum + (o.total ?? 0), 0),
    [validOrders],
  );

  /* ================= FILTER ================= */

  const filteredOrders = useMemo(() => {
    let result = orders;

    // filtro por status
    switch (filter) {
      case "paid":
        result = result.filter((o) => o.status === "paid");
        break;

      case "pending":
        result = result.filter((o) => o.status === "pending");
        break;

      case "toSend":
        result = result.filter(
          (o) => o.status === "paid" || o.status === "processing",
        );
        break;
    }

    // filtro por busca
    if (search) {
      result = filterBySearch(result, search, ["order_number", "full_name"]);
    }

    return result;
  }, [orders, filter, search]);

  const CurrentIcon = FILTER_ICON[filter];

  /* ================= STATS ================= */

  const stats = [
    {
      label: "Total de pedidos",
      value: orders.length,
      icon: ShoppingBag,
      color: "text-brand-pink",
      key: "all" as FilterType,
    },
    {
      label: "Para envio",
      value: orders.filter(
        (o) => o.status === "paid" || o.status === "processing",
      ).length,
      icon: Truck,
      color: "text-brand-blue",
      key: "toSend" as FilterType,
    },
    {
      label: "Aguardando pagamento",
      value: pendingOrders.length,
      icon: Clock,
      color: "text-yellow-400",
      key: "pending" as FilterType,
    },
  ];

  const financial = [
    {
      label: "Receita recebida",
      value: formatPrice(revenuePaid),
      icon: DollarSign,
      color: "text-green-400",
    },
    {
      label: "A receber",
      value: formatPrice(revenuePending),
      icon: Clock,
      color: "text-yellow-400",
    },
    {
      label: "Total previsto",
      value: formatPrice(revenueTotal),
      icon: ShoppingBag,
      color: "text-brand-pink",
    },
    {
      label: "Produtos ativos",
      value: productsCount,
      icon: Package,
      color: "text-blue-400",
    },
  ];

  /* ================= UI ================= */

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-poppins font-black text-2xl text-white uppercase">
          Dashboard
        </h1>
        <p className="text-sm text-gray-400">Visão geral da loja</p>
      </div>

      {/* Financial */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {financial.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-[#0f0f0f] border-2 border-white/10 p-6"
          >
            <Icon size={20} className={color} />

            <p className={`font-poppins font-black text-2xl ${color}`}>
              {value}
            </p>

            <p className="text-xs text-gray-500 uppercase">{label}</p>
          </div>
        ))}
      </div>

      {/* Stats (clicáveis) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, color, key }) => (
          <div
            key={label}
            onClick={() => setFilter(key)}
            className={clsx(
              "bg-[#0f0f0f] border-2 p-6 cursor-pointer transition",
              filter === key
                ? "border-brand-pink"
                : "border-white/10 hover:border-brand-pink/40",
            )}
          >
            <Icon size={20} className={color} />

            <p className={`font-poppins font-black text-2xl ${color}`}>
              {value}
            </p>

            <p className="text-xs text-gray-500 uppercase">{label}</p>
          </div>
        ))}
      </div>

      {/* Orders */}
      <div className="bg-[#0f0f0f] border-2 border-white/10">
        <div className="w-full flex items-center justify-between border-b border-white/10 px-6 py-4">
          <span className="font-poppins font-black text-sm text-white uppercase flex items-center">
            <CurrentIcon size={18} className="inline-block mr-2" />
            {FILTER_LABEL[filter]}
          </span>

          <TableSearch
            value={search}
            onChange={setSearch}
          />
        </div>

        <table className="w-full">
          <tbody>
            {filteredOrders.slice(0, 8).map((order) => (
              <tr key={order.id} className="hover:bg-white/5">
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-brand-pink font-bold text-xs"
                  >
                    #{order.order_number}
                  </Link>
                </td>

                <td className="text-gray-300 text-sm">{order.full_name}</td>

                <td className="text-white text-sm">
                  {formatPrice(order.total ?? 0)}
                </td>

                <td>
                  <span
                    className={`px-2 py-1 border text-[10px] uppercase ${STATUS_COLOR[order.status]}`}
                  >
                    {STATUS_LABEL[order.status]}
                  </span>
                </td>

                <td className="text-gray-500 text-xs">
                  {new Date(order.created_at).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}

            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-10">
                  Nenhum pedido encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
