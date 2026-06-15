import { NextResponse } from "next/server";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { withAdmin } from "@shared/lib/auth/withAdmin";

const ALLOWED_STATUSES = ["approved", "rejected"] as const;

export const PATCH = withAdmin<{ id: string }>(async (req, { params }) => {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "JSON inválido" }, { status: 400 });

  const { status } = body as { status?: string };

  if (!status || !ALLOWED_STATUSES.includes(status as (typeof ALLOWED_STATUSES)[number])) {
    return NextResponse.json({ error: "Status deve ser 'approved' ou 'rejected'" }, { status: 400 });
  }

  const supabase = getSupabaseServer();

  const updateData: Record<string, unknown> = { status };

  if (status === "approved") {
    // Mark as verified when approved
    updateData.verified = true;
  }

  const { error } = await supabase
    .from("product_reviews")
    .update(updateData)
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Update rating_average and rating_count on the product
  if (status === "approved") {
    const { data: review } = await supabase
      .from("product_reviews")
      .select("product_id")
      .eq("id", id)
      .single();

    if (review?.product_id) {
      await recalcProductRating(review.product_id);
    }
  }

  return NextResponse.json({ ok: true });
});

export const DELETE = withAdmin<{ id: string }>(async (_req, { params }) => {
  const { id } = await params;
  const supabase = getSupabaseServer();

  const { data: review } = await supabase
    .from("product_reviews")
    .select("product_id, status")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("product_reviews").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (review?.product_id && review.status === "approved") {
    await recalcProductRating(review.product_id);
  }

  return NextResponse.json({ ok: true });
});

async function recalcProductRating(productId: string): Promise<void> {
  const supabase = getSupabaseServer();

  const { data } = await supabase
    .from("product_reviews")
    .select("rating")
    .eq("product_id", productId)
    .eq("status", "approved");

  const rows = data ?? [];
  const count = rows.length;
  const avg = count > 0 ? rows.reduce((s, r) => s + r.rating, 0) / count : 0;

  await supabase
    .from("products")
    .update({
      rating_average: Math.round(avg * 10) / 10,
      rating_count: count,
    })
    .eq("id", productId);
}
