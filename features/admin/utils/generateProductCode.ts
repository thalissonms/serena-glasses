import { supabaseServer } from "@shared/lib/supabase/server";

const FALLBACK_PREFIX = "PRD";

function prefixFromSlug(slug: string): string {
  const clean = slug
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
  return clean.slice(0, 3) || FALLBACK_PREFIX;
}

async function resolvePrefix(categoryId: string | null | undefined): Promise<string> {
  if (!categoryId) return FALLBACK_PREFIX;
  const { data } = await supabaseServer
    .from("categories")
    .select("slug")
    .eq("id", categoryId)
    .maybeSingle();
  if (!data?.slug) return FALLBACK_PREFIX;
  return prefixFromSlug(data.slug);
}

async function nextSequence(prefix: string): Promise<number> {
  const { data } = await supabaseServer
    .from("products")
    .select("code")
    .like("code", `${prefix}-%`)
    .order("code", { ascending: false })
    .limit(1);

  if (!data || data.length === 0) return 1;

  const last = data[0].code as string | null;
  if (!last) return 1;

  const match = last.match(new RegExp(`^${prefix}-(\\d+)$`));
  if (!match) return 1;
  return parseInt(match[1], 10) + 1;
}

export async function generateNextProductCode(categoryId: string | null | undefined): Promise<string> {
  const prefix = await resolvePrefix(categoryId);
  const seq = await nextSequence(prefix);
  return `${prefix}-${String(seq).padStart(4, "0")}`;
}

export function generateVariantCode(productCode: string, colorName: string): string {
  const colorAbbr = colorName
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 3) || "VAR";
  return `${productCode}-${colorAbbr}`;
}

export async function uniqueVariantCode(productCode: string, colorName: string): Promise<string> {
  const base = generateVariantCode(productCode, colorName);

  const { data } = await supabaseServer
    .from("product_variants")
    .select("variant_code")
    .like("variant_code", `${base}%`);

  const existing = new Set(((data ?? []) as { variant_code: string | null }[])
    .map((r) => r.variant_code)
    .filter(Boolean));

  if (!existing.has(base)) return base;

  for (let i = 2; i < 100; i++) {
    const candidate = `${base}${i}`;
    if (!existing.has(candidate)) return candidate;
  }
  return `${base}${Date.now().toString(36).slice(-3).toUpperCase()}`;
}
