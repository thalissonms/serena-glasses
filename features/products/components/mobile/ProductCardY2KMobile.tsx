"use client";

import clsx from "clsx";
import { ProductBadgeY2K } from "../ProductBadge";
import { Check, Eye, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { CreditCardIcon, SparklesIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useAddToCart } from "@features/cart/hooks/useAddToCart";
import { useTranslation } from "react-i18next";
import {
  formatPrice,
  discountPercentage,
  formatInstallment,
} from "@features/products/utils/formatPrice";
import { getPrimaryTag } from "@features/products/utils/getPrimaryTag";
import type { Product } from "@features/products/types/product.types";
import { WishlistButtonY2K } from "@features/wishlist/components/WishlistButtonY2K";
import { Sublogo } from "@shared/components/layout/Logos/Sublogo";
import { SmartLink } from "@shared/components/SmartLink";

export interface ProductCardMobileProps {
  product: Product;
  index?: number;
}

export function ProductCardY2KMobile({ product }: ProductCardMobileProps) {
  const { t, i18n } = useTranslation("products");

  const firstInStock = product.variants.findIndex((v) => v.inStock);
  const [selectedColorIndex, setSelectedColorIndex] = useState(firstInStock);
  const { inStock, added, addToCart, buyNow } = useAddToCart(
    product,
    selectedColorIndex,
  );

  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];
  const uniqueColors = product.variants.filter(
    (v, i, arr) => arr.findIndex((x) => x.color.slug === v.color.slug) === i,
  );

  return (
    <div
      className={clsx(
        "relative flex h-full w-full flex-col rounded-md border-2 border-brand-black/75 bg-brand-light-surface-2 pb-3",
        "shadow-[3px_3px_0px] shadow-brand-purple",
        "dark:bg-brand-dark-surface-1 dark:shadow-brand-pink/90",
        !product.inStock && "opacity-85",
      )}
    >
      <div className="relative z-10 h-11 w-full p-0.75">
        <div className="relative isolate h-full w-full rounded-md border-2 border-brand-black/75 bg-brand-pink-light/60 dark:bg-brand-pink-light/90">
          <div className="absolute bottom-0 left-0 isolate h-[95%] w-[99%] rounded-e-md rounded-tl-md rounded-bl-sm bg-brand-pink/75 dark:bg-brand-pink/80">
            <div className="flex h-full items-center justify-between gap-0.5 px-px py-0.5">
              {(product.isNew ||
                product.isOutlet ||
                (product.isOnSale && product.compareAtPrice)) ? (
                <div className="ml-0.5 flex flex-wrap gap-px origin-left">
                  {product.isNew && (
                    <ProductBadgeY2K variant="new" size="mobile">
                      {t("card.newBadge")}
                    </ProductBadgeY2K>
                  )}
                  {product.isOutlet && (
                    <ProductBadgeY2K variant="outlet" size="mobile">
                      {t("card.outletBadge")}
                    </ProductBadgeY2K>
                  )}
                  {product.isOnSale && product.compareAtPrice && (
                    <ProductBadgeY2K variant="sale" size="mobile">
                      -
                      {discountPercentage(
                        product.price,
                        product.compareAtPrice,
                      )}
                      %
                    </ProductBadgeY2K>
                  )}
                </div>
              ) : (
                <div className="items-center ml-1 flex">
                  <Sublogo className="h-6 w-6 text-brand-black/80" />
                </div>
              )}
              <div className="origin-right mr-px mt-1">
                <WishlistButtonY2K productId={product.id} size="mobile" />
              </div>
            </div>
            <div className="absolute top-0 right-0 -z-1 h-[90%] w-[99%] rounded-bl-md bg-brand-white/30" />
          </div>
        </div>
      </div>

      <SmartLink
        href={`/products/${product.slug}`}
        className="relative z-0 -mt-4 aspect-square w-full items-center overflow-hidden block"
      >
        <div className="absolute top-6 right-1.5 z-10 flex gap-0.5 rounded-full bg-brand-pink/20 px-1 py-0.5 backdrop-blur-sm">
          {product.images.slice(0, 4).map((_, i) => (
            <div
              key={i}
              className={clsx(
                "relative h-2 w-2 rounded-sm",
                i === 0 ? "bg-brand-pink" : "bg-brand-black/25",
              )}
            >
              <div
                className={clsx(
                  "absolute top-0 left-0 h-1.5 w-1.5 rounded-sm",
                  i === 0 ? "bg-brand-white/30" : "bg-brand-white/20",
                )}
              />
            </div>
          ))}
        </div>

        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || product.name}
            fill
            sizes="(max-width: 640px) 50vw, 33vw"
            className={clsx(
              "absolute object-cover transition-transform duration-500",
              !product.inStock ? "opacity-50 grayscale" : "group-active:scale-105",
            )}
            draggable={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center opacity-20">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="h-8 w-8">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
      </SmartLink>

      <div className="z-10 -mt-7.5 w-full">
        <div className="w-full px-2">
          <div className="grid *:[grid-area:1/1]">
            <h2 className="font-family-shrikhand text-[18px] leading-5 tracking-wide text-brand-pink text-shadow-[1.5px_1.5px_0px] text-shadow-brand-dark-surface-1 dark:text-white">
              {product.name}
            </h2>
            <h2 className="font-family-shrikhand text-[18px] leading-5 tracking-wide text-brand-pink-light dark:text-brand-pink/25">
              {product.name}
            </h2>
            <h2 className="font-family-shrikhand text-[18px] leading-5 tracking-wide text-transparent [-webkit-text-stroke:2px_rgba(45,45,45,0.25)] [text-stroke:2px_rgba(45,45,45,0.25)]">
              {product.name}
            </h2>
            <h2 className="font-family-shrikhand text-[18px] leading-5 tracking-wide text-transparent [-webkit-text-stroke:1px_rgba(255,0,182,1)] [text-stroke:1px_rgba(255,0,182,1)] dark:[-webkit-text-stroke:1px_rgba(155,0,255,0.75)] dark:[text-stroke:1px_rgba(155,0,255,0.75)]">
              {product.name}
            </h2>
          </div>
        </div>
        <div className="flex w-full justify-between px-2 mt-0.5">
          <div className="flex items-center">
            <span>
              <SparklesIcon className="h-3 w-3 text-brand-pink dark:text-brand-pink-light" />
            </span>
            <h4 className="ml-1 font-mono text-xs font-black tracking-wider text-brand-purple text-shadow-[1px_1px_0px] text-shadow-black/75 dark:text-brand-blue/80">
              {getPrimaryTag(product, i18n.language).toUpperCase()}
            </h4>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="mt-1.5 mb-3 min-h-8 w-full px-2.5">
          <p className="font-family-poppins text-xs leading-tight font-medium text-brand-black/60 italic dark:text-brand-white/75 line-clamp-2">
            {product.shortDescription}
          </p>
        </div>

        <div className="mt-auto flex flex-row-reverse justify-between gap-2 px-2.5 font-family-jocham">
          {/* Price */}
          <div className="flex flex-col items-end w-full">
            {product.compareAtPrice && (
              <span className="decoration-1 -mb-1 text-[11px] text-brand-black/80 line-through decoration-brand-danger/90 dark:text-brand-white/75">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            <div className="items-start flex">
              <span className="mt-0.5 text-[11px] text-brand-pink dark:text-brand-pink-light font-sans font-bold">
                R$
              </span>
              <div className="relative ml-0.5">
                <h1 className="text-[22px] leading-none text-brand-yellow text-shadow-[1.5px_1.5px_0px] text-shadow-brand-pink">
                  {formatPrice(product.price).replace("R$\u00a0", "")}
                </h1>
                <h1 className="absolute inset-0 text-[22px] leading-none text-transparent [-webkit-text-stroke:1px_rgba(0,0,0,0.4)] [text-stroke:1px_rgba(0,0,0,0.4)]">
                  {formatPrice(product.price).replace("R$\u00a0", "")}
                </h1>
              </div>
            </div>
            {formatInstallment(product.price, product.maxInstallments) && (
              <div className="flex items-center justify-start gap-0.5">
                <CreditCardIcon className="h-3 w-3 text-brand-pink dark:text-brand-pink-light" />
                <span className="text-[10px] font-sans font-semibold text-brand-dark-surface-2 dark:text-brand-white/90">
                  {formatInstallment(product.price, product.maxInstallments)}
                </span>
              </div>
            )}
          </div>

          {/* Colors */}
          <div className="flex flex-col justify-start w-full">
            {product.inStock ? (
              <>
                <span className="text-[11px] leading-none mb-1 text-brand-black/75 dark:text-brand-white">
                  Cores
                </span>
                <div className="flex flex-wrap gap-1 rounded-sm p-0.5 dark:bg-brand-white/5">
                  {uniqueColors
                    .filter((variant) => variant.inStock)
                    .slice(0, 8)
                    .map((variant) => (
                      <button
                        key={variant.color.slug}
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedColorIndex(
                            product.variants.findIndex(
                              (v) => v.color.slug === variant.color.slug,
                            ),
                          );
                        }}
                        aria-label={variant.color.name}
                        className={clsx(
                          "h-4 w-4 cursor-pointer rounded-sm border-[1.5px]",
                          selectedColorIndex ===
                            product.variants.findIndex(
                              (v) => v.color.slug === variant.color.slug,
                            )
                            ? "border-brand-black/75 shadow-sm shadow-brand-black/25"
                            : "border-transparent",
                        )}
                        style={{ backgroundColor: variant.color.hex }}
                      />
                    ))}
                </div>
              </>
            ) : (
              <div className="origin-left">
                <ProductBadgeY2K variant="soldOut" size="mobile">
                  {t("card.soldOut")}
                </ProductBadgeY2K>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-col w-full gap-1.5 px-2">
          {/* Row 1: Comprar */}
          <div className="grid grid-cols-[auto_2.5rem] gap-1">

            <button
              onClick={(e) => {
                e.preventDefault();
                buyNow();
              }}
              disabled={!inStock}
              className={clsx(
                "group relative isolate w-full rounded-md border-2 border-brand-pink/90 bg-brand-black/90 py-1.5",
                "dark:border-brand-black/50 dark:bg-brand-pink-light/90 dark:active:border-brand-purple",
                inStock
                  ? "transition-all duration-300 active:bg-brand-black"
                  : "opacity-50",
              )}
            >
              <div className="relative flex h-full w-full items-center justify-center">
                <p className="font-mono text-[11px] font-extrabold tracking-wider text-brand-white/90 uppercase transition-all duration-300 group-active:text-brand-pink dark:text-brand-black/90 dark:group-active:dark:text-brand-purple/90">
                  COMPRAR AGORA
                </p>
              </div>
              <div className="absolute top-0 left-0 -z-1 h-[75%] w-[96%] rounded-t-sm rounded-br-lg bg-brand-white/15" />
              <div className="absolute top-0 left-0 -z-1 h-full w-full rounded-sm border border-t-brand-white/10 border-r-brand-white/25 border-b-brand-white/10 border-l-brand-white/25" />
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart();
              }}
              disabled={!inStock}
              className={clsx(
                "group relative isolate flex flex-1 items-center justify-center rounded-md border-2 border-brand-black py-1.5 dark:border-brand-black/25 dark:active:border-brand-purple/90",
                inStock
                  ? "transition-all duration-300"
                  : "opacity-50",
                added
                  ? "bg-brand-success"
                  : "bg-brand-pink/90 dark:bg-brand-white/90",
                inStock && !added && "active:bg-brand-pink",
              )}
            >
              {added ? (
                <>
                  <Check
                    className={clsx(
                      "h-4 w-4 stroke-[2.5px] text-brand-black/90 dark:text-brand-white/90",
                    )}
                  />
                </>
              ) : (
                <>
                  <ShoppingCart
                    className={clsx(
                      "h-4 w-4 stroke-[2.5px] group-active:text-brand-light-surface-0 dark:text-brand-black/90 group-active:dark:text-brand-purple/90",
                    )}
                  />
                </>
              )}
              <div className="absolute top-0 left-0 -z-1 h-[75%] w-[94%] rounded-t-sm rounded-br-lg bg-brand-white/30 transition-all duration-300" />
              <div className="absolute top-0 left-0 -z-1 h-full w-full rounded-sm border border-t-brand-black/20 border-r-brand-black/40 border-b-brand-black/20 border-l-brand-black/40" />
            </button>
          </div>


        </div>
      </div>
    </div>
  );
}
