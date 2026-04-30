import { requireAdmin } from "@shared/lib/auth/admin";
import ProductsClient from "@features/admin/components/ProductsClient";
import { getProductsList } from "@features/admin/services/productsList.service";

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await getProductsList();

  return <ProductsClient products={products} />;
}
