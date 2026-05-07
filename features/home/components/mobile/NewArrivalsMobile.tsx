"use client";

import { useTranslation } from "react-i18next";
import type { Product } from "@features/products/types";
import { PolaroidProductCard } from "@features/products/components/mobile/PolaroidProductCard";
import FilterCategories from "@features/products/components/mobile/FilterCategories";
import VideoReelsMobile from "@features/home/components/mobile/VideoReelsMobile";
import { Y2KDivider } from "@features/home/components/mobile/Y2KDivider";
import { StoryViewerOverlay } from "@features/home/components/mobile/StoryViewerOverlay";
import { FilterSubCategories } from "@features/products/components/mobile/FilterSubCategories";

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
  return (
    <section
      role="feed"
      aria-label={t("catalog.ariaLabel")}
      className="w-full min-h-dvh bg-brand-pink-light dark:bg-brand-pink-bg-dark text-black dark:text-white transition-colors py-6 px-4"
    >
      {/* StoryViewerOverlay — fixed, renderiza acima de tudo dentro desta feature */}
      <StoryViewerOverlay />
      <div className="max-w-md mx-auto flex flex-col gap-3">
        <FilterCategories />
        {news ? (
          <>
            <VideoReelsMobile />
            <Y2KDivider className="-mx-4 px-20" />
          </>
        ) : (
          <FilterSubCategories title={category} categorySlug={category} />
        )}

        {products.map((product, i) => (
          <div
            key={product.id}
            className="max-w-screen flex flex-col items-center justify-center"
          >
            <PolaroidProductCard product={product} index={i} />
            {i < products.length - 1 && <Y2KDivider className="mt-4" />}
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewArrivalsMobile;
