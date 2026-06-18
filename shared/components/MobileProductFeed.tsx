"use client";

import { useTranslation } from "react-i18next";
import { PublicHomeSection } from "@features/home/services/homeSectionsPublic.service";
import { ProductCardY2KMobile } from "@features/products/components/mobile/ProductCardY2KMobile";
import FilterCategories from "@features/products/components/mobile/FilterCategories";
import VideoReelsMobile from "@features/home/components/mobile/VideoReelsMobile";
import { Y2KDivider } from "@features/home/components/mobile/Y2KDivider";
import { StoryViewerOverlay } from "@features/home/components/mobile/StoryViewerOverlay";
import BannerPromo from "../../features/home/components/mobile/BannerPromo";
import SectionTitle from "@features/home/components/SectionTitle";
import { pickLocale } from "@shared/utils/pickLocale";

export default function MobileHomeFeed({ sections }: { sections: PublicHomeSection[] }) {
  const { t, i18n } = useTranslation("home");

  return (
    <article
      role="feed"
      aria-label={t("catalog.ariaLabel")}
      className="overflow-x-hidden min-h-dvh bg-brand-pink-light/60 dark:bg-brand-dark-surface-0/75 text-brand-black dark:text-brand-white transition-colors py-6 overflow-y-hidden px-1"
    >
      <StoryViewerOverlay />
      <div className="max-w-md mx-auto flex flex-col gap-1">
        <FilterCategories />
        <div className="w-full flex flex-col gap-4 py-4 -mt-4">
          <VideoReelsMobile />
          {/* <Y2KDivider className="-mx-4 px-20 -mb-2" /> */}
        </div>

        <div className="flex flex-col gap-12 mt-1">
          {sections.map((section) => {
            if (!section.products || section.products.length === 0) return null;
            return (
              <section key={section.id} className="w-full flex flex-col items-center">
                <div className="mb-3">
                  <SectionTitle title={pickLocale(section, i18n.language)} />
                </div>

                <div className="w-full grid grid-cols-2 gap-y-4 gap-x-2">
                  {section.products.slice(0, 8).map((product, i) => (
                    <div key={product.id} className="w-full flex flex-col items-center">
                      <ProductCardY2KMobile
                        product={product}
                        index={i}
                      />
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </article>
  );
}
