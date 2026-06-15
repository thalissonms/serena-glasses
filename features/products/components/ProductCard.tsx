"use client";

import { SmartLink } from "@shared/components/SmartLink";
import Image from "next/image";
import { m } from "framer-motion";
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Product } from "@features/products/types/product.types";
import {
  formatPrice,
  discountPercentage,
  formatInstallment,
} from "@features/products/utils/formatPrice";
import { getPrimaryTag } from "@features/products/utils/getPrimaryTag";
import { WishlistButton } from "@features/wishlist/components/WishlistButton";
import clsx from "clsx";
import ProductBadge from "./ProductBadge";

// ─── ProductCard ─────────────────────────────────────────────────────────────

export interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { t, i18n } = useTranslation("products");
  const primaryImage =
    product.images.find((img) => img.isPrimary) ?? product.images[0];
  const uniqueColors = product.variants.filter(
    (v, i, arr) => arr.findIndex((x) => x.color.slug === v.color.slug) === i,
  );
  const avgRating = Math.round(product.rating.average);

  return (
    <SmartLink
      href={product.inStock ? `/products/${product.slug}` : "#"}
      aria-disabled={!product.inStock || undefined}
      tabIndex={!product.inStock ? -1 : undefined}
      onClick={!product.inStock ? (e) => e.preventDefault() : undefined}
    >
      <m.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration: 0.5,
          delay: index * 0.1,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className={clsx(
          "group cursor-pointer z-10",
          !product.inStock && "opacity-75 cursor-not-allowed",
        )}
      >
        <div
          className={clsx(
            "relative border-4 border-brand-black bg-brand-light-surface-1 dark:bg-brand-dark-surface-0 transition-all duration-300",
            !product.inStock
              ? "shadow-[2px_2px_0px] shadow-brand-black/60"
              : "shadow-[4px_4px_0px] shadow-brand-pink hover:shadow-brand-purple hover:-translate-y-1",
          )}
        >
          <div className="relative aspect-square bg-brand-light-surface-2 dark:bg-brand-dark-surface-1 overflow-hidden border-b-4 border-brand-black">

            <div className="absolute top-2 left-2 z-10 flex gap-1.5 flex-wrap max-w-[72%]">
              {product.isNew && (
                <ProductBadge variant="new">{t("card.newBadge")}</ProductBadge>
              )}
              {product.isOnSale && product.compareAtPrice && (
                <ProductBadge variant="sale">
                  -{discountPercentage(product.price, product.compareAtPrice)}%
                </ProductBadge>
              )}
              {product.isOutlet && (
                <ProductBadge variant="outlet">{t("card.outletBadge")}</ProductBadge>
              )}
            </div>

            <div className="w-full absolute flex justify-end px-2 py-1 z-10">
              <WishlistButton
                productId={product.id}
                size={16}
                className="p-1.5 bg-white dark:bg-brand-dark-surface-1 border border-brand-black hover:bg-brand-pink-light dark:hover:bg-brand-dark-surface-2 hover:text-white transition-colors cursor-pointer"
              />
            </div>

            {primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={clsx(
                  "object-contain p-4 sm:p-6 transition-transform duration-500",
                  !product.inStock ? "grayscale opacity-50" : "group-hover:scale-105",
                )}
                draggable={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-20">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1}
                  className="w-12 h-12"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
            )}

            {!product.inStock && (
              <div className="absolute bottom-2 right-2 z-10">
                <ProductBadge variant="soldOut">{t("card.soldOut")}</ProductBadge>
              </div>
            )}
          </div>

          <div className="relative p-3 sm:p-4 min-h-56">
            <p
              className={clsx(
                "text-[10px] sm:text-xs font-poppins font-black uppercase mb-1",
                product.inStock ? "text-brand-pink" : "text-gray-400",
              )}
              style={{ letterSpacing: "0.17em" }}
            >
              {getPrimaryTag(product, i18n.language)}
            </p>

            <h3
              className={clsx(
                "font-poppins font-bold text-sm sm:text-base leading-tight mb-1.5 transition-colors duration-300",
                product.inStock
                  ? "text-brand-black dark:text-white group-hover:text-brand-pink dark:group-hover:text-brand-pink-light"
                  : "text-gray-400 dark:text-gray-600",
              )}
            >
              {product.name}
            </h3>

            <p className="text-xs text-gray-500 dark:text-gray-500 font-inter leading-snug mb-2 line-clamp-1 hidden sm:block">
              {product.shortDescription}
            </p>

            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={11}
                    className={
                      i < avgRating
                        ? "fill-brand-pink text-brand-pink"
                        : "fill-gray-200 dark:fill-gray-700 text-gray-200 dark:text-gray-700"
                    }
                  />
                ))}
              </div>
              <span className="text-[10px] text-gray-400 dark:text-gray-600 font-inter">
                ({product.rating.count})
              </span>
            </div>

            <div className="flex items-center gap-1.5 mb-3" role="list">
              {uniqueColors.map((variant) => (
                <div
                  key={variant.color.slug}
                  role="img"
                  aria-label={variant.color.name}
                  className="w-3.5 h-3.5 rounded-full border border-brand-black/20 dark:border-white/20 shadow-sm"
                  style={{ backgroundColor: variant.color.hex }}
                />
              ))}
            </div>

            <div className="absolute bottom-4 right-4 flex flex-col items-end gap-0.5">
              <div className="flex items-baseline gap-1.5">
                <span className="font-family-jocham text-xl sm:text-2xl text-brand-pink leading-none">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-inter line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
              {formatInstallment(product.price, product.maxInstallments) && (
                <span className="font-inter text-[10px] text-gray-500 dark:text-gray-400 leading-none">
                  {formatInstallment(product.price, product.maxInstallments)}
                </span>
              )}
            </div>
          </div>
        </div>
      </m.div>
    </SmartLink>
  );
}