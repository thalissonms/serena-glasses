"use client";
import { useState } from "react";
import { X, Tag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@features/cart/store/cart.store";
import { formatPrice } from "@features/products/utils/formatPrice";

export default function CouponInput() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const items = useCartStore((s) => s.items);
  const appliedCoupon = useCartStore((s) => s.appliedCoupon);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);

  async function handleApply() {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    setLoading(true);
    try {
      const res = await fetch("/api/checkout/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: trimmed,
          items: items.map((i) => ({
            variantId: i.variantId,
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!data.ok) {
        toast.error(data.error ?? "Cupom inválido");
        return;
      }

      applyCoupon({
        coupon_id: data.coupon_id ?? "",
        code: data.code,
        discount_type: data.discount_type,
        discount_value: data.discount_value,
        discount_applied_cents: data.discount_applied_cents,
      });
      setCode("");
      toast.success(`Cupom ${data.code} aplicado!`);
    } catch {
      toast.error("Erro ao validar cupom");
    } finally {
      setLoading(false);
    }
  }

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between border-2 border-brand-pink bg-pink-50 dark:bg-brand-pink/10 px-3 py-2">
        <div className="flex items-center gap-2">
          <Tag size={13} className="text-brand-pink shrink-0" />
          <div>
            <span className="font-poppins font-black text-xs text-brand-pink uppercase tracking-wider">
              {appliedCoupon.code}
            </span>
            <p className="font-inter text-[11px] text-gray-500 dark:text-gray-400">
              -{formatPrice(appliedCoupon.discount_applied_cents)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={removeCoupon}
          className="text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors"
          aria-label="Remover cupom"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        onKeyDown={(e) => e.key === "Enter" && handleApply()}
        placeholder="Código do cupom"
        maxLength={40}
        className="flex-1 border-2 border-black dark:border-brand-pink bg-white dark:bg-[#0a0a0a] dark:text-white font-poppins text-xs font-semibold uppercase tracking-wider px-3 py-2 outline-none focus:border-brand-pink placeholder:normal-case placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-400 dark:placeholder:text-gray-500"
      />
      <button
        type="button"
        onClick={handleApply}
        disabled={loading || !code.trim()}
        className="border-2 border-black dark:border-brand-pink bg-black dark:bg-brand-pink text-white font-poppins text-xs font-black uppercase tracking-wider px-4 py-2 hover:bg-brand-pink hover:border-brand-pink dark:hover:bg-white dark:hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
      >
        {loading ? <Loader2 size={12} className="animate-spin" /> : null}
        Aplicar
      </button>
    </div>
  );
}
