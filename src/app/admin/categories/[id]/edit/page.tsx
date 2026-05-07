import { requireAdmin } from "@shared/lib/auth/admin";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { notFound } from "next/navigation";
import CategoryEditForm from "@features/admin/components/CategoryEditForm";
import type { CategoryWithSubs } from "@features/categories/types/category.types";

export default async function AdminCategoryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const { data: cat } = await getSupabaseServer()
    .from("categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!cat) notFound();

  const { data: subs } = await getSupabaseServer()
    .from("subcategories")
    .select("*")
    .eq("category_id", id)
    .order("display_order", { ascending: true });

  const item: CategoryWithSubs = { ...cat, subcategories: subs ?? [] };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-poppins font-black text-2xl text-white uppercase tracking-widest mb-8">
          Editar Categoria
        </h1>
        <CategoryEditForm item={item} />
      </div>
    </div>
  );
}
