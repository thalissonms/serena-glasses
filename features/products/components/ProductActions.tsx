"use client";
import clsx from "clsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Product } from "@features/products/types/product.types";
import { useCartStore } from "@features/cart/store/cart.store";
import { useRouter } from "next/navigation";

interface ProductActionsProps {
  product: Product;
  selectedColorIndex: number;
}

export default function ProductActions({ product, selectedColorIndex }: ProductActionsProps) {
  const { t } = useTranslation("products");
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const uniqueColors = product.variants.filter(
    (v, i, arr) => arr.findIndex((x) => x.color.slug === v.color.slug) === i,
  );
  const activeVariant = uniqueColors[selectedColorIndex] ?? uniqueColors[0];
  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];
  const image = activeVariant?.images[0] ?? primaryImage?.url ?? "";

  function handleAddToCart(add:boolean = true) {
    if (!activeVariant?.inStock) return;
    addItem({
      variantId: activeVariant.id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: activeVariant.price ?? product.price,
      compareAtPrice: activeVariant.compareAtPrice ?? product.compareAtPrice,
      quantity: 1,
      image,
      color: activeVariant.color,
    });
    if (add) setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }
  function handleBuyNow() {
    if (!activeVariant?.inStock) return;
    handleAddToCart(false);
    router.push("/cart");
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      <button
        onClick={() => handleAddToCart()}
        disabled={!activeVariant?.inStock}
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
        onClick={handleBuyNow}
        disabled={!activeVariant?.inStock}
        className="w-full py-4 text-sm font-black uppercase tracking-widest border-4 border-black dark:border-brand-pink-light bg-black dark:bg-brand-black-dark text-white shadow-[6px_6px_0] shadow-brand-pink hover:translate-y-0.5 hover:shadow-[4px_4px_0] transition-all active:translate-y-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-zinc-400 disabled:dark:bg-zinc-600 disabled:text-zinc-200 disabled:shadow-[2px_2px_0px] disabled:hover:translate-y-0 disabled:hover:shadow-[2px_2px_0px]"
      >
        {t("page.buyNow")}
      </button>
    </div>
  );
}
