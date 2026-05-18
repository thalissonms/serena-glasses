/**
 * Page: /admin-v2/banners — listagem de site_banners com preview visual colorido.
 *
 * Carrega todos os banners ordenados por display_order e passa ao BannersListClient.
 *
 * Usado em: Sidebar → Marketing → Banners.
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import { getSiteBannersList } from "@features/admin/services/siteBannersList.service";
import BannersListClient from "@features/admin-v2/components/banners/BannersListClient";

export default async function BannersPage() {
  await requireAdmin();
  const banners = await getSiteBannersList();

  return (
    <div className="p-8">
      <BannersListClient banners={banners} />
    </div>
  );
}
