/**
 * Page: /admin/banners — listagem de site_banners com preview visual colorido.
 *
 * Carrega todos os banners ordenados por display_order e passa ao BannersListClient.
 *
 * Usado em: Sidebar → Marketing → Banners.
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import { getSiteBannersList } from "@features/admin/services/siteBannersList.service";
import BannersListClient from "@features/admin/components/banners/BannersListClient";
import SiteHightlight from "@features/admin/components/banners/SiteHightlight";

export default async function BannersPage() {
  await requireAdmin("/admin/login");
  const banners = await getSiteBannersList();

  return (
    <div className="flex flex-col gap-12 p-8">
      <SiteHightlight />
      <BannersListClient banners={banners} />
    </div>
  );
}
