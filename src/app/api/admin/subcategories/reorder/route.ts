import { NextResponse } from "next/server";
import { withAdmin } from "@shared/lib/auth/withAdmin";
import { supabaseServer } from "@shared/lib/supabase/server";
import { subcategoryReorderSchema } from "@features/admin/schemas/category.schema";

export const POST = withAdmin(async (req) => {
  const body = await req.json().catch(() => null);
  const parsed = subcategoryReorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const updates = parsed.data.ids.map((id, idx) =>
    supabaseServer.from("subcategories").update({ display_order: idx }).eq("id", id),
  );
  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error) return NextResponse.json({ error: failed.error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
});
