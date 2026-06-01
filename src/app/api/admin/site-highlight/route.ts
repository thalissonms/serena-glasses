import { NextResponse } from "next/server";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { withAdmin } from "@shared/lib/auth/withAdmin";

export const GET = withAdmin(async () => {
  const { data, error } = await getSupabaseServer()
    .from("site_highlight")
    .select("*")
    .eq("id", 1)
    .single();

  if (error && error.code !== "PGRST116") {
    // Ignore 'No rows found' error
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || null);
});

export const PUT = withAdmin(async (req) => {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const { image_url_light, image_url_dark } = body;

  if (!image_url_light || !image_url_dark) {
    return NextResponse.json({ error: "Both image_url_light and image_url_dark are required" }, { status: 400 });
  }

  const { data, error } = await getSupabaseServer()
    .from("site_highlight")
    .upsert({
      id: 1,
      image_url_light,
      image_url_dark,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
});
