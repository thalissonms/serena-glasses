import { getSupabaseServer } from "@shared/lib/supabase/server";
import type { HomeStory, HomeStoryRow } from "@features/home/types/homeStory.types";

function resolveStory(row: HomeStoryRow, product: Record<string, unknown> | null, lang: string): HomeStory | null {
  const l = lang.startsWith("en") ? "en" : lang.startsWith("es") ? "es" : "pt";

  if (row.kind === "product") {
    if (!product) return null;
    const images = (product.product_images as { url: string; alt: string; position: number }[] | null) ?? [];
    const primary = images.sort((a, b) => (a.position ?? 99) - (b.position ?? 99))[0];
    const catRows = (product.categories as { icon_name?: string } | null);
    return {
      id: row.id,
      kind: "product",
      mediaType: product.video_url ? "video" : "image",
      mediaUrl: (product.video_url as string | null) ?? primary?.url ?? "",
      posterUrl: primary?.url,
      ctaUrl: `/products/${product.slug as string}`,
      ctaLabel: l === "en" ? "View product" : l === "es" ? "Ver producto" : "Ver produto",
      title: product.name as string,
      subtitle: (product.short_description as string | null) ?? undefined,
      avatarKind: "icon",
      avatarIconName: catRows?.icon_name ?? "Glasses",
      productId: product.id as string,
      productSlug: product.slug as string,
      productName: product.name as string,
      productShortDescription: (product.short_description as string | null) ?? undefined,
      productInStock: product.active as boolean,
    };
  }

  if (row.kind === "manual") {
    return {
      id: row.id,
      kind: "manual",
      mediaType: row.media_type!,
      mediaUrl: row.media_url!,
      ctaUrl: row.cta_url ?? "#",
      ctaLabel:
        l === "en" ? (row.cta_label_en ?? row.cta_label_pt ?? "See more")
        : l === "es" ? (row.cta_label_es ?? row.cta_label_pt ?? "Ver mÃ¡s")
        : (row.cta_label_pt ?? "Saiba mais"),
      title:
        l === "en" ? (row.title_en ?? row.title_pt ?? "")
        : l === "es" ? (row.title_es ?? row.title_pt ?? "")
        : (row.title_pt ?? ""),
      subtitle:
        l === "en" ? (row.subtitle_en ?? row.subtitle_pt ?? undefined)
        : l === "es" ? (row.subtitle_es ?? row.subtitle_pt ?? undefined)
        : (row.subtitle_pt ?? undefined),
      avatarKind: "label",
      avatarLabel: row.avatar_label ?? "NEW",
    };
  }

  return null;
}

export async function getPublicHomeStories(lang = "pt"): Promise<HomeStory[]> {
  const { data: allRows, error } = await getSupabaseServer()
    .from("home_stories")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) throw new Error(error.message);
  if (!allRows || allRows.length === 0) return [];

  const now = Date.now();
  const rows = (allRows as HomeStoryRow[]).filter((r) => {
    const startsOk = !r.starts_at || new Date(r.starts_at).getTime() <= now;
    const endsOk = !r.ends_at || new Date(r.ends_at).getTime() > now;
    return startsOk && endsOk;
  });

  if (rows.length === 0) return [];

  const productIds = rows
    .filter((r) => r.kind === "product" && r.product_id)
    .map((r) => r.product_id!);

  let productMap = new Map<string, Record<string, unknown>>();
  if (productIds.length > 0) {
    const { data: products } = await getSupabaseServer()
      .from("products")
      .select("id, slug, name, short_description, video_url, active, category_id, product_images(url, alt, position), categories(icon_name)")
      .in("id", productIds);

    for (const p of products ?? []) {
      productMap.set(p.id as string, p as Record<string, unknown>);
    }
  }

  const stories: HomeStory[] = [];
  for (const row of rows) {
    const product = row.product_id ? (productMap.get(row.product_id) ?? null) : null;
    const story = resolveStory(row, product, lang);
    if (story) stories.push(story);
  }
  return stories;
}
