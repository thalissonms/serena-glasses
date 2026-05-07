import { requireAdmin } from "@shared/lib/auth/admin";
import { getHomeStoriesList } from "@features/admin/services/homeStoriesList.service";
import StoriesListClient from "@features/admin/components/StoriesListClient";

export default async function AdminStoriesPage() {
  await requireAdmin();
  const items = await getHomeStoriesList();
  return <StoriesListClient initialItems={items} />;
}
