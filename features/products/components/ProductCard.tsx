"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Product } from "@features/products/types/product.types";
import {
  formatPrice,
  discountPercentage,
} from "@features/products/utils/formatPrice";
import { FRAME_SHAPE_LABELS } from "@features/products/config/product.config";
import { WishlistButton } from "@features/wishlist/components/WishlistButton";
import clsx from "clsx";

export interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { t } = useTranslation("products");
  const primaryImage =
    product.images.find((img) => img.isPrimary) ?? product.images[0];
  const uniqueColors = product.variants.filter(
    (v, i, arr) => arr.findIndex((x) => x.color.slug === v.color.slug) === i,
  );

  return (
    <Link href={product.inStock ? `/products/${product.slug}` : "#"}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration: 0.5,
          delay: index * 0.1,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="group cursor-pointer"
      >
        <div
          className={clsx(
            "relative bg-white dark:bg-[#1a1a1a] border-2 border-black dark:border-brand-pink-light shadow-brand-black-dark dark:shadow-brand-blue",
            !product.inStock
              ? "cursor-not-allowed opacity-70 shadow-[2px_2px_0px]"
              : "hover:shadow-brand-pink transition-all duration-300 hover:-translate-y-1 shadow-[4px_4px_0px]",
          )}
        >
          {/* Badges */}
          <div className="absolute top-2 left-2 z-10 flex gap-1.5">
            {product.isNew && (
              <span
                className={clsx(
                  "flex justify-center bg-brand-pink text-white text-[10px] sm:text-xs font-bold font-poppins uppercase px-2 py-0.5 border border-black shadow-[2px_2px_0px] shadow-brand-black-dark dark:shadow-brand-blue",
                )}
              >
                {t("card.newBadge")}
              </span>
            )}
            {product.isOnSale && product.compareAtPrice && (
              <span className="bg-black text-white text-[10px] sm:text-xs font-bold font-poppins px-2 py-0.5 border border-brand-pink shadow-[2px_2px_0px_#FF00B6]">
                -{discountPercentage(product.price, product.compareAtPrice)}%
              </span>
            )}
            {product.isOutlet && (
              <span className="bg-brand-blue text-black text-[10px] sm:text-xs font-bold font-poppins uppercase px-2 py-0.5 border border-black dark:border-brand-pink-light shadow-[2px_2px_0px] shadow-brand-black-dark dark:shadow-brand-pink-light">
                {t("card.outletBadge")}
              </span>
            )}
          </div>
            {/* Wishlist button */}
            <div className="w-full absolute flex justify-end px-2 py-1 z-10">
              <WishlistButton
                productId={product.id}
                size={16}
                className="p-1.5 bg-white/80 dark:bg-brand-pink-dark border border-black hover:bg-brand-pink-light dark:hover:bg-brand-blue hover:text-white transition-colors cursor-pointer"
              />
            </div>

          {/* Image area */}
          <div className="relative aspect-square bg-pink-50/60 dark:bg-[#0a0a0a] overflow-hidden border-b-2 border-black dark:border-brand-pink-light/60">
            {primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt}
                fill
                className={clsx(
                  "object-contain p-4 sm:p-6  transition-transform duration-500",
                  !product.inStock ? "grayscale" : "group-hover:scale-110",
                )}
                draggable={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-pink-200">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1}
                  className="w-12 h-12 opacity-40"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
            )}
            {!product.inStock && (
              <span className="absolute bottom-1 right-1 bg-red-600 text-white text-[10px] sm:text-xs font-bold font-poppins uppercase px-2 py-0.5 border border-black shadow-[2px_2px_0px] shadow-brand-black-dark dark:shadow-red-950">
                {t("card.soldOut")}
              </span>
            )}
          </div>

          {/* Product info */}
          <div className="relative min-h-56 p-3 sm:p-4">
            <p
              className={clsx(
                "text-[10px] sm:text-xs font-poppins font-semibold text-brand-pink uppercase tracking-wider mb-1",
                !product.inStock ? "text-gray-400" : "text-brand-pink",
              )}
            >
              {FRAME_SHAPE_LABELS[product.frameShape]}
            </p>

            <h3
              className={clsx(
                "font-poppins font-bold text-sm sm:text-base text-black dark:text-white leading-tight mb-1.5",
                !product.inStock
                  ? "opacity-70"
                  : "group-hover:text-brand-pink transition-colors duration-300",
              )}
            >
              {product.name}
            </h3>

            <p className="text-xs text-gray-500 dark:text-gray-400 font-inter leading-snug mb-2 line-clamp-1 hidden sm:block">
              {product.shortDescription}
            </p>

            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={
                      i < Math.round(product.rating.average)
                        ? "dark:fill-brand-blue fill-brand-pink text-brand-pink dark:text-brand-blue"
                        : "fill-gray-200 dark:fill-gray-700 text-gray-200 dark:text-gray-700"
                    }
                  />
                ))}
              </div>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-inter">
                ({product.rating.count})
              </span>
            </div>

            <div className="flex items-center gap-1.5 mb-3">
              {uniqueColors.map((variant) => (
                <div
                  key={variant.color.slug}
                  className="w-3.5 h-3.5 rounded-full border border-black/20 dark:border-white/20 shadow-sm"
                  style={{ backgroundColor: variant.color.hex }}
                  title={variant.color.name}
                />
              ))}
            </div>

            <div className="absolute bottom-4 right-5 flex items-baseline gap-2">
              <span className="font-family-jocham text-xl sm:text-2xl text-brand-pink leading-none">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-xs text-gray-400 dark:text-gray-500 font-inter line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
