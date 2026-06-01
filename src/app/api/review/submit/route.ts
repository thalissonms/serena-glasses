import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@shared/lib/supabase/server";

const MAX_COMMENT_LENGTH = 400;

function sanitizeComment(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim()
    .slice(0, MAX_COMMENT_LENGTH);
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { reviewId, token, rating, comment } = body as {
    reviewId?: unknown;
    token?: unknown;
    rating?: unknown;
    comment?: unknown;
  };

  if (typeof reviewId !== "string" || typeof token !== "string") {
    return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 });
  }

  const ratingNum = Number(rating);
  if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return NextResponse.json({ error: "Nota deve ser entre 1 e 5" }, { status: 400 });
  }

  const rawComment = typeof comment === "string" ? comment : "";
  const safeComment = rawComment.length > 0 ? sanitizeComment(rawComment) : null;

  const supabase = getSupabaseServer();

  const { data: existing } = await supabase
    .from("product_reviews")
    .select("id, review_submitted_at, review_token_expires_at")
    .eq("id", reviewId)
    .eq("review_token", token)
    .maybeSingle();

  if (!existing) {
    return NextResponse.json({ error: "Token inválido" }, { status: 404 });
  }

  if (existing.review_submitted_at) {
    return NextResponse.json({ error: "Avaliação já enviada" }, { status: 409 });
  }

  if (
    existing.review_token_expires_at &&
    new Date(existing.review_token_expires_at) < new Date()
  ) {
    return NextResponse.json({ error: "Token expirado" }, { status: 410 });
  }

  const { error } = await supabase
    .from("product_reviews")
    .update({
      rating: ratingNum,
      comment: safeComment,
      review_submitted_at: new Date().toISOString(),
    })
    .eq("id", reviewId)
    .eq("review_token", token)
    .is("review_submitted_at", null);

  if (error) {
    console.error("[review/submit] update error:", error.message);
    return NextResponse.json({ error: "Erro ao salvar avaliação" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
