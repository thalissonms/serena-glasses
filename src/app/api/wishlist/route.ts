import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@shared/lib/supabase/server";

export async function GET(req: NextRequest) {
  const anonymous_id = req.nextUrl.searchParams.get("anonymous_id");
  if (!anonymous_id) return NextResponse.json([]);

  const { data, error } = await supabaseServer
    .from("wishlist_items")
    .select(`
      id,
      product_id,
      products (
        id, slug, name, price, compare_at_price,
        product_images (url, alt, position)
      )
    `)
    .eq("anonymous_id", anonymous_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const { anonymous_id, product_id } = await req.json();
  if (!anonymous_id || !product_id)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const { data: existing } = await supabaseServer
    .from("wishlist_items")
    .select("id")
    .eq("anonymous_id", anonymous_id)
    .eq("product_id", product_id)
    .maybeSingle();

  if (existing) return NextResponse.json({ ok: true });

  const { error } = await supabaseServer
    .from("wishlist_items")
    .insert({ anonymous_id, product_id });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { anonymous_id, product_id } = await req.json();
  if (!anonymous_id || !product_id)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const { error } = await supabaseServer
    .from("wishlist_items")
    .delete()
    .eq("anonymous_id", anonymous_id)
    .eq("product_id", product_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
