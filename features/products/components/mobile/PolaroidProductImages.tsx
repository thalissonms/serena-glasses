// PolaroidProductImage.tsx
"use client";

import { m, AnimatePresence } from "framer-motion";
import Image from "next/image";
import clsx from "clsx";
import { Product } from "../../types";
import { usePolaroidCarousel } from "../../hooks/usePolaroidCarousel";
import { Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cva } from "class-variance-authority";
import { ProductBadgeY2K } from "../ProductBadge";

type Props = {
  product: Product;
  index: number;
  size: "feed" | "grid";
  discountPercentage: (price: number, compareAtPrice: number) => number;
};

const photoWrapperStyles = cva("block", {
  variants: {
    size: { feed: "", grid: "px-2 pt-2" },
  },
});

export function PolaroidProductImage({
  product,
  index,
  size,
  discountPercentage,
}: Props) {
  const { t } = useTranslation("products");
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
    <div aria-label={product.name} className={photoWrapperStyles({ size })}>
      <div
        ref={imageContainerRef}
        className={clsx(
          "relative aspect-square",
          isZooming ? "overflow-visible z-50" : "overflow-hidden",
        )}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleDoubleTap}
      >
        <AnimatePresence>
          {wishlistBurst && (
            <m.div
              key="heart-burst"
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
              initial={{ opacity: 1, scale: 0.4 }}
              animate={{ opacity: 0, scale: 1.6 }}
              exit={{}}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              <Heart
                size={72}
                className="fill-brand-pink text-brand-pink drop-shadow-[0_0_12px] shadow-brand-pink"
                strokeWidth={0}
              />
            </m.div>
          )}
        </AnimatePresence>
        <m.div
          className="absolute inset-0"
          animate={{ scale: zoomScale }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <m.div
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
                  className={clsx(
                    "object-cover",
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
            </m.div>
          </AnimatePresence>
        </m.div>
        <div className="absolute top-2 right-2 z-10 flex gap-1.5">
          {product.isNew && (
            <ProductBadgeY2K variant="new">
              {t("card.newBadge")}
            </ProductBadgeY2K>
          )}
          {product.isOutlet && (
            <ProductBadgeY2K variant="outlet">
              {t("card.outletBadge")}
            </ProductBadgeY2K>
          )}
          {product.isOnSale && product.compareAtPrice && (
            <ProductBadgeY2K variant="sale">
              -
              {discountPercentage(
                product.price,
                product.compareAtPrice,
              )}
              %
            </ProductBadgeY2K>
          )}
        </div>
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
  );
}
