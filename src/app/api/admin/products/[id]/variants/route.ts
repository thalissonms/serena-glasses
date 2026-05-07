import { NextResponse } from "next/server";
import { supabaseServer } from "@shared/lib/supabase/server";
import { withAdmin } from "@shared/lib/auth/withAdmin";
import { variantCreateSchema } from "@features/admin/schemas/variantCreate.schema";
import { uniqueVariantCode } from "@features/admin/utils/generateProductCode";

export const POST = withAdmin<{ id: string }>(async (req, { params }) => {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const parsed = variantCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { data: product } = await supabaseServer
    .from("products")
    .select("code")
    .eq("id", id)
    .maybeSingle();

  const variantCode = product?.code
    ? await uniqueVariantCode(product.code, parsed.data.color_name)
    : null;

  const { data, error } = await supabaseServer
    .from("product_variants")
    .insert({
      product_id: id,
      ...parsed.data,
      ...(variantCode ? { variant_code: variantCode } : {}),
      stock_quantity: 0,
    })
    .select("id, color_name, color_hex, in_stock, variant_code")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
});
