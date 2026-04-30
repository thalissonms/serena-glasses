import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@shared/lib/supabase/server";
import { withAdmin } from "@shared/lib/auth/withAdmin";
import { variantPatchSchema } from "@features/admin/schemas/variantEdit.schema";

export const PATCH = withAdmin<{ id: string }>(async (req, { params }) => {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const parsed = variantPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const { error } = await supabaseServer
    .from("product_variants")
    .update(parsed.data)
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
});

export const DELETE = withAdmin<{ id: string }>(async (_req, { params }) => {
  const { id } = await params;

  const { count } = await supabaseServer
    .from("order_items")
    .select("id", { count: "exact", head: true })
    .eq("variant_id", id);

  if (count && count > 0) {
    return NextResponse.json(
      { error: "Variante possui pedidos vinculados e não pode ser excluída." },
      { status: 409 },
    );
  }

  const { error } = await supabaseServer.from("product_variants").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
});
