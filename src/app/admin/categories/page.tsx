import { requireAdmin } from "@shared/lib/auth/admin";
import { getCategoriesWithSubs } from "@features/admin/services/categoriesList.service";
import CategoryListClient from "@features/admin/components/CategoryListClient";

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const items = await getCategoriesWithSubs();
  return <CategoryListClient initialItems={items} />;
}
