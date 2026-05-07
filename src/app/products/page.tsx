import { getAllProducts } from "@features/products/services/productService";
import {
  filterAndSortProducts,
  type ListingParams,
} from "@features/products/utils/filterProducts";
import { ProductsPageContent } from "@features/products/components/ProductsPageContent";
import NewArrivalsMobile from "@features/home/components/mobile/NewArrivalsMobile";
import { FilterSubCategories } from "@features/products/components/mobile/FilterSubCategories";

interface Props {
  searchParams: Promise<ListingParams>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const products = filterAndSortProducts(await getAllProducts(), params);

  return (
    <>
      <div className="hidden md:block">
        <ProductsPageContent products={products} params={params} />
      </div>
      <div className="md:hidden">
        <NewArrivalsMobile news={!params.category} products={products} category={params.category} />
      </div>
    </>
  );
}
