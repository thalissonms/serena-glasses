/**
 * Page: /admin-v2/coupons/new — formulário de criação de cupom.
 *
 * Carrega lista de produtos (id, name, code) e categorias (slug, name_pt) em paralelo
 * para alimentar os multi-selects do campo applies_to no CouponFormClient.
 *
 * Usado em: CouponsListClient → botão "Novo Cupom".
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import {
  CouponFormClient,
  type ProductOption,
  type CategoryOption,
} from "@features/admin-v2/components/coupons/CouponFormClient";

export default async function CouponNewPage() {
  await requireAdmin("/admin-v2/login");
  const supabase = getSupabaseServer();

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from("products").select("id, name, code").order("name"),
    supabase.from("categories").select("slug, name_pt").order("name_pt"),
  ]);

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
        mode="create"
        products={productOptions}
        categories={categoryOptions}
      />
    </div>
  );
}
