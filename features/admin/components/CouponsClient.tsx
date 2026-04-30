"use client";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, ToggleLeft, ToggleRight, Plus, Copy } from "lucide-react";
import type { CouponWithUsageInterface } from "@features/coupons/types/coupon.interface";

function formatBRL(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

function formatValidity(coupon: CouponWithUsageInterface) {
  const from = new Date(coupon.valid_from).toLocaleDateString("pt-BR");
  if (!coupon.valid_until) return `Desde ${from}`;
  const until = new Date(coupon.valid_until).toLocaleDateString("pt-BR");
  return `${from} → ${until}`;
}

function formatDiscount(coupon: CouponWithUsageInterface) {
  if (coupon.discount_type === "percentage") return `${coupon.discount_value}%`;
  return formatBRL(coupon.discount_value);
}

function formatUsage(coupon: CouponWithUsageInterface) {
  const limit = coupon.usage_limit_total;
  return limit != null ? `${coupon.usage_count}/${limit}` : `${coupon.usage_count}/∞`;
}

export default function CouponsClient({
  initialCoupons,
}: {
  initialCoupons: CouponWithUsageInterface[];
}) {
  const [coupons, setCoupons] = useState(initialCoupons);

  async function toggleActive(id: string, current: boolean) {
    const res = await fetch(`/api/admin/coupons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !current }),
    });
    if (!res.ok) { toast.error("Erro ao atualizar cupom"); return; }
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !current } : c)),
    );
    toast.success(current ? "Cupom desativado" : "Cupom ativado");
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    toast.success(`Código ${code} copiado!`);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-poppins font-black text-2xl text-white uppercase tracking-wide">
          Cupons
        </h1>
        <Link
          href="/admin/coupons/new"
          className="flex items-center gap-2 px-4 py-2 bg-brand-pink border-2 border-brand-pink text-white font-poppins text-xs font-black uppercase tracking-wider hover:bg-brand-pink/80 transition-colors"
        >
          <Plus size={14} /> Novo cupom
        </Link>
      </div>

      <div className="border-2 border-white/10 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-white/10">
              {["Código", "Desconto", "Tipo", "Validade", "Usos", "Status", ""].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left font-poppins text-[10px] font-bold uppercase tracking-widest text-gray-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center font-inter text-sm text-gray-500">
                  Nenhum cupom cadastrado
                </td>
              </tr>
            )}
            {coupons.map((c) => (
              <tr key={c.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-white">{c.code}</span>
                    {!c.active && (
                      <span className="text-[9px] font-poppins font-black uppercase bg-red-900/50 text-red-400 border border-red-800 px-1.5 py-0.5">
                        Inativo
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => copyCode(c.code)}
                      className="text-gray-600 hover:text-brand-blue transition-colors"
                    >
                      <Copy size={11} />
                    </button>
                  </div>
                  {c.description && (
                    <p className="font-inter text-[11px] text-gray-500 mt-0.5">{c.description}</p>
                  )}
                </td>
                <td className="px-4 py-3 font-poppins font-bold text-sm text-brand-pink">
                  {formatDiscount(c)}
                  {c.max_discount_cents && (
                    <p className="font-inter text-[10px] text-gray-500 font-normal">
                      teto {formatBRL(c.max_discount_cents)}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 font-inter text-xs text-gray-400">
                  {c.discount_type === "percentage" ? "Percentual" : "Valor fixo"}
                  {c.applies_to !== "all" && (
                    <p className="text-[10px] text-yellow-500 mt-0.5">
                      {c.applies_to === "products" ? "Produtos específicos" : "Categorias específicas"}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 font-inter text-xs text-gray-400">
                  {formatValidity(c)}
                  {c.min_order_cents > 0 && (
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Mín. {formatBRL(c.min_order_cents)}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-300">
                  {formatUsage(c)}
                  {c.first_purchase_only && (
                    <p className="font-inter text-[10px] text-yellow-500 mt-0.5">1ª compra</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleActive(c.id, c.active)}
                    className={`transition-colors ${c.active ? "text-green-400 hover:text-red-400" : "text-gray-600 hover:text-green-400"}`}
                    title={c.active ? "Desativar" : "Ativar"}
                  >
                    {c.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/coupons/${c.id}/edit`}
                    className="text-gray-500 hover:text-brand-blue transition-colors"
                  >
                    <Pencil size={14} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
