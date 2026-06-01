import { NextResponse } from "next/server";
import { withAdmin } from "@shared/lib/auth/withAdmin";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { subcategoryCreateSchema } from "@features/admin/schemas/category.schema";

export const POST = withAdmin<{ id: string }>(async (req, { params }) => {
  const { id: category_id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const parsed = subcategoryCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { data: existing } = await getSupabaseServer()
    .from("subcategories")
    .select("id")
    .eq("category_id", category_id)
    .eq("slug", parsed.data.slug)
    .maybeSingle();
  if (existing) return NextResponse.json({ error: "Slug já em uso nesta categoria" }, { status: 409 });

  const { data, error } = await getSupabaseServer()
    .from("subcategories")
    .insert({ ...parsed.data, category_id })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id }, { status: 201 });
});
