import { getSupabaseServer } from "@shared/lib/supabase/server";

export interface PublicSiteHighlight {
  image_url_light: string | null;
  image_url_dark: string | null;
}

export async function getPublicSiteHighlight(): Promise<PublicSiteHighlight | null> {
  const { data, error } = await getSupabaseServer()
    .from("site_highlight")
    .select("image_url_light, image_url_dark")
    .limit(1)
    .single();

  if (error || !data) return null;

  return data as PublicSiteHighlight;
}
