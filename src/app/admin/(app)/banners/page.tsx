/**
 * Page: /admin/banners — listagem de site_banners e highlight promocional.
 *
 * Carrega banners, e títulos das seções ativas (para o select de posição do highlight).
 *
 * Usado em: Sidebar → Marketing → Banners.
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import { getSiteBannersList } from "@features/admin/services/siteBannersList.service";
import BannersListClient from "@features/admin/components/banners/BannersListClient";
import SiteHightlight from "@features/admin/components/banners/SiteHightlight";
import { getSupabaseServer } from "@shared/lib/supabase/server";

export default async function BannersPage() {
  await requireAdmin("/admin/login");

  const [banners, { data: sections }] = await Promise.all([
    getSiteBannersList(),
    getSupabaseServer()
      .from("home_sections")
      .select("id, title_pt")
      .eq("active", true)
      .order("display_order", { ascending: true }),
  ]);

  const sectionTitles = (sections ?? []).map((s: { title_pt: string }) => s.title_pt);

  return (
    <div className="flex flex-col gap-12 p-8">
      <SiteHightlight sectionTitles={sectionTitles} />
      <BannersListClient banners={banners} />
    </div>
  );
}

