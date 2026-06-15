export const dynamic = "force-dynamic";

import { getAllProducts } from "@features/products/services/productService";

import { ProductsPageContent } from "@features/products/components/ProductsPageContent";
import NewArrivalsMobile from "@features/home/components/mobile/NewArrivalsMobile";
import StartsBackgroud from "@shared/components/layout/Backgrounds/StartsBackground";
import { ListingParams } from "@features/products/types/productsFindParams.type";
import { filterAndSortProducts } from "@features/products/utils/filterProductsByParams";


interface Props {
  searchParams: Promise<ListingParams>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const products = filterAndSortProducts(await getAllProducts(), params);

  return (
    <>
      <div className="hidden md:block z-10">
        <StartsBackgroud>
          <ProductsPageContent products={products} params={params} />
        </StartsBackgroud>
      </div>
      <div className="md:hidden">
        <NewArrivalsMobile
          news={!params.category}
          products={products}
          category={params.category}
        />
      </div>
    </>
  );
}
