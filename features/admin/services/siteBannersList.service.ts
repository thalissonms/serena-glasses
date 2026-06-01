import { getSupabaseServer } from "@shared/lib/supabase/server";
import type { SiteBannerRow } from "@features/home/types/siteBanner.types";

export async function getSiteBannersList(): Promise<SiteBannerRow[]> {
  const { data, error } = await getSupabaseServer()
    .from("site_banners")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as SiteBannerRow[];
}

export async function getActiveSiteBanners(_lang = "pt"): Promise<SiteBannerRow[]> {
  const { data, error } = await getSupabaseServer()
    .from("site_banners")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) throw new Error(error.message);

  const now = Date.now();
  return ((data ?? []) as SiteBannerRow[]).filter((b) => {
    const startsOk = !b.starts_at || new Date(b.starts_at).getTime() <= now;
    const endsOk = !b.ends_at || new Date(b.ends_at).getTime() > now;
    return startsOk && endsOk;
  });
}
