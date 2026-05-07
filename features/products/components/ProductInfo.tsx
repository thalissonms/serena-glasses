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
    <div className="bg-pink-100 dark:bg-brand-pink-dark border-4 border-black dark:border-brand-pink-light shadow-[6px_6px_0] shadow-black dark:shadow-brand-blue py-4 px-6 flex flex-col">
      <div className="w-full flex flex-col md:flex-row-reverse md:justify-between md:items-start">
        <div className="flex items-center gap-2 mb-3 md:mb-0 md:-mt-2 md:-mr-2">
          <span className="w-fit h-fit inline-block text-xs font-bold tracking-[0.2em] uppercase text-brand-pink dark:text-brand-pink-light border-2 border-brand-pink dark:border-brand-pink-light rounded-full px-4 py-2 mt-2">
            {CATEGORY_LABELS[product.category]}
          </span>
          <div className="flex items-center justify-center w-14 h-14">
            <WishlistButton
              productId={product.id}
              size={22}
              className="flex h-fit items-center text-black dark:text-brand-pink hover:text-brand-pink transition-colors font-poppins text-xs font-bold uppercase cursor-pointer"
            />
          </div>
        </div>
        <div>
          <span className="text-3xl md:text-5xl font-poppins font-black uppercase leading-none text-brand-black dark:text-shadow-brand-pink text-shadow-[2px_4px_0] text-shadow-brand-pink dark:text-white">
            {product.name}
          </span>
          <p className="text-sm text-gray-500 dark:text-brand-blue mt-2">
            {product.shortDescription}
          </p>
        </div>
      </div>

      <div className="flex items-baseline gap-3 mt-4">
        <span className="text-4xl md:text-5xl font-black text-black dark:text-white">
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
        <p className="text-sm font-semibold text-gray-600 dark:text-brand-blue mb-3">
          {t("page.colorLabel")}{" "}
          <span className="text-black dark:text-white font-bold">
            {activeColor?.color.name}
          </span>
        </p>
        <div className="flex gap-3">
          {uniqueColors.map(
            (variant, i) =>
              variant.inStock && (
                <button
                  key={variant.color.slug}
                  onClick={() => onColorChange(i)}
                  title={variant.color.name}
                  style={{ backgroundColor: variant.color.hex }}
                  className={clsx(
                    "w-6 h-6 rounded-full transition-all",
                    variant.color.hex === "#FFFFFF" && "border border-gray-200",
                    selectedColor === i
                      ? "border-2 border-brand-yellow shadow-[2px_2px_0] shadow-black scale-110"
                      : "border border-black hover:scale-110",
                  )}
                />
              ),
          )}
        </div>
      </div>
    </div>
  );
}
