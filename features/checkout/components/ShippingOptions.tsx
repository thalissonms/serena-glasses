"use client";
import { Truck, Loader2, AlertCircle } from "lucide-react";
import { formatPrice } from "@features/products/utils/formatPrice";
import { useCartStore } from "@features/cart/store/cart.store";
import type { ShippingQuoteOption } from "@shared/lib/melhor-envio/types";

interface ShippingOptionsProps {
  options: ShippingQuoteOption[];
  loading: boolean;
  error: string | null;
}

export function ShippingOptions({ options, loading, error }: ShippingOptionsProps) {
  const selectedShipping = useCartStore((s) => s.selectedShipping);
  const setSelectedShipping = useCartStore((s) => s.setSelectedShipping);

  if (loading) {
    return (
      <div className="flex items-center gap-2 mt-4 text-gray-500 dark:text-gray-400 text-xs font-poppins">
        <Loader2 size={13} className="animate-spin shrink-0" />
        Calculando opções de frete...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 mt-4 text-red-500 text-xs font-poppins border-2 border-red-300 dark:border-red-700 px-3 py-2">
        <AlertCircle size={13} className="shrink-0" />
        {error}
      </div>
    );
  }

  if (options.length === 0) return null;

  return (
    <div className="mt-4 flex flex-col gap-2 sm:col-span-2">
      <p className="font-poppins text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
        Opções de envio
      </p>
      {options.map((opt) => {
        const selected = selectedShipping?.id === opt.id;
        return (
          <label
            key={opt.id}
            className={`flex items-center gap-3 p-3 border-2 cursor-pointer transition-colors ${
              selected
                ? "border-brand-pink bg-pink-50 dark:bg-brand-pink/10"
                : "border-black dark:border-gray-600 hover:border-brand-pink dark:hover:border-brand-pink"
            }`}
          >
            <input
              type="radio"
              name="shipping-option"
              checked={selected}
              onChange={() => setSelectedShipping(opt)}
              className="sr-only"
            />
            <Truck size={15} className={`shrink-0 ${selected ? "text-brand-pink" : "text-gray-400"}`} />
            <div className="flex-1 min-w-0">
              <p className="font-poppins font-bold text-xs">{opt.name}</p>
              <p className="font-inter text-[11px] text-gray-500 dark:text-gray-400">{opt.company_name}</p>
              <p className="font-inter text-[10px] text-gray-400 dark:text-gray-500">
                {opt.delivery_days <= 1 ? "1 dia útil" : `${opt.delivery_days} dias úteis`}
              </p>
            </div>
            <div className="text-right shrink-0">
              {opt.price === 0 ? (
                <div>
                  {opt.original_price > 0 && (
                    <p className="font-inter text-[11px] line-through text-gray-400 dark:text-gray-500">
                      {formatPrice(opt.original_price)}
                    </p>
                  )}
                  <p className="font-poppins font-black text-xs text-green-600 dark:text-green-400">Grátis</p>
                </div>
              ) : (
                <p className="font-poppins font-bold text-xs">{formatPrice(opt.price)}</p>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
}
