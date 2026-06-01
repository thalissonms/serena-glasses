/**
 * Page: /admin/categories — listagem em árvore com DnD em dois níveis.
 *
 * Server Component: carrega categorias + subcategorias e passa ao client.
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import { getCategoriesWithSubs } from "@features/admin/services/categoriesList.service";
import CategoriesListClient from "@features/admin/components/categories/CategoriesListClient";

export default async function AdminV2CategoriesPage() {
  await requireAdmin("/admin/login");
  const categories = await getCategoriesWithSubs();
  return <CategoriesListClient initialCategories={categories} />;
}
