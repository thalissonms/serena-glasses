import { getSupabaseServer } from "@shared/lib/supabase/server";
import type { SettingKey, SettingValue } from "@features/admin/schemas/siteSettings.schema";

export interface SiteSettingRow {
  key: string;
  value: unknown;
  description: string | null;
  updated_at: string;
}

export async function getSetting<K extends SettingKey>(key: K): Promise<SettingValue<K> | null> {
  const { data, error } = await getSupabaseServer()
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data?.value ?? null) as SettingValue<K> | null;
}

export async function getAllSettings(): Promise<Record<string, unknown>> {
  const { data, error } = await getSupabaseServer()
    .from("site_settings")
    .select("key, value, description, updated_at")
    .order("key", { ascending: true });

  if (error) throw new Error(error.message);
  return Object.fromEntries((data ?? []).map((row) => [row.key, row.value]));
}

export async function getAllSettingRows(): Promise<SiteSettingRow[]> {
  const { data, error } = await getSupabaseServer()
    .from("site_settings")
    .select("key, value, description, updated_at")
    .order("key", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as SiteSettingRow[];
}
