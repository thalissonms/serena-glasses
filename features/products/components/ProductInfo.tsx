"use client";
import { useTranslation } from "react-i18next";
import { getPrimaryTag } from "@features/products/utils/getPrimaryTag";
import {
  formatPrice,
  discountPercentage,
  formatInstallment,
} from "@features/products/utils/formatPrice";
import { WishlistButton } from "@features/wishlist/components/WishlistButton";
import ProductColorSelect from "./ProductColorSelect";
import { ProductInfoProps } from "../types/product.types";

export default function ProductInfo({
  product,
  selectedColor,
  onColorChange,
}: ProductInfoProps) {
  const { i18n } = useTranslation();

  return (
    <div className="bg-brand-light-surface-2 dark:bg-brand-dark-surface-1 border-4 border-brand-black dark:border-brand-pink-light shadow-[6px_6px_0] shadow-brand-black dark:shadow-brand-blue py-4 px-6 flex flex-col">
      <div className="w-full flex flex-col md:flex-row-reverse md:justify-between md:items-start">
        <div className="flex items-center gap-2 mb-3 md:mb-0 md:-mt-2 md:-mr-2">
          <span className="w-fit h-fit inline-block text-xs font-bold tracking-[0.2em] uppercase text-brand-pink dark:text-brand-pink-light border-2 border-brand-pink dark:border-brand-pink-light rounded-full px-4 py-2 mt-2">
            {getPrimaryTag(product, i18n.language)}
          </span>
          <div className="flex items-center justify-center w-14 h-14">
            <WishlistButton
              productId={product.id}
              size={22}
              className="flex h-fit items-center text-brand-black dark:text-brand-pink hover:text-brand-pink transition-colors font-poppins text-xs font-bold uppercase cursor-pointer"
            />
          </div>
        </div>
        <div>
          <span className="text-3xl md:text-5xl font-poppins font-black uppercase leading-none text-brand-black dark:text-shadow-brand-pink text-shadow-[2px_4px_0] text-shadow-brand-pink dark:text-brand-white">
            {product.name}
          </span>
          <p className="text-sm text-brand-black/60 dark:text-brand-blue mt-2">
            {product.shortDescription}
          </p>
        </div>
      </div>

      <div className="flex items-baseline gap-3 mt-4">
        <span className="text-4xl md:text-5xl font-black text-brand-black dark:text-brand-white">
          {formatPrice(product.price)}
        </span>
        {product.compareAtPrice && (
          <>
            <span className="text-base text-brand-black/40 dark:text-brand-white/50 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
            <span className="bg-brand-pink text-brand-white text-xs font-bold px-3 py-1 rounded-full border-2 border-brand-black">
              -{discountPercentage(product.price, product.compareAtPrice)}%
            </span>
          </>
        )}
      </div>
      {formatInstallment(product.price, product.maxInstallments) && (
        <p className="font-inter text-sm text-brand-black/60 dark:text-brand-white/40 -mt-1">
          {formatInstallment(product.price, product.maxInstallments)}
        </p>
      )}

      <ProductColorSelect
        product={product}
        selectedColor={selectedColor}
        onColorChange={onColorChange}
      />
    </div>
  );
}
