/**
 * Page: /admin-v2/reviews — moderação SCAFFOLD de avaliações de produtos.
 *
 * Server Component: busca product_reviews com join products + primeira imagem por produto.
 * Ações de moderação desabilitadas — em desenvolvimento.
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { ReviewsListClient } from "@features/admin-v2/components/reviews/ReviewsListClient";
import type { ReviewRow } from "@features/admin-v2/components/reviews/ReviewsListClient";

export const dynamic = "force-dynamic";

export default async function AdminV2ReviewsPage() {
  await requireAdmin();

  const supabase = getSupabaseServer();

  const { data: rawReviews } = await supabase
    .from("product_reviews")
    .select(
      `
      id, product_id, author_name, rating, comment, status, verified, created_at,
      products (
        name,
        product_images ( url, position )
      )
    `,
    )
    .order("created_at", { ascending: false })
    .limit(200);

  const reviews: ReviewRow[] = (rawReviews ?? []).map((r) => {
    const product = r.products as unknown as {
      name: string;
      product_images: { url: string; position: number | null }[];
    } | null;

    const images = product?.product_images ?? [];
    const thumb =
      images.sort((a, b) => (a.position ?? 99) - (b.position ?? 99))[0]
        ?.url ?? null;

    return {
      id: r.id,
      product_id: r.product_id,
      product_name: product?.name ?? "Produto removido",
      product_thumb: thumb,
      author_name: r.author_name,
      rating: r.rating,
      comment: r.comment ?? null,
      status: r.status ?? "pending",
      verified: r.verified ?? null,
      created_at: r.created_at ?? null,
    };
  });

  return <ReviewsListClient reviews={reviews} />;
}
