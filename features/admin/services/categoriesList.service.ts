import { supabaseServer } from "@shared/lib/supabase/server";
import type { CategoryRow, SubcategoryRow, CategoryWithSubs } from "@features/categories/types/category.types";

export async function getCategoriesList(): Promise<CategoryRow[]> {
  const { data, error } = await supabaseServer
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as CategoryRow[];
}

export async function getCategoriesWithSubs(): Promise<CategoryWithSubs[]> {
  const { data: cats, error: catsErr } = await supabaseServer
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (catsErr) throw new Error(catsErr.message);

  const { data: subs, error: subsErr } = await supabaseServer
    .from("subcategories")
    .select("*")
    .order("display_order", { ascending: true });

  if (subsErr) throw new Error(subsErr.message);

  const subsMap = new Map<string, SubcategoryRow[]>();
  for (const sub of (subs ?? []) as SubcategoryRow[]) {
    const list = subsMap.get(sub.category_id) ?? [];
    list.push(sub);
    subsMap.set(sub.category_id, list);
  }

  return ((cats ?? []) as CategoryRow[]).map((cat) => ({
    ...cat,
    subcategories: subsMap.get(cat.id) ?? [],
  }));
}

export async function getActiveCategoriesWithSubs(): Promise<CategoryWithSubs[]> {
  const { data: cats, error: catsErr } = await supabaseServer
    .from("categories")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (catsErr) throw new Error(catsErr.message);

  const catIds = ((cats ?? []) as CategoryRow[]).map((c) => c.id);
  if (catIds.length === 0) return [];

  const { data: subs, error: subsErr } = await supabaseServer
    .from("subcategories")
    .select("*")
    .in("category_id", catIds)
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (subsErr) throw new Error(subsErr.message);

  const subsMap = new Map<string, SubcategoryRow[]>();
  for (const sub of (subs ?? []) as SubcategoryRow[]) {
    const list = subsMap.get(sub.category_id) ?? [];
    list.push(sub);
    subsMap.set(sub.category_id, list);
  }

  return ((cats ?? []) as CategoryRow[]).map((cat) => ({
    ...cat,
    subcategories: subsMap.get(cat.id) ?? [],
  }));
}
