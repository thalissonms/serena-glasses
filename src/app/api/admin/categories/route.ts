import { NextResponse } from "next/server";
import { withAdmin } from "@shared/lib/auth/withAdmin";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { getCategoriesWithSubs } from "@features/admin/services/categoriesList.service";
import { categoryCreateSchema } from "@features/admin/schemas/category.schema";

export const GET = withAdmin(async () => {
  try {
    const items = await getCategoriesWithSubs();
    return NextResponse.json({ items });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
});

export const POST = withAdmin(async (req) => {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const parsed = categoryCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { data: existing } = await getSupabaseServer()
    .from("categories")
    .select("id")
    .eq("slug", parsed.data.slug)
    .maybeSingle();
  if (existing) return NextResponse.json({ error: "Slug jÃ¡ em uso" }, { status: 409 });

  const { data, error } = await getSupabaseServer()
    .from("categories")
    .insert(parsed.data)
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id }, { status: 201 });
});
