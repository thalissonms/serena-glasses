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
import { useState } from "react";
import clsx from "clsx";
import BannerPromo from "./BannerPromo";
import { ProductCardY2KMobile } from "@/features/products/components/mobile/ProductCardY2KMobile";

const LAYOUT_SELECT = [
  { label: "layout grid", icon: LayoutGrid, isGrid: true },
  { label: "layout feed", icon: GalleryVertical, isGrid: false },
];

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
        "min-h-dvh bg-brand-pink-light/60 dark:bg-brand-dark-surface-0/75 text-brand-black dark:text-brand-white transition-colors py-6 overflow-y-hidden px-4"
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
              <Y2KDivider className="-mx-4 px-20 -mb-2" />
            </div>
            {/* Botão para mudar o layout, por enquanto desativado display:hidden */}
            <div className="items-end justify-end px-2 gap-2 mb-2 hidden">
              {LAYOUT_SELECT.map(({ label, icon: Icon, isGrid }) => {
                const active = productsGrid === isGrid
                return (
                  <button
                    key={label}
                    aria-label={label}
                    className={clsx(
                      "outline-none p-1 flex items-center justify-center  border-2 hover:bg-brand-pink-dark cursor-pointer transition-all duration-300",
                      active
                        ? "bg-brand-pink dark:bg-brand-pink-light border-brand-black dark:border-brand-dark-surface-2 text-white dark:text-black/80"
                        : "bg-brand-white/60 dark:bg-brand-black/60 border-brand-black/60 dark:border-brand-white/20 text-black/60 dark:text-white/40",
                    )}
                    onClick={() => setProductsGrid(isGrid)}
                  >
                    <Icon className="w-6 h-6" />
                  </button>
                );
              })}
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

              <ProductCardY2KMobile
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
