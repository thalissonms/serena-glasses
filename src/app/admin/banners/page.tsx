import { requireAdmin } from "@shared/lib/auth/admin";
import { getSiteBannersList } from "@features/admin/services/siteBannersList.service";
import BannersListClient from "@features/admin/components/BannersListClient";

export default async function AdminBannersPage() {
  await requireAdmin();
  const items = await getSiteBannersList();
  return <BannersListClient initialItems={items} />;
}
