import { NextResponse } from "next/server";
import { withAdmin } from "@shared/lib/auth/withAdmin";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { homeStoryCreateSchema } from "@features/admin/schemas/homeStory.schema";
import { getHomeStoriesList } from "@features/admin/services/homeStoriesList.service";

export const GET = withAdmin(async () => {
  try {
    const items = await getHomeStoriesList();
    return NextResponse.json({ items });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
});

export const POST = withAdmin(async (req) => {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const parsed = homeStoryCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  let insertPayload: Record<string, unknown>;

  if (parsed.data.kind === "product") {
    const { data: product, error: lookupErr } = await getSupabaseServer()
      .from("products")
      .select("id")
      .eq("code", parsed.data.product_code)
      .maybeSingle();

    if (lookupErr) {
      return NextResponse.json({ error: lookupErr.message }, { status: 500 });
    }
    if (!product) {
      return NextResponse.json(
        { error: `Produto com cÃ³digo "${parsed.data.product_code}" nÃ£o encontrado` },
        { status: 404 },
      );
    }

    const { product_code: _omit, ...rest } = parsed.data;
    insertPayload = { ...rest, product_id: product.id };
  } else {
    insertPayload = parsed.data;
  }

  const { data: row, error } = await getSupabaseServer()
    .from("home_stories")
    .insert(insertPayload)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(row, { status: 201 });
});
