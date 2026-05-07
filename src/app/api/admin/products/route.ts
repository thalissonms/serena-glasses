import { NextResponse } from "next/server";
import { supabaseServer } from "@shared/lib/supabase/server";
import { withAdmin } from "@shared/lib/auth/withAdmin";
import { productCreateSchema } from "@features/admin/schemas/productCreate.schema";
import { generateNextProductCode } from "@features/admin/utils/generateProductCode";

const CODE_RETRY_LIMIT = 5;

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

  for (let attempt = 0; attempt < CODE_RETRY_LIMIT; attempt++) {
    const code = await generateNextProductCode(parsed.data.category_id);

    const { data, error } = await supabaseServer
      .from("products")
      .insert({ ...parsed.data, code, active: false })
      .select("id, code")
      .single();

    if (!error) return NextResponse.json({ id: data.id, code: data.code }, { status: 201 });

    const isUniqueViolation =
      error.code === "23505" || /duplicate key value/i.test(error.message);
    if (!isUniqueViolation) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json(
    { error: "Não foi possível gerar código único após várias tentativas" },
    { status: 500 },
  );
});
