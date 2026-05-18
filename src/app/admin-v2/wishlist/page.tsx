/**
 * Page: /admin-v2/wishlist — viewer SCAFFOLD de favoritos agregados por produto.
 *
 * Server Component: busca wishlist_items (limit 2000), agrega por product_id em JS,
 * busca produtos e imagens para os IDs agregados. Read-only.
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { WishlistListClient } from "@features/admin-v2/components/wishlist/WishlistListClient";
import type { WishlistRow } from "@features/admin-v2/components/wishlist/WishlistListClient";

export const dynamic = "force-dynamic";

export default async function AdminV2WishlistPage() {
  await requireAdmin();

  const supabase = getSupabaseServer();

  const { data: wishlistItems } = await supabase
    .from("wishlist_items")
    .select("product_id, created_at")
    .limit(2000);

  const aggMap: Record<string, { count: number; lastAdded: string }> = {};
  for (const item of wishlistItems ?? []) {
    const pid = item.product_id;
    if (!pid) continue;
    if (!aggMap[pid]) {
      aggMap[pid] = { count: 0, lastAdded: item.created_at ?? "" };
    }
    aggMap[pid].count += 1;
    if (item.created_at && item.created_at > aggMap[pid].lastAdded) {
      aggMap[pid].lastAdded = item.created_at;
    }
  }

  const productIds = Object.keys(aggMap);

  if (productIds.length === 0) {
    return <WishlistListClient items={[]} />;
  }

  const { data: products } = await supabase
    .from("products")
    .select(
      `
      id, name,
      product_images ( url, position )
    `,
    )
    .in("id", productIds);

  const items: WishlistRow[] = (products ?? [])
    .map((p) => {
      const images = (
        p.product_images as { url: string; position: number | null }[]
      ).sort((a, b) => (a.position ?? 99) - (b.position ?? 99));
      const agg = aggMap[p.id];
      return {
        product_id: p.id,
        product_name: p.name,
        product_thumb: images[0]?.url ?? null,
        total_favorites: agg?.count ?? 0,
        last_added: agg?.lastAdded ?? null,
      };
    })
    .sort((a, b) => b.total_favorites - a.total_favorites);

  return <WishlistListClient items={items} />;
}
