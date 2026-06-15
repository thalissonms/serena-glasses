/**
 * Page: /admin/coupons/[id] — formulário de edição de cupom existente.
 *
 * Carrega o cupom pelo id + listas de produtos e categorias em paralelo.
 * notFound() se o cupom não existir ou pertencer a outro tenant.
 *
 * Usado em: CouponsListClient → ação "Editar".
 */
import { notFound } from "next/navigation";
import { requireAdmin } from "@shared/lib/auth/admin";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import {
  CouponFormClient,
  type ProductOption,
  type CategoryOption,
  type CouponInitialData,
} from "@features/admin/components/coupons/CouponFormClient";

export default async function CouponEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin("/admin/login");
  const { id } = await params;
  const supabase = getSupabaseServer();

  const [{ data: coupon }, { data: products }, { data: categories }] = await Promise.all([
    supabase.from("coupons").select("*").eq("id", id).maybeSingle(),
    supabase.from("products").select("id, name, code").order("name"),
    supabase.from("categories").select("slug, name_pt").order("name_pt"),
  ]);

  if (!coupon) notFound();

  const productOptions: ProductOption[] = (products ?? []).map((p) => ({
    id: (p as { id: string }).id,
    name: (p as { name: string }).name,
    code: (p as { code: string | null }).code ?? null,
  }));

  const categoryOptions: CategoryOption[] = (categories ?? []).map((c) => ({
    slug: (c as { slug: string }).slug,
    name_pt: (c as { name_pt: string | null }).name_pt ?? (c as { slug: string }).slug,
  }));

  return (
    <div className="p-8">
      <CouponFormClient
        mode="edit"
        initialData={coupon as CouponInitialData}
        products={productOptions}
        categories={categoryOptions}
      />
    </div>
  );
}
