/**
 * Page: /admin/categories/[id] — edição de categoria com subcategorias inline.
 *
 * Server Component: carrega a categoria específica + suas subs via Supabase direto.
 */
import { notFound } from "next/navigation";
import { requireAdmin } from "@shared/lib/auth/admin";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import type { CategoryRow, SubcategoryRow, CategoryWithSubs } from "@features/categories/types/category.types";
import CategoryEditClient from "@features/admin/components/categories/CategoryEditClient";

export default async function AdminV2CategoryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin("/admin/login");
  const { id } = await params;
  const db = getSupabaseServer();

  const [catResult, subsResult] = await Promise.all([
    db.from("categories").select("*").eq("id", id).single(),
    db.from("subcategories").select("*").eq("category_id", id).order("display_order", { ascending: true }),
  ]);

  if (catResult.error || !catResult.data) notFound();

  const category: CategoryWithSubs = {
    ...(catResult.data as CategoryRow),
    subcategories: (subsResult.data ?? []) as SubcategoryRow[],
  };

  return <CategoryEditClient category={category} />;
}
