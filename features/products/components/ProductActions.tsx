"use client";
import clsx from "clsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Product } from "@features/products/types/product.types";
import { useCartStore } from "@features/cart/store/cart.store";

interface ProductActionsProps {
  product: Product;
  selectedColorIndex: number;
}

export default function ProductActions({ product, selectedColorIndex }: ProductActionsProps) {
  const { t } = useTranslation("products");
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const uniqueColors = product.variants.filter(
    (v, i, arr) => arr.findIndex((x) => x.color.slug === v.color.slug) === i,
  );
  const activeVariant = uniqueColors[selectedColorIndex] ?? uniqueColors[0];
  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];
  const image = activeVariant?.images[0] ?? primaryImage?.url ?? "";

  function handleAddToCart() {
    if (!activeVariant) return;
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
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-col gap-3 mt-4">
      <button
        onClick={handleAddToCart}
        disabled={!activeVariant?.inStock}
        className={clsx(
          "w-full py-5 text-sm font-black uppercase tracking-widest border-4 border-black dark:border-brand-pink transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
          added
            ? "bg-green-400 text-black shadow-[4px_4px_0_#000] translate-y-0.5"
            : "bg-brand-pink text-white shadow-[6px_6px_0_#000] hover:translate-y-0.5 hover:shadow-[4px_4px_0_#000] active:translate-y-1",
        )}
      >
        {added ? t("page.added") : t("page.addToCart")}
      </button>
      <button className="w-full py-4 text-sm font-black uppercase tracking-widest border-4 border-black dark:border-brand-pink bg-black dark:bg-[#1a1a1a] text-white shadow-[6px_6px_0_#FF00B6] hover:translate-y-0.5 hover:shadow-[4px_4px_0_#FF00B6] transition-all active:translate-y-1 cursor-pointer">
        {t("page.buyNow")}
      </button>
    </div>
  );
}
