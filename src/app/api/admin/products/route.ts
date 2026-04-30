import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@shared/lib/supabase/server";
import { withAdmin } from "@shared/lib/auth/withAdmin";
import { productCreateSchema } from "@features/admin/schemas/productCreate.schema";

export const POST = withAdmin(async (req) => {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const parsed = productCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { data: existing } = await supabaseServer
    .from("products")
    .select("id")
    .eq("slug", parsed.data.slug)
    .maybeSingle();

  if (existing) return NextResponse.json({ error: "Slug já em uso" }, { status: 409 });

  const { data, error } = await supabaseServer
    .from("products")
    .insert({ ...parsed.data, active: false })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ id: data.id }, { status: 201 });
});
