export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getProductBySlug } from "@features/products/services/productService";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import ProductPageContent from "@features/products/components/ProductPageContent";
import { ProductPageMobileContent } from "@features/products/components/mobile/ProductPageContentMobile";
import type { ReviewItem } from "@features/products/components/ProductReviews";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const { data: rawReviews } = await getSupabaseServer()
    .from("product_reviews")
    .select("author_name, rating, comment, city, purchased_at, created_at")
    .eq("product_id", product.id)
    .eq("status", "approved")
    .not("review_submitted_at", "is", null)
    .order("purchased_at", { ascending: false })
    .limit(9);

  const reviews: ReviewItem[] = (rawReviews ?? []).map((r) => ({
    name: r.author_name,
    city: r.city ?? "",
    stars: r.rating,
    text: r.comment ?? "",
    date: new Date(r.purchased_at ?? r.created_at ?? Date.now()).toLocaleDateString("pt-BR", {
      month: "short",
      year: "numeric",
    }),
    verified: true,
  }));

  return (
    <>
      <div className="hidden md:block"
        style={{
          backgroundImage: "url('/backgrounds/bg-grid.svg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <ProductPageContent product={product} videoSrc={product.videoUrl} reviews={reviews} />
      </div>
      <div className="md:hidden">
        <ProductPageMobileContent product={product} reviews={reviews} />
      </div>
    </>
  );
}
