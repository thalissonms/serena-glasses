/**
 * Page: /admin/stories — grid de home_stories com DnD reorder.
 *
 * Carrega todos os stories ordenados por display_order e passa ao StoriesListClient.
 *
 * Usado em: Sidebar → Marketing → Stories.
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import { getHomeStoriesList } from "@features/admin/services/homeStoriesList.service";
import StoriesListClient from "@features/admin/components/stories/StoriesListClient";

export default async function StoriesPage() {
  await requireAdmin("/admin/login");
  const stories = await getHomeStoriesList();

  return (
    <div className="p-8">
      <StoriesListClient stories={stories} />
    </div>
  );
}
