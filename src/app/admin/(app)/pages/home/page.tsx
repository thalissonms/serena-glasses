import { getSupabaseServer } from "@shared/lib/supabase/server";
import { requireAdmin } from "@shared/lib/auth/admin";
import HomeSectionsListClient from "@features/admin/components/homeSections/HomeSectionsListClient";
import { getCategoriesWithSubs } from "@features/admin/services/categoriesList.service";

export default async function AdminHomePageConfig() {
  await requireAdmin("/admin/login");

  const supabase = getSupabaseServer();
  const { data: homeSections } = await supabase
    .from("home_sections")
    .select("*, subcategories(name_pt), categories(name_pt)")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  const categories = await getCategoriesWithSubs();

  return (
    <div className="p-8">
      <HomeSectionsListClient
        initialSections={homeSections || []}
        categories={categories}
      />
    </div>
  );
}
