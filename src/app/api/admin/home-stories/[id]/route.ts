import { NextResponse } from "next/server";
import { withAdmin } from "@shared/lib/auth/withAdmin";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { homeStoryPatchSchema } from "@features/admin/schemas/homeStory.schema";

export const PATCH = withAdmin<{ id: string }>(async (req, { params }) => {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const parsed = homeStoryPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { error } = await getSupabaseServer()
    .from("home_stories")
    .update(parsed.data)
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
});

export const DELETE = withAdmin<{ id: string }>(async (_req, { params }) => {
  const { id } = await params;
  const { error } = await getSupabaseServer().from("home_stories").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
});
