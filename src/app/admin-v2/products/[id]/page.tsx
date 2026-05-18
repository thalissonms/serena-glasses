/**
 * Page: /admin-v2/products/[id] — edição de produto com tabs Y2K Chrome.
 *
 * Server Component: carrega produto + categorias em paralelo e passa ao client.
 */
import { notFound } from "next/navigation";
import { requireAdmin } from "@shared/lib/auth/admin";
import { getProductForEdit } from "@features/admin/services/productEdit.service";
import { getCategoriesList } from "@features/admin/services/categoriesList.service";
import ProductEditClient from "@features/admin-v2/components/products/ProductEditClient";

export default async function AdminV2ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductForEdit(id),
    getCategoriesList(),
  ]);
  if (!product) notFound();
  return <ProductEditClient product={product} categories={categories} />;
}
