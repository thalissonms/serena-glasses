/**
 * Service: siteHighlightPublic — lê o highlight ativo para a home pública.
 *
 * Server-only. Retorna imagens light/dark e position (posição entre seções).
 *
 * Usado em: src/app/(app)/(mobile)/page.tsx → DynamicHomeSections.
 */
import { getSupabaseServer } from "@shared/lib/supabase/server";

export interface PublicSiteHighlight {
  image_url_light: string | null;
  image_url_dark: string | null;
  position: number;
}

export async function getPublicSiteHighlight(): Promise<PublicSiteHighlight | null> {
  const { data, error } = await getSupabaseServer()
    .from("site_highlight")
    .select("image_url_light, image_url_dark, position")
    .limit(1)
    .single();

  if (error || !data) return null;

  return data as PublicSiteHighlight;
}

