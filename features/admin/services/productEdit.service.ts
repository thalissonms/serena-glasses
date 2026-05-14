import { getSupabaseServer } from "@shared/lib/supabase/server";
import { STOCK_RESERVING_STATUSES } from "../consts/products.const";
import type { VariantWithStockInterface } from "../types/productVariant.interface";
import type { ProductImageInterface } from "../types/productImage.interface";
import type { CategoryRef } from "@features/products/types/product.types";

export interface ProductEditData {
  id: string;
  name: string;
  slug: string;
  code: string | null;
  description: string | null;
  short_description: string | null;
  price: number;
  compare_at_price: number | null;
  category_id: string | null;
  category: CategoryRef | null;
  subcategory_ids: string[];
  frame_shape: string | null;
  frame_material: string | null;
  lens_type: string | null;
  uv_protection: boolean;
  weight: number | null;
  dimensions: string | null;
  tags: string[] | null;
  included_accessories: string[] | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[] | null;
  video_url: string | null;
  variants: VariantWithStockInterface[];
  images: ProductImageInterface[];
}

export async function getProductForEdit(id: string): Promise<ProductEditData | null> {
  const { data: product } = await getSupabaseServer()
    .from("products")
    .select(
      `
      id, name, slug, code, description, short_description,
      price, compare_at_price, category_id,
      categories ( id, slug, name_pt, name_en, name_es ),
      product_subcategories ( subcategory_id ),
      frame_shape, frame_material, lens_type,
      uv_protection, weight, dimensions,
      tags, included_accessories,
      seo_title, seo_description, seo_keywords, video_url,
      product_variants (id, color_name, color_hex, in_stock, stock_quantity),
      product_images (id, url, alt, position)
`,
    )
    .eq("id", id)
    .single();

  if (!product) return null;

  type DbVariant = {
    id: string;
    color_name: string;
    color_hex: string;
    in_stock: boolean;
    stock_quantity: number;
  };

  const variants = (product.product_variants ?? []) as DbVariant[];
  const variantIds = variants.map((v) => v.id);

  const reservedByVariant = new Map<string, number>();
  if (variantIds.length > 0) {
    const { data: itemsData } = await getSupabaseServer()
      .from("order_items")
      .select("variant_id, quantity, orders!inner(status)")
      .in("variant_id", variantIds)
      .in("orders.status", STOCK_RESERVING_STATUSES as unknown as string[]);

    for (const row of (itemsData ?? []) as { variant_id: string; quantity: number }[]) {
      reservedByVariant.set(
        row.variant_id,
        (reservedByVariant.get(row.variant_id) ?? 0) + (row.quantity ?? 0),
      );
    }
  }

  const variantsWithStock: VariantWithStockInterface[] = variants.map((v) => {
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
  });

  type DbImage = { id: string; url: string; alt: string | null; position: number };
  const images: ProductImageInterface[] = [...((product.product_images ?? []) as DbImage[])]
    .sort((a, b) => a.position - b.position);

  type DbCategoryRef = {
    id: string;
    slug: string;
    name_pt: string;
    name_en: string | null;
    name_es: string | null;
  };
  const rawCategories = (product as { categories?: DbCategoryRef | DbCategoryRef[] | null })
    .categories;
  const categoryRow = Array.isArray(rawCategories) ? rawCategories[0] : rawCategories ?? null;
  const category: CategoryRef | null = categoryRow
    ? {
        id: categoryRow.id,
        slug: categoryRow.slug,
        name_pt: categoryRow.name_pt,
        name_en: categoryRow.name_en,
        name_es: categoryRow.name_es,
      }
    : null;

  type DbProductSubcat = { subcategory_id: string };
  const subcategoryRows = (
    product as { product_subcategories?: DbProductSubcat[] | null }
  ).product_subcategories ?? [];
  const subcategory_ids = subcategoryRows.map((ps) => ps.subcategory_id);

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    code: product.code,
    description: product.description,
    short_description: product.short_description,
    price: product.price,
    compare_at_price: product.compare_at_price,
    category_id: (product as { category_id: string | null }).category_id,
    category,
    subcategory_ids,
    frame_shape: product.frame_shape,
    frame_material: product.frame_material,
    lens_type: product.lens_type,
    uv_protection: product.uv_protection,
    weight: product.weight,
    dimensions: product.dimensions,
    tags: product.tags,
    included_accessories: product.included_accessories,
    seo_title: product.seo_title,
    seo_description: product.seo_description,
    seo_keywords: product.seo_keywords,
    video_url: product.video_url,
    variants: variantsWithStock,
    images,
  };
}
