/**
 * Page: /admin/products — listagem de produtos com filtros Y2K Chrome.
 *
 * Server Component: busca lista de produtos e categorias em paralelo.
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import { getProductsList } from "@features/admin/services/productsList.service";
import { getCategoriesList } from "@features/admin/services/categoriesList.service";
import ProductsListClient from "@features/admin/components/products/ProductsListClient";

export const dynamic = "force-dynamic";

export default async function AdminV2ProductsPage() {
  await requireAdmin("/admin/login");
  const [products, categories] = await Promise.all([
    getProductsList(),
    getCategoriesList(),
  ]);
  return <ProductsListClient products={products} categories={categories} />;
}
