import { NextResponse } from "next/server";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { withAdmin } from "@shared/lib/auth/withAdmin";
import { homeSectionReorderSchema } from "@features/admin/schemas/homeSection.schema";

export const PATCH = withAdmin(async (req) => {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const parsed = homeSectionReorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const supabase = getSupabaseServer();

  // Executar as atualizações em paralelo
  const promises = parsed.data.map((item) =>
    supabase
      .from("home_sections")
      .update({ display_order: item.display_order })
      .eq("id", item.id)
  );

  const results = await Promise.all(promises);
  const errors = results.filter((r) => r.error);

  if (errors.length > 0) {
    console.error("PATCH /api/admin/home-sections/reorder errors:", errors);
    return NextResponse.json({ error: "Erro ao reordenar seções" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
});
