"use client";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import type { Product } from "@features/products/types/product.types";
import { useAddToCart } from "@features/cart/hooks/useAddToCart";
import { useEffect, useState } from "react";

interface ProductActionsProps {
  product: Product;
  selectedColorIndex: number;
}

export default function ProductActions({
  product,
  selectedColorIndex,
}: ProductActionsProps) {
  const { t } = useTranslation("products");
  const { inStock, added, addToCart, buyNow } = useAddToCart(
    product,
    selectedColorIndex,
  );



  return (
    <div className="flex flex-col gap-4 mt-4">
      <button
        type="button"
        onClick={addToCart}
        disabled={!inStock}
        aria-label={t("page.addToCartAria", { name: product.name })}
        aria-live="polite"
        className={clsx(
          "w-full py-5 text-sm font-black uppercase tracking-widest border-4 border-brand-black dark:border-brand-pink-light transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-brand-black",
          added
            ? "bg-brand-success dark:border-brand-success text-brand-black shadow-[4px_4px_0] translate-y-0.5"
            : "bg-brand-pink dark:bg-brand-pink text-brand-white dark:text-brand-white dark:hover:text-brand-pink-light shadow-[6px_6px_0] dark:shadow-brand-blue hover:translate-y-0.5 hover:shadow-[4px_4px_0] active:translate-y-1",
        )}
      >
        {added ? t("page.added") : t("page.addToCart")}
      </button>
      <button
        type="button"
        onClick={buyNow}
        disabled={!inStock}
        aria-label={t("page.buyNowAria", { name: product.name })}
        className="w-full py-4 text-sm font-black uppercase tracking-widest border-4 border-brand-black dark:border-brand-pink-light bg-brand-black dark:bg-brand-dark-surface-2 text-brand-white shadow-[6px_6px_0] shadow-brand-pink hover:translate-y-0.5 hover:shadow-[4px_4px_0] transition-all active:translate-y-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-brand-black/30 disabled:dark:bg-brand-white/30 disabled:text-brand-white/50 disabled:shadow-[2px_2px_0px] disabled:hover:translate-y-0 disabled:hover:shadow-[2px_2px_0px]"
      >
        {t("page.buyNow")}
      </button>
    </div>
  );
}
