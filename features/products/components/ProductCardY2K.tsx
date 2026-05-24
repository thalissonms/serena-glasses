"use client";

import clsx from "clsx";
import { ProductBadgeY2K } from "./ProductBadge";
import { Check, ShoppingCart } from "lucide-react";
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

  return (
    <div
      className={clsx(
        "w-full max-w-100 h-full pb-4 relative bg-brand-light-surface-2 border-4 border-brand-black/75 rounded-lg flex flex-col",
        "shadow-[4px_4px_0px] sm:shadow-[5px_5px_0px] lg:shadow-[6px_6px_0px] shadow-brand-purple",
        "dark:bg-brand-dark-surface-1 dark:shadow-brand-pink/90",
        !product.inStock && "opacity-75 cursor-not-allowed",
      )}
    >
      <div className="w-full h-19 p-2 relative z-10">
        <div className="w-full h-full relative isolate bg-brand-pink-light/60 dark:bg-brand-pink-light/90 rounded-lg border-4 border-brand-black/75">
          <div className="w-[97%] h-[90%] isolate bg-brand-pink/75 dark:bg-brand-pink/80 rounded-e-lg rounded-tl-lg rounded-bl-sm bottom-0 left-0 absolute">
            <div className="flex gap-1 px-2 py-0.5 items-center justify-between">
              {(product.isNew ||
              product.isOutlet ||
              (product.isOnSale && product.compareAtPrice)) ? (

                  <div className="flex gap-0.5 ml-1">
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
                <div className="flex items center ml-2">

                  <Sublogo className="w-8 h-8 text-brand-black/80" />
                </div>
              )}
              <WishlistButtonY2K productId={product.id} />
            </div>
            <div className="-z-1 w-[97%] h-[90%] bg-brand-white/30 absolute right-0 top-0 rounded-bl-lg" />
          </div>
        </div>
      </div>

      <div className="w-full relative h-64 sm:h-72 md:h-96 lg:h-101 flex items-center overflow-hidden -mt-5 sm:-mt-6 lg:-mt-8">
        <div className="flex gap-1 px-2 py-1 absolute top-8 right-2 bg-brand-pink/20 backdrop-blur-sm rounded-full z-10">
          {product.images.map((_, i) => (
            <div
              key={i}
              className={clsx(
                "w-3 h-3 relative rounded-md",
                i === 0 ? "bg-brand-pink" : "bg-brand-black/25",
              )}
            >
              <div
                className={clsx(
                  "w-2.25 h-2.25 absolute top-0 left-0 rounded-md",
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
          className="object-cover absolute transition-transform duration-500"
          draggable={false}
        /> */}
        
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={clsx(
                "object-cover absolute transition-transform duration-500",
                !product.inStock ? "grayscale opacity-50" : "group-hover:scale-105",
              )}
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-20">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="w-12 h-12">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
          )}
         
      </div>

      <div className="w-full -mt-8 sm:-mt-10 md:-mt-12 lg:-mt-15.75 z-10">
        <div className="w-full px-3">
          <div className="grid *:[grid-area:1/1]">
            <h2 className="font-family-shrikhand text-brand-pink dark:text-white text-[26px] sm:text-[28px] md:text-[34px] lg:text-[40px] text-shadow-[2.5px_2.5px_0px] text-shadow-brand-dark-surface-1 leading-6.5 sm:leading-[28px] md:leading-[34px] lg:leading-9.5 tracking-wider">
              {product.name}
            </h2>
            <h2 className="font-family-shrikhand text-brand-pink-light dark:text-brand-pink/25 text-[26px] sm:text-[28px] md:text-[34px] lg:text-[40px] leading-6.5 sm:leading-[28px] md:leading-[34px] lg:leading-9.5 tracking-wider">
              {product.name}
            </h2>
            <h2 className="font-family-shrikhand text-transparent text-[26px] sm:text-[28px] md:text-[34px] lg:text-[40px] [text-stroke:3px_rgba(45,45,45,0.25)] [-webkit-text-stroke:3px_rgba(45,45,45,0.25)]  leading-6.5 sm:leading-[28px] md:leading-[34px] lg:leading-9.5 tracking-wider">
              {product.name}
            </h2>
            <h2 className="font-family-shrikhand text-transparent text-[26px] sm:text-[28px] md:text-[34px] lg:text-[40px] [text-stroke:1.5px_rgba(255,0,182,1)] [-webkit-text-stroke:1.5px_rgba(255,0,182,1)] dark:[text-stroke:1.5px_rgba(155,0,255,0.75)] dark:[-webkit-text-stroke:1.5px_rgba(155,0,255,0.75)] leading-6.5 sm:leading-[28px] md:leading-[34px] lg:leading-9.5 tracking-wider">
              {product.name}
            </h2>
          </div>
        </div>
        <div className="h-5.5 px-3 flex justify-between w-full">
          <div className="flex">
            <span className="mt-1.5">
              <SparklesIcon className="w-4 h-4 text-brand-pink dark:text-brand-pink-light" />
            </span>
            <h4 className="text-brand-purple dark:text-brand-blue/80 font-mono font-black text-xl tracking-wider text-shadow-[1px_1px_0px] text-shadow-black/75 ml-1">
              {getPrimaryTag(product, i18n.language).toUpperCase()}
            </h4>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <div className="w-full min-h-10 mt-2 sm:mt-3 lg:mt-5 mb-4 sm:mb-5 lg:mb-8 px-4">
          <p className="font-family-poppins italic text-brand-black/55 dark:text-brand-white/75 leading-4.5 font-semibold">
            {product.shortDescription}
          </p>
        </div>

        <div className="flex items-center justify-between font-family-jocham px-4 mt-auto">
          <div className="h-full min-w-1">
            {product.inStock ? (
              <>
                <span className="text-sm text-brand-black/75 dark:text-brand-white">
                  Cores Disponíveis
                </span>

                <div className="grid grid-cols-5 gap-1 dark:bg-brand-white/5 rounded-sm p-0.5">
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
                          "w-4 h-4 rounded-md border-2 cursor-pointer",
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
              <span className="text-brand-black/80 dark:text-brand-white/75 text-xs line-through decoration-brand-danger/90 decoration-1.5 -mb-3">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            <div className="flex items-star">
              <span className="text-sm sm:text-sm lg:text-md text-brand-pink dark:text-brand-pink-light mt-1 lg:mt-2">
                R$
              </span>
              <div className="relative">
                <h1 className="text-[26px] sm:text-[28px] md:text-[32px] lg:text-[36px] text-brand-yellow text-shadow-[2px_2px_0px] text-shadow-brand-pink">
                  {formatPrice(product.price).replace("R$\u00a0", "")}
                </h1>
                <h1 className="text-[26px] sm:text-[28px] md:text-[32px] lg:text-[36px] absolute inset-0 text-transparent [text-stroke:1.5px_rgba(0,0,0,0.4)] [-webkit-text-stroke:1.5px_rgba(0,0,0,0.4)]">
                  {formatPrice(product.price).replace("R$\u00a0", "")}
                </h1>
              </div>
            </div>
            {formatInstallment(product.price, product.maxInstallments) && (
              <div className="flex items-center justify-center gap-1 -mt-1">
                <CreditCardIcon className="w-4 h-4 text-brand-pink dark:text-brand-pink-light -mt-0.5" />
                <span className="text-brand-dark-surface-2 dark:text-brand-white/90">
                  {formatInstallment(product.price, product.maxInstallments)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="w-full flex gap-2 px-2 mt-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart();
            }}
            disabled={!inStock}
            className={clsx(
              "w-15 relative flex items-center justify-center isolate py-2  mt-2 rounded-md group border-[2.5px] border-brand-black dark:border-brand-black/25 dark:hover:border-brand-purple/90",
              inStock
                ? "cursor-pointer transition-all duration-300"
                : "opacity-50 cursor-not-allowed",
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
                    "w-5 h-5 stroke-3 -ml-0.5 text-brand-black/90 dark:text-brand-white/90",
                  )}
                />
                <Check className="w-5 h-5 absolute text-brand-white/5 dark:text-brand-white/90 stroke-3 -ml-0.5 blur-[2px] transition-all duration-300" />
              </>
            ) : (
              <>
                <ShoppingCart
                  className={clsx(
                    "w-5 h-5 stroke-3 -ml-0.5 group-hover:text-brand-light-surface-0 dark:text-brand-black/90 group-hover:dark:text-brand-purple/90",
                  )}
                />
                <ShoppingCart className="w-5 h-5 absolute text-transparent stroke-3 -ml-0.5 blur-[2px] group-hover:text-brand-pink-light/75 transition-all duration-300" />
              </>
            )}
            <div className="-z-1 w-[96%] h-[75%] absolute top-0 left-0 bg-brand-white/30 rounded-t-md rounded-br-xl transition-all duration-300" />
            <div className="-z-1 w-full h-full absolute top-0 left-0 rounded-md border-2 border-l-brand-black/40 border-r-brand-black/40 border-t-brand-black/20 border-b-brand-black/20" />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              buyNow();
            }}
            disabled={!inStock}
            className={clsx(
              "w-full relative isolate py-2 bg-brand-black/90 mt-2 rounded-md group border-3 border-brand-pink/90",
              "dark:bg-brand-pink-light/90 dark:border-brand-black/50 dark:hover:border-brand-purple",
              inStock
                ? "cursor-pointer hover:bg-brand-black transition-all duration-300"
                : "opacity-50 cursor-not-allowed",
            )}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <p className="font-mono font-extrabold text-brand-white/90 uppercase tracking-widest group-hover:text-brand-pink transition-all duration-300 dark:text-brand-black/90 dark:group-hover:dark:text-brand-purple/90">
                {t("page.buyNow")}
              </p>
              <p className="font-mono absolute font-extrabold text-transparent uppercase tracking-widest group-hover:text-brand-pink/75 blur-[2px] transition-all duration-300 dark:group-hover:dark:text-brand-pink-light/50">
                {t("page.buyNow")}
              </p>
            </div>
            <div className="-z-1 w-[96%] h-[75%] absolute top-0 left-0 bg-brand-white/15 rounded-t-md rounded-br-xl" />
            <div className="-z-1 w-full h-full absolute top-0 left-0 rounded-sm border-2 border-l-brand-white/25 border-r-brand-white/25 border-t-brand-white/10 border-b-brand-white/10" />
          </button>
        </div>
      </div>
    </div>
  );
}
