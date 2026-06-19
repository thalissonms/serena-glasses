"use client";

import { WishlistButton } from "@features/wishlist/components/WishlistButton";
import ProductActionsMobile from "@features/products/components/mobile/ProductActionsMobile";
import type { Product } from "@features/products/types/product.types";
import { PolaroidProductImage } from "@features/products/components/mobile/PolaroidProductImages";
import { useCallback, useState } from "react";
import ProductColorSelect from "../ProductColorSelect";
import { formatPrice, formatInstallment, discountPercentage } from "../../utils/formatPrice";
import { useTranslation } from "react-i18next";
import ProductDelivery from "../ProductDelivery";
import ProductDescription from "../ProductDescription";
import { Y2KDivider } from "@features/home/components/mobile/Y2KDivider";
import { getPrimaryTag } from "@features/products/utils/getPrimaryTag";
import { shareProduct } from "@features/products/utils/polaroidCard.utils";
import ModalNavHeader from "@shared/navigation/components/mobile/modals/ModalNavHeader";

import type { ReviewItem } from "../ProductReviews";
import clsx from "clsx";

export default function ProductMobileContent({ product, reviews }: { product: Product; reviews?: ReviewItem[] }) {
  const { t, i18n } = useTranslation("products");
  const firstInStock = product.variants.findIndex((v) => v.inStock);
  const [selectedColor, setSelectedColor] = useState(
    firstInStock >= 0 ? firstInStock : 0,
  );

  const handleShare = useCallback(
    () => shareProduct(product.slug, product.name),
    [product.slug, product.name],
  );

  return (
    <div className="min-h-screen bg-brand-pink-light/60 dark:bg-brand-dark-surface-0">
      <ModalNavHeader
        pageToBack={"/"}
        isSharedButton={true}
        handleShared={handleShare}
        display={product.name}
        subtitle={getPrimaryTag(product, i18n.language)}
        buttons={{ labelBack: t("page.back"), labelShared: `${t("feed.actionShare")} ${product.name}` }}
      />
      <article className="flex flex-col gap-4 mb-22">
        <section className="">
          <div className={clsx("w-full relative aspect-square rounded-md",
          )}>
            <PolaroidProductImage
              product={product}
              index={0}
              size="feed"
              discountPercentage={discountPercentage}
            />
            <div className="flex flex-col gap-6 -mt-2 px-4">
              <div className="w-full flex justify-between items-center">
                <div className={clsx("[clip-path:polygon(0%_0%,calc(100%-8px)_0%,100%_8px,100%_100%,0%_100%)] p-px flex justify-center items-center",
                  "bg-brand-black/80 rounded-md",
                  "dark:bg-brand-pink-light relative"
                )}>
                  <span className={clsx("w-fit h-fit inline-block text-[10px] tracking-[0.2em] uppercase text-brand-white dark:text-brand-black px-2 py-1",
                    "[clip-path:polygon(0%_0%,calc(100%-7.5px)_0%,100%_7.5px,100%_100%,0%_100%)] rounded-[5px]",
                    "bg-brand-pink font-family-poppins font-black text-shadow-[0.5px_0.5px_0px] text-shadow-brand-black/80"
                  )}>
                    {product.frameShape}
                  </span>
                  <div className={clsx("absolute [clip-path:polygon(0%_0%,calc(100%-7.5px)_0%,100%_7.5px,100%_100%,0%_100%)]",
                    "bg-linear-0 from-brand-white/15 via-white/5 to-transparent w-full h-full top-0 right-0",
                    "dark:bg-brand-pink-light"
                  )} />

                  <div className={clsx(
                    "absolute right-0 top-0 rounded-lg pointer-events-none",
                    "[clip-path:polygon(0%_0%,calc(100%-8px)_0%,100%_8px,100%_100%,0%_100%)]",
                    "bg-brand-black/80 blur-sm w-2.5 h-2.5"
                  )} />
                  <div className={clsx(
                    "absolute right-0 top-0 rounded-lg pointer-events-none",
                    "[clip-path:polygon(0%_0%,calc(100%-8px)_0%,100%_8px,100%_100%,0%_100%)]",
                    "bg-brand-light-surface-2 w-2.25 h-2.25"
                  )} />
                </div>
                <ProductColorSelect
                  product={product}
                  selectedColor={selectedColor}
                  onColorChange={setSelectedColor}
                />
              </div>
              <div className="w-full flex flex-col items-center gap-4">
                {product.shortDescription && (
                  <div className="w-full flex justify-center items-center border-[0.5px] border-dashed border-brand-pink-light p-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {product.shortDescription}
                    </p>
                  </div>
                )}
                <div className="w-full flex justify-between items-center">
                  <div className="w-full flex flex-col items-start">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-family-jocham font-bold text-brand-pink mt-1">
                        {formatPrice(product.price)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-md font-family-poppins font-semibold text-gray-500 dark:text-gray-200 line-through ml-2">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                    {formatInstallment(
                      product.price,
                      product.maxInstallments,
                    ) && (
                        <div className="w-1/2 flex items-center gap-1">
                          <span className="text-sm font-family-poppins font-normal text-gray-400 dark:text-gray-300">
                            {formatInstallment(
                              product.price,
                              product.maxInstallments,
                            )}
                          </span>
                        </div>
                      )}
                  </div>
                  <div className="flex items-center self-start mt-4 mr-2">
                    <WishlistButton size={32} productId={product.id} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Y2KDivider className="px-4" />
        <section className="px-1">
          <ProductDelivery />
        </section>
        <Y2KDivider className="px-4" />
        <ProductDescription product={product} reviews={reviews} />
        <footer className="w-full h-18 fixed bottom-0 bg-brand-pink-light/60 dark:bg-brand-pink-bg-dark/40 backdrop-blur-lg shadow-[-4px_-4px_6px] shadow-black/25 py-2 px-2 z-50">
          <ProductActionsMobile
            product={product}
            selectedColorIndex={selectedColor}
          />
        </footer>
      </article>
    </div>
  );
}
