import { requireAdmin } from "@shared/lib/auth/admin";
import { getAllSettingRows } from "@features/admin/services/siteSettings.service";
import SiteSettingsClient from "@features/admin/components/SiteSettingsClient";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const rows = await getAllSettingRows();
  return <SiteSettingsClient initialRows={rows} />;
}
