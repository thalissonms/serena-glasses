import { NextResponse } from "next/server";
import { withAdmin } from "@shared/lib/auth/withAdmin";
import { supabaseServer } from "@shared/lib/supabase/server";
import { SETTING_SCHEMAS, type SettingKey } from "@features/admin/schemas/siteSettings.schema";

export const PATCH = withAdmin<{ key: string }>(async (req, { params }) => {
  const { key } = await params;

  if (!(key in SETTING_SCHEMAS)) {
    return NextResponse.json({ error: "Unknown setting key" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const schema = SETTING_SCHEMAS[key as SettingKey];
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { error } = await supabaseServer
    .from("site_settings")
    .update({ value: parsed.data, updated_at: new Date().toISOString() })
    .eq("key", key);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
});
