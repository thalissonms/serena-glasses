import { getAllProducts } from "@features/products/services/productService";
import { filterAndSortProducts, type ListingParams } from "@features/products/utils/filterProducts";
import { ProductsPageContent } from "@features/products/components/ProductsPageContent";

interface Props {
  searchParams: Promise<ListingParams>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const products = filterAndSortProducts(await getAllProducts(), params);

  return <ProductsPageContent products={products} params={params} />;
}
