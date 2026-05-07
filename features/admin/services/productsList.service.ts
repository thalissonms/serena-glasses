import { supabaseServer } from "@shared/lib/supabase/server";
import { STOCK_RESERVING_STATUSES } from "../consts/products.const";
import type { ProductType } from "../types/products.type";

type DbVariant = {
  id: string;
  color_name: string;
  color_hex: string;
  in_stock: boolean;
  stock_quantity: number;
};

type DbProductRow = {
  id: string;
  name: string;
  slug: string;
  code: string | null;
  price: number;
  active: boolean;
  featured: boolean;
  category: string;
  is_new: boolean;
  is_sale: boolean;
  is_outlet: boolean;
  product_images: { url: string; alt: string | null; position: number }[] | null;
  product_variants: DbVariant[] | null;
};

/**
 * Lista produtos pro admin com estoque agregado por variante.
 * Calcula reserved/available a partir de order_items + orders (status != cancelled).
 */
export async function getProductsList(): Promise<ProductType[]> {
  const { data: productsData } = await supabaseServer
    .from("products")
    .select(
      `
      id, name, slug, code, price, active, featured, category, is_new, is_sale, is_outlet,
      product_images (url, alt, position),
      product_variants (id, color_name, color_hex, in_stock, stock_quantity)
      `,
    )
    .order("created_at", { ascending: false });

  const products = (productsData ?? []) as DbProductRow[];

  const variantIds = products.flatMap((p) => p.product_variants?.map((v) => v.id) ?? []);

  // Agrega quantidade reservada por variant_id (status != cancelled)
  const reservedByVariant = new Map<string, number>();
  if (variantIds.length > 0) {
    const { data: itemsData } = await supabaseServer
      .from("order_items")
      .select("variant_id, quantity, orders!inner(status)")
      .in("variant_id", variantIds)
      .in("orders.status", STOCK_RESERVING_STATUSES as unknown as string[]);

    for (const row of (itemsData ?? []) as { variant_id: string; quantity: number }[]) {
      const prev = reservedByVariant.get(row.variant_id) ?? 0;
      reservedByVariant.set(row.variant_id, prev + (row.quantity ?? 0));
    }
  }

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    code: p.code,
    price: p.price,
    active: p.active,
    featured: p.featured,
    category: p.category,
    is_new: p.is_new,
    is_sale: p.is_sale,
    is_outlet: p.is_outlet,
    product_images: p.product_images,
    product_variants: (p.product_variants ?? []).map((v) => {
      const reserved = reservedByVariant.get(v.id) ?? 0;
      return {
        id: v.id,
        color_name: v.color_name,
        color_hex: v.color_hex,
        in_stock: v.in_stock,
        stock: {
          total: v.stock_quantity,
          reserved,
          available: Math.max(0, v.stock_quantity - reserved),
        },
      };
    }),
  }));
}
