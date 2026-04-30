"use client";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import type { Product } from "@features/products/types/product.types";
import { CATEGORY_LABELS } from "@features/products/config/product.config";
import {
  formatPrice,
  discountPercentage,
} from "@features/products/utils/formatPrice";
import { WishlistButton } from "@features/wishlist/components/WishlistButton";

interface ProductInfoProps {
  product: Product;
  selectedColor: number;
  onColorChange: (index: number) => void;
}

export default function ProductInfo({
  product,
  selectedColor,
  onColorChange,
}: ProductInfoProps) {
  const { t } = useTranslation("products");

  const uniqueColors = product.variants.filter(
    (v, i, arr) => arr.findIndex((x) => x.color.slug === v.color.slug) === i,
  );

  const activeColor = uniqueColors[selectedColor] ?? uniqueColors[0];

  return (
    <div className="bg-pink-100 dark:bg-[#1a1a1a] border-4 border-black dark:border-brand-pink shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#FF00B6] py-4 px-6 flex flex-col">
      <div className="w-full flex-row-reverse justify-between hidden md:flex">
        <div className="flex items-center gap-2">
          <span className="w-fit h-fit inline-block text-xs font-bold tracking-[0.2em] uppercase text-brand-pink border-2 border-brand-pink rounded-full px-4 py-2 mt-2">
            {CATEGORY_LABELS[product.category]}
          </span>
          <div className="flex justify-end w-14 h-14">
            <WishlistButton
              productId={product.id}
              size={22}
              className="flex items-center gap-2 px-4 py-2 hover:bg-brand-pink hover:text-white transition-colors font-poppins text-xs font-bold uppercase tracking-wider"
            />
          </div>
        </div>
        <div>
          <span
            className="text-5xl font-poppins font-black uppercase leading-none text-brand-black dark:text-white"
            style={{ textShadow: "2px 4px 0 #FF00B6" }}
          >
            {product.name}
          </span>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {product.shortDescription}
          </p>
        </div>
      </div>

      <div className="flex items-baseline gap-3 mt-4">
        <span className="text-5xl font-black text-black dark:text-white">
          {formatPrice(product.price)}
        </span>
        {product.compareAtPrice && (
          <>
            <span className="text-base text-gray-400 dark:text-gray-500 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
            <span className="bg-brand-pink text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-black">
              -{discountPercentage(product.price, product.compareAtPrice)}%
            </span>
          </>
        )}
      </div>

      <div className="mt-3">
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
          {t("page.colorLabel")}{" "}
          <span className="text-black dark:text-white font-bold">
            {activeColor?.color.name}
          </span>
        </p>
        <div className="flex gap-3">
          {uniqueColors.map((variant, i) => (
            <button
              key={variant.color.slug}
              onClick={() => onColorChange(i)}
              title={variant.color.name}
              style={{ backgroundColor: variant.color.hex }}
              className={clsx(
                "w-6 h-6 rounded-full transition-all",
                variant.color.hex === "#FFFFFF" && "border border-gray-200",
                selectedColor === i
                  ? "border-2 border-brand-yellow shadow-[2px_2px_0_#000] scale-110"
                  : "border-1 border-black hover:scale-110",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
