import { NextResponse } from "next/server";
import { getSetting } from "@features/admin/services/siteSettings.service";
import { SETTING_SCHEMAS, type SettingKey } from "@features/admin/schemas/siteSettings.schema";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;

  if (!(key in SETTING_SCHEMAS)) {
    return NextResponse.json({ error: "Unknown setting key" }, { status: 404 });
  }

  try {
    const value = await getSetting(key as SettingKey);
    if (value === null) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ key, value });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
