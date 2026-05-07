"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Ban, Heart, MessageCircle, Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Product } from "@features/products/types/product.types";
import {
  formatPrice,
  discountPercentage,
} from "@features/products/utils/formatPrice";
import { FRAME_SHAPE_LABELS } from "@features/products/config/product.config";
import { WishlistButton } from "@features/wishlist/components/WishlistButton";
import { useReviewsOverlay } from "@features/products/hooks/useReviewsOverlay";
import { usePolaroidCarousel } from "@features/products/hooks/usePolaroidCarousel";
import { shareProduct } from "@features/products/utils/polaroidCard.utils";
import clsx from "clsx";

interface PolaroidProductCardProps {
  product: Product;
  index?: number;
}

export function PolaroidProductCard({
  product,
  index = 0,
}: PolaroidProductCardProps) {
  const { t } = useTranslation("products");
  const openReviews = useReviewsOverlay((s) => s.openFor);

  const {
    sortedImages,
    currentIndex,
    currentImage,
    swipeDirection,
    zoomScale,
    isZooming,
    wishlistBurst,
    imageContainerRef,
    handleTouchStart,
    handleTouchEnd,
    handleDoubleTap,
  } = usePolaroidCarousel(product.images, product.id);

  return (
    <motion.article
      aria-labelledby={`feed-product-${product.id}-name`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.05, 0.3),
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={clsx(
        "w-full bg-white border-2 border-black dark:border-brand-pink-light dark:bg-brand-pink-dark",
        "shadow-[2px_4px_0px] shadow-black dark:shadow-brand-blue",
        !product.inStock && "opacity-70",
      )}
    >
      {/* IG Header */}
      {/* <div className="flex items-center gap-2.5 px-3 py-2.5">
        <div className="w-8 h-8 rounded-full bg-brand-pink flex items-center justify-center shrink-0 border-2 border-black/10">
          <span className="font-jocham text-white text-sm leading-none">S</span>
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <span className="font-poppins font-bold text-[16px] text-black dark:text-white leading-none">{product.name}</span>
          <span className="font-poppins text-[12px] text-gray-400 dark:text-gray-300 leading-none mt-0.5">
            {FRAME_SHAPE_LABELS[product.frameShape]}
          </span>
        </div>
        <button
          aria-label="Mais opções"
          className="p-1.5 text-gray-400 hover:text-black transition-colors cursor-pointer"
        >
          <span className="text-base font-bold tracking-widest leading-none">···</span>
        </button>
      </div> */}

      {/* Photo + Carousel */}
      <div aria-label={product.name} className="block px-3 pt-3">
        <div
          ref={imageContainerRef}
          className={clsx(
            "relative aspect-square bg-brand-black dark:bg-brand-black-dark",
            isZooming ? "overflow-visible z-50" : "overflow-hidden",
          )}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={handleDoubleTap}
        >
          {/* Double-tap wishlist burst */}
          <AnimatePresence>
            {wishlistBurst && (
              <motion.div
                key="heart-burst"
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                initial={{ opacity: 1, scale: 0.4 }}
                animate={{ opacity: 0, scale: 1.6 }}
                exit={{}}
                transition={{ duration: 0.55, ease: "easeOut" }}
              >
                <Heart size={72} className="fill-brand-pink text-brand-pink drop-shadow-[0_0_12px_#FF00B6]" strokeWidth={0} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Zoom wrapper — escala a imagem sem afetar badges/dots */}
          <motion.div
            className="absolute inset-0"
            animate={{ scale: zoomScale }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: swipeDirection * 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: swipeDirection * -80 }}
                transition={{ duration: 0.18, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                {currentImage ? (
                  <Image
                    src={currentImage.url}
                    alt={currentImage.alt}
                    fill
                    sizes="(max-width: 768px) 92vw, 420px"
                    className={clsx(
                      "object-contain p-4",
                      !product.inStock && "grayscale",
                    )}
                    priority={index < 2}
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
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Y2K Badges — fora do wrapper de zoom para não escalar com a imagem */}
          <div className="absolute top-2 left-2 z-10 flex gap-1.5">
            {product.isNew && (
              <span className="bg-brand-pink text-white text-[10px] font-bold font-poppins uppercase px-2 py-0.5 border border-black shadow-[2px_2px_0px] shadow-brand-blue">
                {t("card.newBadge")}
              </span>
            )}
            {product.isOnSale && product.compareAtPrice && (
              <span className="bg-black text-white text-[10px] font-bold font-poppins px-2 py-0.5 border border-brand-pink shadow-[2px_2px_0px_#FF00B6] rotate-1">
                -{discountPercentage(product.price, product.compareAtPrice)}%
              </span>
            )}
            {product.isOutlet && (
              <span className="bg-brand-blue text-black text-[10px] font-bold font-poppins uppercase px-2 py-0.5 border border-black shadow-[2px_2px_0px] shadow-brand-pink-light">
                {t("card.outletBadge")}
              </span>
            )}
          </div>

          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <span className="bg-red-600/90 text-white text-sm font-bold font-poppins uppercase px-4 py-1.5 border-2 border-white shadow-lg -rotate-12 tracking-widest">
                {t("feed.soldOut")}
              </span>
            </div>
          )}

          {/* Dots do carousel */}
          {sortedImages.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 z-10 flex justify-center gap-1.5 pointer-events-none">
              {sortedImages.map((_, i) => (
                <div
                  key={i}
                  className={clsx(
                    "rounded-full transition-all duration-200",
                    i === currentIndex
                      ? "w-2 h-2 bg-white"
                      : "w-1.5 h-1.5 bg-white/50",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between mx-3 mt-4">
        <div className="flex flex-col">
          <span
            id={`feed-product-${product.id}-name`}
            className="font-black text-brand-pink-dark dark:text-brand-white text-shadow-[1px_2px_0] text-shadow-brand-pink font-family-poppins text-2xl"
          >
            {product.name}
          </span>
          <span>
            {FRAME_SHAPE_LABELS[product.frameShape] && (
              <span className="text-brand-pink dark:text-brand-blue font-normal">
                {FRAME_SHAPE_LABELS[product.frameShape]}
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5">
            <WishlistButton
              productId={product.id}
              size={28}
              className="text-black dark:text-brand-white hover:text-brand-pink transition-colors cursor-pointer"
            />
          </div>
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
        </div>
        {/* <button
          aria-label={`${t("feed.actionSave")} ${product.name}`}
          className="ml-auto text-black hover:text-brand-pink transition-colors cursor-pointer"
        >
          <Bookmark size={24} strokeWidth={1.8} />
        </button> */}
      </div>

      {/* Description */}
      <div className="px-3 mt-2 text-lg">
        {product.shortDescription && (
          <span className="text-gray-500 dark:text-gray-300 font-normal">
            {product.shortDescription}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="px-3 pb-4">
        {/* Rating as "likes" */}
        <div className="flex items-center gap-1.5 mb-1.5">
          {/* <div className="flex">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                size={13}
                className={
                  i < Math.round(product.rating.average)
                    ? "fill-brand-pink text-brand-pink"
                    : "fill-gray-200 text-gray-200"
                }
              />
            ))}
          </div> */}
          {/* <span className="font-poppins font-bold text-sm text-black">
            {product.rating.average.toFixed(1)}
          </span>
          <span className="text-xs text-gray-400 font-inter">
            ({product.rating.count})
          </span> */}
        </div>

        {/* Name + short desc */}
        {/* <p className="font-poppins text-sm text-black leading-snug mb-0.5">
          <span id={`feed-product-${product.id}-name`} className="font-bold">
            {product.name}
          </span>
          {product.shortDescription && (
            <span className="text-gray-500 ml-1 font-normal">
              {product.shortDescription}
            </span>
          )}
        </p> */}

        {/* Reviews trigger */}
        {/* {product.rating.count > 0 && (
          <button
            onClick={() => openReviews(product.id, product.name)}
            className="text-xs text-gray-400 hover:text-brand-pink transition-colors cursor-pointer font-inter mt-0.5 block"
          >
            {t("feed.viewReviews", { count: product.rating.count })}
          </button>
        )} */}

        {/* Price */}
        <div className="flex max-h-16 justify-between items-baseline gap-2 mt-2">
          <div className="h-full flex flex-col items-end justify-center">
            <span className="font-family-jocham text-2xl text-brand-pink leading-none">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-gray-400 font-inter line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          <Link
            href={product.inStock ? `/products/${product.slug}` : "#"}
            className="w-full flex pl-6 pr-1 items-center justify-end mt-2"
          >
            <button
              className={clsx(
                "w-full flex items-center justify-center",
                product.inStock
                  ? " bg-brand-pink dark:bg-brand-blue shadow-[4px_3px_0] border-2 dark:border-brand-pink-light shadow-brand-black-dark active:shadow-[2px_2px_0] transition-all duration-300 dark:shadow-brand-pink py-2  cursor-pointer"
                  : "bg-gray-300 opacity-40 dark:bg-gray-500 shadow-gray-500 dark:shadow-black py-2  cursor-not-allowed",
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
                {product.inStock ? t("feed.actionView") : t("feed.soldOut")}
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
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
