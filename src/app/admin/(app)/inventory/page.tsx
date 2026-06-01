/**
 * Page: /admin/inventory — alertas SCAFFOLD de estoque baixo.
 *
 * Server Component: busca product_variants WHERE stock_quantity < 10
 * com join em products para nome e código.
 * Ações de reposição desabilitadas — em desenvolvimento.
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { InventoryListClient } from "@features/admin/components/inventory/InventoryListClient";
import type { InventoryVariant } from "@features/admin/components/inventory/InventoryListClient";

export const dynamic = "force-dynamic";

export default async function AdminV2InventoryPage() {
  await requireAdmin("/admin/login");

  const supabase = getSupabaseServer();

  const { data: rawVariants } = await supabase
    .from("product_variants")
    .select(
      `
      id, product_id, color_name, color_hex, in_stock, stock_quantity,
      products ( name, code )
    `,
    )
    .lt("stock_quantity", 10)
    .order("stock_quantity", { ascending: true })
    .limit(500);

  const variants: InventoryVariant[] = (rawVariants ?? []).map((v) => {
    const product = v.products as unknown as { name: string; code: string | null } | null;
    return {
      id: v.id,
      product_id: v.product_id,
      product_name: product?.name ?? "Produto removido",
      product_code: product?.code ?? null,
      variant_code: null,
      color_name: v.color_name,
      color_hex: v.color_hex ?? "#888888",
      stock_quantity: v.stock_quantity ?? 0,
      in_stock: v.in_stock ?? null,
    };
  });

  return <InventoryListClient variants={variants} />;
}
