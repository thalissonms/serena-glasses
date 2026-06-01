export const dynamic = "force-dynamic";

import { SerenaCollageBackground } from "@shared/components/layout";
import Showcase from "@features/home/components/Showcase";
import { NewArrivals } from "@features/home/components/NewArrivals";
import {
  getAllProducts,
  getNewProducts,
  getPromotionProducts,
} from "@features/products/services/productService";
import NewArrivalsMobile from "@features/home/components/mobile/NewArrivalsMobile";
import Sales from "@features/home/components/Sales";
import { getPublicSiteHighlight } from "@features/home/services/siteHighlightPublic.service";
import SiteHighlight from "@features/home/components/SiteHighlight";

export default async function HomePage() {
  const [newProducts, allProducts, promotionProducts, highlight] = await Promise.all([
    getNewProducts(),
    getAllProducts(),
    getPromotionProducts(),
    getPublicSiteHighlight()
  ]);

  return (
    <>
      <article className="transition-duration-300 scroll-smooth text-brand-black transition-colors dark:text-brand-white">
        <div className="sticky top-0 hidden md:block">
          <SerenaCollageBackground>
            <Showcase />
          </SerenaCollageBackground>
        </div>
        <div className="relative mb-25 hidden bg-brand-light-surface-0 md:block dark:bg-brand-dark-surface-0">
          <NewArrivals products={newProducts} />
          <SiteHighlight hightlight={highlight || null} />
          <Sales products={promotionProducts} />
        </div>
        <div className="block max-w-[100vw] md:hidden">
          <NewArrivalsMobile products={allProducts} />
        </div>
      </article>
    </>
  );
}
