"use client";

import { useSmartBack } from "@features/navigation/hooks/useBackIntercept";
import PageInterceptTransition from "@features/navigation/components/mobile/modals/PageInterceptTransition";
import { ArrowLeft, Share2Icon } from "lucide-react";
import { WishlistButton } from "@features/wishlist/components/WishlistButton";
import ProductActionsMobile from "@features/products/components/mobile/ProductActionsMobile";
import type { Product } from "@features/products/types/product.types";
import { PolaroidProductImage } from "@features/products/components/mobile/PolaroidProductImages";
import { useCallback, useState } from "react";
import ProductColorSelect from "../ProductColorSelect";
import { formatPrice, formatInstallment } from "../../utils/formatPrice";
import { useTranslation } from "react-i18next";
import ProductDelivery from "../ProductDelivery";
import ProductDescription from "../ProductDescription";
import { Y2KDivider } from "@features/home/components/mobile/Y2KDivider";
import { getPrimaryTag } from "@features/products/utils/getPrimaryTag";
import { shareProduct } from "@features/products/utils/polaroidCard.utils";
import ModalNavHeader from "@features/navigation/components/mobile/modals/ModalNavHeader";

export function ProductPageMobileContent({ product }: { product: Product }) {
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
    <div className="min-h-screen bg-brand-pink-light dark:bg-brand-pink-bg-dark">
      <ModalNavHeader
        pageToBack={"/products"}
        isSharedButton={true}
        handleShared={handleShare}
        display={product.name}
        subtitle={getPrimaryTag(product, i18n.language)}
        buttons={{ labelBack: t("page.back"), labelShared: `${t("feed.actionShare")} ${product.name}` }}
      />
      <article className="flex flex-col gap-4 mb-22 mt-4">
        <section className="px-1">
          <div className="w-full relative aspect-square bg-white dark:bg-brand-pink-dark shadow-[2px_2px_0px] shadow-black dark:shadow-brand-blue border-4 border-black dark:border-brand-pink-light">
            <PolaroidProductImage
              product={product}
              index={0}
              size="feed"
              discountPercentage={() => 0}
            />
            <div className="flex flex-col gap-6 p-4">
              <div className="w-full flex justify-between items-center">
                <span className="w-fit h-fit inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-brand-pink dark:text-brand-pink-light border-2 border-brand-pink dark:border-brand-pink-light px-2 py-1">
                  {product.frameShape}
                </span>
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
        <ProductDescription product={product} />
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

export default function ProductModalPage({ product }: { product: Product }) {
  return (
    <PageInterceptTransition>
      <ProductPageMobileContent product={product} />
    </PageInterceptTransition>
  );
}
