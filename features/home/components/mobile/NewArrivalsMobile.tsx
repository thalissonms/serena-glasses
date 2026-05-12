"use client";

import { useTranslation } from "react-i18next";
import type { Product } from "@features/products/types";
import { PolaroidProductCard } from "@features/products/components/mobile/PolaroidProductCard";
import FilterCategories from "@features/products/components/mobile/FilterCategories";
import VideoReelsMobile from "@features/home/components/mobile/VideoReelsMobile";
import { Y2KDivider } from "@features/home/components/mobile/Y2KDivider";
import { StoryViewerOverlay } from "@features/home/components/mobile/StoryViewerOverlay";
import { FilterSubCategories } from "@features/products/components/mobile/FilterSubCategories";
import { GalleryVertical, LayoutGrid } from "lucide-react";
import { Suspense, useState } from "react";
import clsx from "clsx";
import BannerPromo from "./BannerPromo";

const NewArrivalsMobile = ({
  products,
  news = true,
  category = "",
}: {
  products: Product[];
  news?: boolean;
  category?: string;
}) => {
  const { t } = useTranslation("home");
  const [productsGrid, setProductsGrid] = useState(true);
  return (
    <article
      role="feed"
      aria-label={t("catalog.ariaLabel")}
      className={
        "min-h-dvh bg-brand-pink-light dark:bg-brand-pink-bg-dark text-black dark:text-white transition-colors py-6 overflow-y-hidden px-4"
      }
    >
      <StoryViewerOverlay />
      <div className="max-w-md mx-auto flex flex-col gap-1">
        <FilterCategories />
        {news ? (
          <>
          <div className="w-full flex flex-col gap-3 py-4 -mt-4">
            <BannerPromo />
            <VideoReelsMobile />
            <Y2KDivider className="-mx-4 px-20" />
          </div>
            <div className="flex items-end justify-end px-2 gap-2 mb-2">
              <button
                className={clsx(
                  "outline-none p-1 flex items-center justify-center shadow-brand-black dark:shadow-brand-blue border-2 border-brand-black dark:border-brand-pink-light text-white hover:bg-brand-pink-dark cursor-pointer transition-all duration-300",
                  productsGrid
                    ? "shadow-[2px_2px_0px] bg-brand-pink dark:bg-brand-pink focus:bg-brand-pink dark:focus:bg-brand-pink"
                    : "shadow-[1px_1px_0px] bg-brand-blue dark:bg-brand-pink-dark focus:bg-brand-blue dark:focus:bg-brand-pink-dark",
                )}
                onClick={() => setProductsGrid(false)}
              >
                <GalleryVertical className="w-6 h-6" />
              </button>
              <button
                className={clsx(
                  "outline-none p-1 flex items-center justify-center shadow-brand-black dark:shadow-brand-blue border-2 border-brand-black dark:border-brand-pink-light text-white hover:bg-brand-pink-dark cursor-pointer transition-all duration-300",
                  !productsGrid
                    ? "shadow-[2px_2px_0px] bg-brand-pink dark:bg-brand-pink focus:bg-brand-pink dark:focus:bg-brand-pink"
                    : "shadow-[1px_1px_0px] bg-brand-blue dark:bg-brand-pink-dark focus:bg-brand-blue dark:focus:bg-brand-pink-dark",
                )}
                onClick={() => setProductsGrid(true)}
              >
                <LayoutGrid className="w-6 h-6" />
              </button>
            </div>
          </>
        ) : (
          <FilterSubCategories title={category} categorySlug={category} />
        )}
        <section
          className={clsx(
            "w-full transition-all duration-300",
            productsGrid
              ? "grid grid-cols-2 gap-y-4 gap-x-2"
              : "flex flex-col gap-4",
          )}
        >
          {products.map((product, i) => (
            <div key={product.id} className="w-full flex flex-col items-center">
              <PolaroidProductCard
                gridSize={productsGrid}
                product={product}
                index={i}
              />
              {!productsGrid && i < products.length - 1 && (
                <Y2KDivider className="mt-4" />
              )}
            </div>
          ))}
        </section>
      </div>
    </article>
  );
};

export default NewArrivalsMobile;
