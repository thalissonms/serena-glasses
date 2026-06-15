import { NextResponse } from "next/server";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { withAdmin } from "@shared/lib/auth/withAdmin";
import { homeSectionCreateSchema } from "@features/admin/schemas/homeSection.schema";

export const GET = withAdmin(async () => {
  const { data, error } = await getSupabaseServer()
    .from("home_sections")
    .select("*, subcategories(name_pt), categories(name_pt), home_section_products(product_id, position)")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("GET /api/admin/home-sections error:", error);
    return NextResponse.json({ error: "Erro ao buscar seções da home" }, { status: 500 });
  }

  return NextResponse.json(data);
});

export const POST = withAdmin(async (req) => {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const parsed = homeSectionCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // Descobre qual o próximo display_order se não for enviado
  let order = parsed.data.display_order;
  if (order === 0) {
    const { data: maxOrderData } = await getSupabaseServer()
      .from("home_sections")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (maxOrderData) {
      order = maxOrderData.display_order + 1;
    }
  }

  const { product_ids, ...sectionData } = parsed.data;

  const payload = {
    ...sectionData,
    display_order: order,
  };

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("home_sections")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("POST /api/admin/home-sections error:", error);
    return NextResponse.json({ error: "Erro ao criar seção da home" }, { status: 500 });
  }

  if (product_ids && product_ids.length > 0) {
    const productsPayload = product_ids.map((id, index) => ({
      section_id: data.id,
      product_id: id,
      position: index,
    }));
    
    const { error: productsError } = await supabase
      .from("home_section_products")
      .insert(productsPayload);
      
    if (productsError) {
      console.error("POST home_section_products error:", productsError);
      // We don't fail the whole request, but it's an issue.
    }
  }

  return NextResponse.json(data, { status: 201 });
});
