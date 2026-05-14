"use client";

import { SmartLink } from "@shared/components/SmartLink";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Ban, Heart, MessageCircle, Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cva } from "class-variance-authority";
import type { Product } from "@features/products/types/product.types";
import {
  formatPrice,
  discountPercentage,
} from "@features/products/utils/formatPrice";
import { getPrimaryTag } from "@features/products/utils/getPrimaryTag";
import { WishlistButton } from "@features/wishlist/components/WishlistButton";
import { useReviewsOverlay } from "@features/products/hooks/useReviewsOverlay";
import { usePolaroidCarousel } from "@features/products/hooks/usePolaroidCarousel";
import { shareProduct } from "@features/products/utils/polaroidCard.utils";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { PolaroidProductImage } from "./PolaroidProductImages";

type CardSize = "feed" | "grid";

const photoWrapperStyles = cva("block", {
  variants: {
    size: { feed: "px-3 pt-3", grid: "px-2 pt-2" },
  },
});

const actionBarStyles = cva("flex items-center justify-between", {
  variants: {
    size: { feed: "mx-3 mt-4", grid: " mx-2 mt-2" },
  },
});

const productNameStyles = cva(
  "font-black text-brand-pink-dark dark:text-brand-white text-shadow-[1px_2px_0] text-shadow-brand-pink font-family-poppins",
  {
    variants: {
      size: {
        feed: "text-2xl",
        grid: "text-xl h-full leading-tight",
      },
    },
  },
);

const priceStyles = cva("font-family-jocham text-brand-pink leading-none", {
  variants: {
    size: { feed: "text-2xl", grid: "text-base" },
  },
});
const descriptionStyles = cva("text-gray-500 dark:text-gray-300 font-normal", {
  variants: {
    size: { feed: "text-base", grid: "text-shadow-2xs" },
  },
});

const infoSectionStyles = cva("", {
  variants: {
    size: { feed: "px-3 pb-4", grid: "px-2 pb-3" },
  },
});

interface PolaroidProductCardProps {
  product: Product;
  index?: number;
  gridSize?: boolean;
}

export function PolaroidProductCard({
  product,
  index = 0,
  gridSize = true,
}: PolaroidProductCardProps) {
  const { t, i18n } = useTranslation("products");
  const openReviews = useReviewsOverlay((s) => s.openFor);
  const size: CardSize = gridSize ? "grid" : "feed";
  const router = useRouter();

  return (
    <motion.article
      aria-labelledby={`feed-product-${product.id}-name`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      onClick={() => {
        if (size === "grid") {
          if (window.innerWidth >= 768) {
            window.location.href = `/products/${product.slug}`;
          } else {
            router.push(`/products/${product.slug}`);
          }
        }
      }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.05, 0.3),
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={clsx(
        "w-full bg-white border-2 border-black dark:border-brand-pink-light dark:bg-brand-pink-dark",
        "shadow-[2px_4px_0px] shadow-black dark:shadow-brand-blue",
        !product.inStock && "opacity-70",
        size === "grid" && "h-full flex flex-col justify-between max-w-55",
      )}
    >
      <PolaroidProductImage
        product={product}
        index={index}
        size={size}
        discountPercentage={discountPercentage}
      />

      <div
        className={clsx(
          size === "grid" && "grid grid-rows-[auto_auto_3rem] gap-1 h-full",
        )}
      >
        <div className={actionBarStyles({ size })}>
          <div
            className={clsx(
              size === "feed"
                ? "flex flex-col min-w-0 flex-1"
                : "flex flex-col min-w-0 flex-1 items-start h-full",
            )}
          >
            <span
              id={`feed-product-${product.id}-name`}
              className={productNameStyles({ size })}
            >
              {product.name}
            </span>
            {size === "feed" && (
              <span className="text-brand-pink dark:text-brand-blue font-normal">
                {getPrimaryTag(product, i18n.language)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {size === "feed" && (
              <>
                <WishlistButton
                  productId={product.id}
                  size={28}
                  className="text-black dark:text-brand-white hover:text-brand-pink transition-colors cursor-pointer"
                />
                <button
                  aria-label={`${t("feed.actionComment")} ${product.name}`}
                  onClick={() => openReviews(product.id, product.name)}
                  className="text-black dark:text-brand-white hover:text-brand-pink transition-colors cursor-pointer"
                >
                  <MessageCircle size={28} strokeWidth={2.5} />
                </button>
                <button
                  aria-label={`${t("feed.actionShare")} ${product.name}`}
                  onClick={() => shareProduct(product.slug, product.name)}
                  className="text-black dark:text-brand-white hover:text-brand-pink transition-colors cursor-pointer -ml-1"
                >
                  <Share2 size={28} strokeWidth={2.5} />
                </button>
              </>
            )}
          </div>
        </div>

        <div
          className={clsx(
            size === "feed" ? "px-3 mt-2" : "px-2 mt-1 flex items-start h-full",
          )}
        >
          <p className={descriptionStyles({ size })}>
            {product.shortDescription}
          </p>
        </div>

        <div className={infoSectionStyles({ size })}>
          <div
            className={clsx(
              "flex justify-between gap-2",
              size === "feed" ? "items-center  mt-2" : "items-end h-full",
            )}
          >
            <div className="flex flex-col">
              <span className={priceStyles({ size })}>
                {formatPrice(product.price)}
              </span>
              {size === "feed" && product.compareAtPrice && (
                <span className="text-xs text-gray-400 font-inter line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            {size === "feed" ? (
              <SmartLink
                href={product.inStock ? `/products/${product.slug}` : "#"}
                className="w-full flex pl-6 pr-1 items-center justify-end mt-2"
              >
                <button
                  className={clsx(
                    "w-full flex items-center justify-center",
                    product.inStock
                      ? "bg-brand-pink dark:bg-brand-blue shadow-[4px_3px_0] border-2 dark:border-brand-pink-light shadow-brand-black-dark active:shadow-[2px_2px_0] transition-all duration-300 dark:shadow-brand-pink py-2 cursor-pointer"
                      : "bg-gray-300 opacity-40 dark:bg-gray-500 shadow-gray-500 dark:shadow-black py-2 cursor-not-allowed",
                  )}
                >
                  <span
                    className={clsx(
                      "font-family-poppins font-bold",
                      product.inStock
                        ? "text-white dark:text-brand-pink-dark"
                        : "text-gray-500 dark:text-gray-700",
                    )}
                  >
                    {product.inStock ? (
                      <ArrowRight
                        size={20}
                        strokeWidth={2}
                        className="inline-block ml-2"
                      />
                    ) : (
                      <Ban
                        size={18}
                        strokeWidth={2}
                        className="inline-block ml-2"
                      />
                    )}
                  </span>
                </button>
              </SmartLink>
            ) : (
              <WishlistButton
                productId={product.id}
                size={22}
                className="text-black dark:text-brand-white hover:text-brand-pink transition-colors cursor-pointer"
              />
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
