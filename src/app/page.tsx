import { SerenaCollageBackground } from "@shared/components/layout";
import Showcase from "@features/home/components/Showcase";
import { NewArrivals } from "@features/home/components/NewArrivals";
import { getNewProducts } from "@features/products/services/productService";

export default async function HomePage() {
  const newProducts = await getNewProducts();

  return (
    <article className="bg-linear-to-b bg-white from-white/80 to-white dark:from-brand-pink-bg-dark/60 dark:to-brand-pink-bg-dark dark:bg-brand-pink-bg-dark text-black dark:text-white min-h-screen transition-colors">
      <SerenaCollageBackground>
        <Showcase />
      </SerenaCollageBackground>
      <NewArrivals products={newProducts} />
    </article>
  );
}
