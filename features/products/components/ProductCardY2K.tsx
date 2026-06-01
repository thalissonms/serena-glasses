"use client";

import clsx from "clsx";
import { ProductBadgeY2K } from "./ProductBadge";
import { Check, InfoIcon, ShoppingCart } from "lucide-react";
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
import { useProductModal } from "../hooks/useProductModal";

export interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCardY2K({ product }: ProductCardProps) {
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

  const openModal = useProductModal((state) => state.openModal);

  return (
    <div
      className={clsx(
        "relative flex h-full w-full max-w-100 flex-col rounded-lg border-4 border-brand-black/75 bg-brand-light-surface-2 pb-4",
        "shadow-[4px_4px_0px] shadow-brand-purple sm:shadow-[5px_5px_0px] lg:shadow-[6px_6px_0px]",
        "dark:bg-brand-dark-surface-1 dark:shadow-brand-pink/90",
        !product.inStock && "cursor-not-allowed opacity-75",
      )}
    >
      <div className="relative z-10 h-19 w-full p-2">
        <div className="relative isolate h-full w-full rounded-lg border-4 border-brand-black/75 bg-brand-pink-light/60 dark:bg-brand-pink-light/90">
          <div className="absolute bottom-0 left-0 isolate h-[90%] w-[97%] rounded-e-lg rounded-tl-lg rounded-bl-sm bg-brand-pink/75 dark:bg-brand-pink/80">
            <div className="flex items-center justify-between gap-1 px-2 py-0.5">
              {(product.isNew ||
                product.isOutlet ||
                (product.isOnSale && product.compareAtPrice)) ? (

                <div className="ml-1 flex gap-0.5">
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
              ) : (
                <div className="items center ml-2 flex">

                  <Sublogo className="h-8 w-8 text-brand-black/80" />
                </div>
              )}
              <WishlistButtonY2K productId={product.id} />
            </div>
            <div className="absolute top-0 right-0 -z-1 h-[90%] w-[97%] rounded-bl-lg bg-brand-white/30" />
          </div>
        </div>
      </div>

      <div className="relative -mt-5 flex h-64 w-full items-center overflow-hidden sm:-mt-6 sm:h-72 md:h-96 lg:-mt-8 lg:h-101">
        <div className="absolute top-8 right-2 z-10 flex gap-1 rounded-full bg-brand-pink/20 px-2 py-1 backdrop-blur-sm">
          {product.images.map((_, i) => (
            <div
              key={i}
              className={clsx(
                "relative h-3 w-3 rounded-md",
                i === 0 ? "bg-brand-pink" : "bg-brand-black/25",
              )}
            >
              <div
                className={clsx(
                  "absolute top-0 left-0 h-2.25 w-2.25 rounded-md",
                  i === 0 ? "bg-brand-white/30" : "bg-brand-white/20",
                )}
              />
            </div>
          ))}
        </div>
        {/* 
        <Image
          src="/products/ft-5.png"
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="absolute object-cover transition-transform duration-500"
          draggable={false}
        /> */}

        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={clsx(
              "absolute object-cover transition-transform duration-500",
              !product.inStock ? "opacity-50 grayscale" : "group-hover:scale-105",
            )}
            draggable={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center opacity-20">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="h-12 w-12">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}

      </div>

      <div className="z-10 -mt-8 w-full sm:-mt-10 md:-mt-12 lg:-mt-15.75">
        <div className="w-full px-3">
          <div className="grid *:[grid-area:1/1]">
            <h2 className="font-family-shrikhand text-[26px] leading-6.5 tracking-wider text-brand-pink text-shadow-[2.5px_2.5px_0px] text-shadow-brand-dark-surface-1 sm:text-[28px] sm:leading-[28px] md:text-[34px] md:leading-[34px] lg:text-[40px] lg:leading-9.5 dark:text-white">
              {product.name}
            </h2>
            <h2 className="font-family-shrikhand text-[26px] leading-6.5 tracking-wider text-brand-pink-light sm:text-[28px] sm:leading-[28px] md:text-[34px] md:leading-[34px] lg:text-[40px] lg:leading-9.5 dark:text-brand-pink/25">
              {product.name}
            </h2>
            <h2 className="font-family-shrikhand text-[26px] leading-6.5 tracking-wider text-transparent [-webkit-text-stroke:3px_rgba(45,45,45,0.25)] [text-stroke:3px_rgba(45,45,45,0.25)] sm:text-[28px]  sm:leading-[28px] md:text-[34px] md:leading-[34px] lg:text-[40px] lg:leading-9.5">
              {product.name}
            </h2>
            <h2 className="font-family-shrikhand text-[26px] leading-6.5 tracking-wider text-transparent [-webkit-text-stroke:1.5px_rgba(255,0,182,1)] [text-stroke:1.5px_rgba(255,0,182,1)] sm:text-[28px] sm:leading-[28px] md:text-[34px] md:leading-[34px] lg:text-[40px] lg:leading-9.5 dark:[-webkit-text-stroke:1.5px_rgba(155,0,255,0.75)] dark:[text-stroke:1.5px_rgba(155,0,255,0.75)]">
              {product.name}
            </h2>
          </div>
        </div>
        <div className="flex h-5.5 w-full justify-between px-3">
          <div className="flex">
            <span className="mt-1.5">
              <SparklesIcon className="h-4 w-4 text-brand-pink dark:text-brand-pink-light" />
            </span>
            <h4 className="ml-1 font-mono text-xl font-black tracking-wider text-brand-purple text-shadow-[1px_1px_0px] text-shadow-black/75 dark:text-brand-blue/80">
              {getPrimaryTag(product, i18n.language).toUpperCase()}
            </h4>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="mt-2 mb-4 min-h-10 w-full px-4 sm:mt-3 sm:mb-5 lg:mt-5 lg:mb-8">
          <p className="font-family-poppins leading-4.5 font-semibold text-brand-black/55 italic dark:text-brand-white/75">
            {product.shortDescription}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between px-4 font-family-jocham">
          <div className="h-full min-w-1">
            {product.inStock ? (
              <>
                <span className="text-sm text-brand-black/75 dark:text-brand-white">
                  Cores Disponíveis
                </span>

                <div className="grid grid-cols-5 gap-1 rounded-sm p-0.5 dark:bg-brand-white/5">
                  {uniqueColors
                    .filter((variant) => variant.inStock)
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
                          "h-4 w-4 cursor-pointer rounded-md border-2",
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
              <ProductBadgeY2K variant="soldOut">
                {t("card.soldOut")}
              </ProductBadgeY2K>
            )}
          </div>

          <div className="flex flex-col items-end">
            {product.compareAtPrice && (
              <span className="decoration-1.5 -mb-3 text-xs text-brand-black/80 line-through decoration-brand-danger/90 dark:text-brand-white/75">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            <div className="items-star flex">
              <span className="lg:text-md mt-1 text-sm text-brand-pink sm:text-sm lg:mt-2 dark:text-brand-pink-light">
                R$
              </span>
              <div className="relative">
                <h1 className="text-[26px] text-brand-yellow text-shadow-[2px_2px_0px] text-shadow-brand-pink sm:text-[28px] md:text-[32px] lg:text-[36px]">
                  {formatPrice(product.price).replace("R$\u00a0", "")}
                </h1>
                <h1 className="absolute inset-0 text-[26px] text-transparent [-webkit-text-stroke:1.5px_rgba(0,0,0,0.4)] [text-stroke:1.5px_rgba(0,0,0,0.4)] sm:text-[28px] md:text-[32px] lg:text-[36px]">
                  {formatPrice(product.price).replace("R$\u00a0", "")}
                </h1>
              </div>
            </div>
            {formatInstallment(product.price, product.maxInstallments) && (
              <div className="-mt-1 flex items-center justify-center gap-1">
                <CreditCardIcon className="-mt-0.5 h-4 w-4 text-brand-pink dark:text-brand-pink-light" />
                <span className="text-brand-dark-surface-2 dark:text-brand-white/90">
                  {formatInstallment(product.price, product.maxInstallments)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 flex w-full gap-2 px-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              openModal(product);
            }}
            disabled={!inStock}
            className={clsx(
              "group relative isolate mt-2 flex w-16 items-center  justify-center rounded-md border-[2.5px] border-brand-black py-2 dark:border-brand-black/25 dark:hover:border-brand-purple/90",
              "cursor-pointer transition-all duration-300",
              "bg-brand-pink/90 dark:bg-brand-white/90",
              "hover:bg-brand-pink",
            )}
          >
            <InfoIcon
              className={clsx(
                "-ml-0.5 h-5 w-5 stroke-3 group-hover:text-brand-light-surface-0 dark:text-brand-black/90 group-hover:dark:text-brand-purple/90",
              )}
            />
            <div className="absolute top-0 left-0 -z-1 h-[75%] w-[96%] rounded-t-md rounded-br-xl bg-brand-white/30 transition-all duration-300" />
            <div className="absolute top-0 left-0 -z-1 h-full w-full rounded-md border-2 border-t-brand-black/20 border-r-brand-black/40 border-b-brand-black/20 border-l-brand-black/40" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart();
            }}
            disabled={!inStock}
            className={clsx(
              "group relative isolate mt-2 flex w-16 items-center  justify-center rounded-md border-[2.5px] border-brand-black py-2 dark:border-brand-black/25 dark:hover:border-brand-purple/90",
              inStock
                ? "cursor-pointer transition-all duration-300"
                : "cursor-not-allowed opacity-50",
              added
                ? "bg-brand-success"
                : "bg-brand-pink/90 dark:bg-brand-white/90",
              inStock && !added && "hover:bg-brand-pink",
            )}
          >
            {added ? (
              <>
                <Check
                  className={clsx(
                    "-ml-0.5 h-5 w-5 stroke-3 text-brand-black/90 dark:text-brand-white/90",
                  )}
                />
                <Check className="absolute -ml-0.5 h-5 w-5 stroke-3 text-brand-white/5 blur-[2px] transition-all duration-300 dark:text-brand-white/90" />
              </>
            ) : (
              <>
                <ShoppingCart
                  className={clsx(
                    "-ml-0.5 h-5 w-5 stroke-3 group-hover:text-brand-light-surface-0 dark:text-brand-black/90 group-hover:dark:text-brand-purple/90",
                  )}
                />
                <ShoppingCart className="absolute -ml-0.5 h-5 w-5 stroke-3 text-transparent blur-[2px] transition-all duration-300 group-hover:text-brand-pink-light/75" />
              </>
            )}
            <div className="absolute top-0 left-0 -z-1 h-[75%] w-[96%] rounded-t-md rounded-br-xl bg-brand-white/30 transition-all duration-300" />
            <div className="absolute top-0 left-0 -z-1 h-full w-full rounded-md border-2 border-t-brand-black/20 border-r-brand-black/40 border-b-brand-black/20 border-l-brand-black/40" />
          </button>


          <button
            onClick={(e) => {
              e.preventDefault();
              buyNow();
            }}
            disabled={!inStock}
            className={clsx(
              "group relative isolate mt-2 w-full rounded-md border-3 border-brand-pink/90 bg-brand-black/90 py-2",
              "dark:border-brand-black/50 dark:bg-brand-pink-light/90 dark:hover:border-brand-purple",
              inStock
                ? "cursor-pointer transition-all duration-300 hover:bg-brand-black"
                : "cursor-not-allowed opacity-50",
            )}
          >
            <div className="relative flex h-full w-full items-center justify-center">
              <p className="font-mono font-extrabold tracking-widest text-brand-white/90 uppercase transition-all duration-300 group-hover:text-brand-pink dark:text-brand-black/90 dark:group-hover:dark:text-brand-purple/90">
                {t("page.buyNow")}
              </p>
              <p className="absolute font-mono font-extrabold tracking-widest text-transparent uppercase blur-[2px] transition-all duration-300 group-hover:text-brand-pink/75 dark:group-hover:dark:text-brand-pink-light/50">
                {t("page.buyNow")}
              </p>
            </div>
            <div className="absolute top-0 left-0 -z-1 h-[75%] w-[96%] rounded-t-md rounded-br-xl bg-brand-white/15" />
            <div className="absolute top-0 left-0 -z-1 h-full w-full rounded-sm border-2 border-t-brand-white/10 border-r-brand-white/25 border-b-brand-white/10 border-l-brand-white/25" />
          </button>
        </div>
      </div>
    </div>
  );
}
