export const dynamic = "force-dynamic";

import { SerenaCollageBackground } from "@shared/components/layout";
import Showcase from "@features/home/components/Showcase";
import { NewArrivals } from "@features/home/components/NewArrivals";
import {
  getAllProducts,
  getNewProducts,
} from "@features/products/services/productService";
import NewArrivalsMobile from "@features/home/components/mobile/NewArrivalsMobile";

export default async function HomePage() {
  const [newProducts, allProducts] = await Promise.all([
    getNewProducts(),
    getAllProducts(),
  ]);

  return (
    <>
      <article className="text-brand-black dark:text-brand-white transition-colors transition-duration-300 scroll-smooth">
        <div className="sticky top-0 hidden md:block">
          <SerenaCollageBackground>
            <Showcase />
          </SerenaCollageBackground>
        </div>
        <div className="relative hidden md:block">
            <NewArrivals products={newProducts} />
        </div>
        <div className="md:hidden block max-w-[100vw]">
          <NewArrivalsMobile products={allProducts} />
        </div>
      </article>
    </>
  );
}
