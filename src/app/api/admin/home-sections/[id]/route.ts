import { NextResponse } from "next/server";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { withAdmin } from "@shared/lib/auth/withAdmin";
import { homeSectionUpdateSchema } from "@features/admin/schemas/homeSection.schema";

export const PATCH = withAdmin(async (req, { params }) => {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const parsed = homeSectionUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { product_ids, ...sectionData } = parsed.data;
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from("home_sections")
    .update(sectionData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("PATCH /api/admin/home-sections/[id] error:", error);
    return NextResponse.json({ error: "Erro ao atualizar seção" }, { status: 500 });
  }

  // Se product_ids foi enviado, atualizamos os vínculos
  if (product_ids !== undefined) {
    // 1. Deletar os antigos
    await supabase.from("home_section_products").delete().eq("section_id", id);

    // 2. Inserir os novos (se houver)
    if (product_ids.length > 0) {
      const productsPayload = product_ids.map((pid, index) => ({
        section_id: id,
        product_id: pid,
        position: index,
      }));
      const { error: productsError } = await supabase
        .from("home_section_products")
        .insert(productsPayload);

      if (productsError) {
        console.error("PATCH home_section_products error:", productsError);
      }
    }
  }

  return NextResponse.json(data);
});

export const DELETE = withAdmin(async (req, { params }) => {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  const { error } = await getSupabaseServer()
    .from("home_sections")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("DELETE /api/admin/home-sections/[id] error:", error);
    return NextResponse.json({ error: "Erro ao deletar seção" }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
});
