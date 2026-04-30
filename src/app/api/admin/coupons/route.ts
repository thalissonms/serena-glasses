import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@shared/lib/supabase/server";
import { withAdmin } from "@shared/lib/auth/withAdmin";
import { couponCreateSchema } from "@features/admin/schemas/couponCreate.schema";

export const GET = withAdmin(async () => {
  const { data, error } = await supabaseServer
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ coupons: data });
});

export const POST = withAdmin(async (req) => {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const parsed = couponCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const code = parsed.data.code.toUpperCase().trim();

  const { data: existing } = await supabaseServer
    .from("coupons")
    .select("id")
    .eq("code", code)
    .maybeSingle();

  if (existing) return NextResponse.json({ error: "Código já em uso" }, { status: 409 });

  const { data, error } = await supabaseServer
    .from("coupons")
    .insert({ ...parsed.data, code })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id }, { status: 201 });
});
