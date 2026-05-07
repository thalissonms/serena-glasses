import { getSupabaseServer } from "@shared/lib/supabase/server";
import { STOCK_RESERVING_STATUSES } from "@features/admin/consts/products.const";

export interface StockShortageItem {
  variantId: string;
  productName: string;
  colorName: string;
  requested: number;
  available: number;
}

interface CheckItem {
  variantId: string;
  quantity: number;
  productName?: string;
}

/**
 * Verifica disponibilidade de cada item antes de criar pedido.
 * Retorna lista de itens com problema (vazia = OK pra prosseguir).
 *
 * NÃ£o usa lock transacional â€” race condition aceita por ora (MVP).
 */
export async function checkStockAvailability(
  items: CheckItem[],
): Promise<StockShortageItem[]> {
  if (items.length === 0) return [];

  const variantIds = items.map((i) => i.variantId);

  const { data: variantsData } = await getSupabaseServer()
    .from("product_variants")
    .select("id, color_name, stock_quantity, in_stock, product_id, products(name)")
    .in("id", variantIds);

  const { data: itemsData } = await getSupabaseServer()
    .from("order_items")
    .select("variant_id, quantity, orders!inner(status)")
    .in("variant_id", variantIds)
    .in("orders.status", STOCK_RESERVING_STATUSES as unknown as string[]);

  const reservedByVariant = new Map<string, number>();
  for (const row of (itemsData ?? []) as { variant_id: string; quantity: number }[]) {
    reservedByVariant.set(
      row.variant_id,
      (reservedByVariant.get(row.variant_id) ?? 0) + (row.quantity ?? 0),
    );
  }

  type DbVariant = {
    id: string;
    color_name: string;
    stock_quantity: number;
    in_stock: boolean;
    products: { name: string } | { name: string }[] | null;
  };
  const variantMap = new Map<string, DbVariant>();
  for (const v of (variantsData ?? []) as DbVariant[]) variantMap.set(v.id, v);

  const shortages: StockShortageItem[] = [];

  for (const item of items) {
    const v = variantMap.get(item.variantId);
    if (!v) {
      shortages.push({
        variantId: item.variantId,
        productName: item.productName ?? "Produto",
        colorName: "â€”",
        requested: item.quantity,
        available: 0,
      });
      continue;
    }

    const reserved = reservedByVariant.get(v.id) ?? 0;
    const available = Math.max(0, v.stock_quantity - reserved);
    const productName = Array.isArray(v.products)
      ? v.products[0]?.name
      : v.products?.name;

    if (!v.in_stock || item.quantity > available) {
      shortages.push({
        variantId: v.id,
        productName: productName ?? item.productName ?? "Produto",
        colorName: v.color_name,
        requested: item.quantity,
        available: v.in_stock ? available : 0,
      });
    }
  }

  return shortages;
}
