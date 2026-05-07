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
      <article className="text-black dark:text-white transition-colors transition-duration-300">
        <div className="sticky top-0 hidden md:block">
          <SerenaCollageBackground>
            <Showcase />
          </SerenaCollageBackground>
        </div>
        <div className="relative z-10 bg-white dark:bg-brand-pink-bg-dark hidden md:block">
          <NewArrivals products={newProducts} />
        </div>
        <div className="md:hidden block">
          <NewArrivalsMobile products={allProducts} />
        </div>
      </article>
    </>
  );
}
