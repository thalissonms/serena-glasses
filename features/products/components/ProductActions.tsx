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
          "w-full py-5 text-sm font-black uppercase tracking-widest border-4 border-black dark:border-brand-pink-light transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-black",
          added
            ? "bg-green-400 dark:border-green-100 text-black shadow-[4px_4px_0] translate-y-0.5"
            : "bg-brand-pink dark:bg-brand-pink text-white dark:text-white dark:hover:text-brand-pink-light shadow-[6px_6px_0] dark:shadow-brand-blue hover:translate-y-0.5 hover:shadow-[4px_4px_0] active:translate-y-1",
        )}
      >
        {added ? t("page.added") : t("page.addToCart")}
      </button>
      <button
        type="button"
        onClick={buyNow}
        disabled={!inStock}
        aria-label={t("page.buyNowAria", { name: product.name })}
        className="w-full py-4 text-sm font-black uppercase tracking-widest border-4 border-black dark:border-brand-pink-light bg-black dark:bg-brand-black-dark text-white shadow-[6px_6px_0] shadow-brand-pink hover:translate-y-0.5 hover:shadow-[4px_4px_0] transition-all active:translate-y-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-zinc-400 disabled:dark:bg-zinc-600 disabled:text-zinc-200 disabled:shadow-[2px_2px_0px] disabled:hover:translate-y-0 disabled:hover:shadow-[2px_2px_0px]"
      >
        {t("page.buyNow")}
      </button>
    </div>
  );
}
