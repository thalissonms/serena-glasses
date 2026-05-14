import { NextResponse } from "next/server";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { withAdmin } from "@shared/lib/auth/withAdmin";
import { productPatchSchema } from "@features/admin/schemas/productEdit.schema";

export const PATCH = withAdmin<{ id: string }>(async (req, { params }) => {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const parsed = productPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { subcategory_ids, ...productData } = parsed.data;

  if (Object.keys(productData).length === 0 && subcategory_ids === undefined) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  if (productData.slug) {
    const { data: existing } = await getSupabaseServer()
      .from("products")
      .select("id")
      .eq("slug", productData.slug)
      .neq("id", id)
      .maybeSingle();
    if (existing) return NextResponse.json({ error: "Slug já em uso" }, { status: 409 });
  }

  if (Object.keys(productData).length > 0) {
    const { error } = await getSupabaseServer()
      .from("products")
      .update(productData)
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (subcategory_ids !== undefined) {
    const supabase = getSupabaseServer();
    const { error: delError } = await supabase
      .from("product_subcategories")
      .delete()
      .eq("product_id", id);
    if (delError) return NextResponse.json({ error: delError.message }, { status: 500 });

    if (subcategory_ids.length > 0) {
      const { error: insError } = await supabase
        .from("product_subcategories")
        .insert(subcategory_ids.map((subcategory_id) => ({ product_id: id, subcategory_id })));
      if (insError) return NextResponse.json({ error: insError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
});

export const DELETE = withAdmin<{ id: string }>(async (_req, { params }) => {
  const { id } = await params;

  const { error } = await getSupabaseServer()
    .from("products")
    .update({ active: false })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
});
