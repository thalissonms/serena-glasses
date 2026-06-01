import { NextResponse } from "next/server";
import { getSupabaseServer } from "@shared/lib/supabase/server";

export async function GET() {
  const supabase = getSupabaseServer();

  const [subcatsRes, shapesRes, colorsRes] = await Promise.all([
    supabase.from("subcategories").select("slug, name_pt, name_en, name_es"),
    supabase
      .from("products")
      .select("frame_shape")
      .eq("active", true)
      .not("frame_shape", "is", null),
    supabase
      .from("product_variants")
      .select("color_name, color_hex")
      .not("color_name", "is", null),
  ]);

  const shapes = [
    ...new Map(
      (shapesRes.data ?? []).map((r) => [
        r.frame_shape,
        { slug: r.frame_shape as string, label_pt: r.frame_shape as string },
      ])
    ).values(),
  ];

  const colors = [
    ...new Map(
      (colorsRes.data ?? []).map((r) => [
        r.color_name,
        { name: r.color_name as string, hex: r.color_hex as string },
      ])
    ).values(),
  ];

  const subcategories = (subcatsRes.data ?? []).map((r) => ({
    slug: r.slug as string,
    label_pt: r.name_pt as string,
    label_en: (r.name_en as string | null) ?? undefined,
    label_es: (r.name_es as string | null) ?? undefined,
  }));

  return NextResponse.json(
    { subcategories, shapes, colors },
    { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=60" } }
  );
}
