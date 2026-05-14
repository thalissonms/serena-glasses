"use client";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { Check, MessageCircle, ShoppingCart } from "lucide-react";
import type { Product } from "@features/products/types/product.types";
import { useAddToCart } from "@features/cart/hooks/useAddToCart";
import { useReviewsOverlay } from "@features/products/hooks/useReviewsOverlay";

interface ProductActionsProps {
  product: Product;
  selectedColorIndex: number;
}

const ProductActionsMobile = ({
  product,
  selectedColorIndex,
}: ProductActionsProps) => {
  const { t } = useTranslation("products");
  const { inStock, added, addToCart, buyNow } = useAddToCart(
    product,
    selectedColorIndex,
  );
  const openReviews = useReviewsOverlay((s) => s.openFor);

  if (!inStock) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <span className="font-family-poppins font-bold text-brand-yellow text-shadow-[1.5px_1.5px_0px] text-shadow-brand-pink text-2xl uppercase tracking-wide">
          {t("feed.soldOut")}
        </span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[56px_56px_1fr] items-center justify-center h-full gap-2">
      <button
        type="button"
        onClick={addToCart}
        aria-label={t("page.addToCartAria", { name: product.name })}
        aria-live="polite"
        className={clsx(
          "w-full h-full font-bold shadow-brand-black dark:shadow-brand-blue border-2 border-brand-black dark:border-brand-pink-light disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-[2px_2px_0px]",
          added
            ? "bg-green-400 dark:border-green-100 text-black shadow-[4px_4px_0] translate-y-0.5"
            : "bg-brand-pink dark:bg-brand-pink text-white dark:text-white dark:hover:text-brand-pink-light shadow-[4px_4px_0] dark:shadow-brand-blue hover:translate-y-0.5 hover:shadow-[4px_4px_0] active:translate-y-1",
        )}
      >
        <span className="flex items-center justify-center gap-0 leading-4">
          {added ? (
            <Check size={26} strokeWidth={3} aria-hidden="true" />
          ) : (
            <ShoppingCart size={26} strokeWidth={2.5} aria-hidden="true" />
          )}
        </span>
      </button>
      <button
        type="button"
        aria-label={`${t("feed.actionComment")} ${product.name}`}
        onClick={() => openReviews(product.id, product.name)}
        className="w-full h-full flex items-center justify-center bg-brand-pink dark:bg-brand-pink-bg-dark p-2 shadow-[4px_4px_0px] shadow-brand-black dark:shadow-brand-blue border-2 border-brand-black dark:border-brand-pink-light text-white dark:text-brand-pink-light active:shadow-[0.5px_0.5px_0] transition-all duration-300 cursor-pointer mr-2"
      >
        <MessageCircle size={26} strokeWidth={2.5} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={buyNow}
        aria-label={t("page.buyNowAria", { name: product.name })}
        className="w-full h-full font-bold shadow-[4px_4px_0px] border-2 border-brand-pink dark:border-brand-pink-light bg-black dark:bg-brand-black-dark text-white hover:translate-y-0.5 hover:shadow-[2px_2px_0px] shadow-brand-black transition-all active:translate-y-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-[2px_2px_0px]"
      >
        <span className="flex items-center justify-center gap-2 px-2 leading-4">
          {t("page.buyNow")}
        </span>
      </button>
    </div>
  );
};

export default ProductActionsMobile;
