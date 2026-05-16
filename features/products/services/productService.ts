import { getSupabaseServer } from "@shared/lib/supabase/server";
import { STOCK_RESERVING_STATUSES } from "@features/admin/consts/products.const";
import type {
  Product,
  ProductVariant,
  ProductImage,
  ProductColor,
  CategoryRef,
  SubcategoryRef,
} from "../types/product.types";

type DbVariant = {
  id: string;
  color_name: string;
  color_hex: string;
  in_stock: boolean;
  stock_quantity: number;
};

type DbImage = {
  url: string;
  alt: string | null;
  position: number;
  variant_id: string | null;
};

type DbCategoryRef = {
  id: string;
  slug: string;
  name_pt: string;
  name_en: string | null;
  name_es: string | null;
};

type DbSubcategoryRef = DbCategoryRef & { display_order: number };

type DbProductSubcategoryJoin = {
  // Supabase pode retornar como array (1:N) ou objeto (1:1), dependendo da
  // forma do FK. Aceitamos ambos e normalizamos no mapeamento.
  subcategories: DbSubcategoryRef | DbSubcategoryRef[] | null;
};

type DbProduct = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  short_description: string | null;
  price: number;
  compare_at_price: number | null;
  category_id: string | null;
  categories: DbCategoryRef | DbCategoryRef[] | null;
  product_subcategories: DbProductSubcategoryJoin[] | null;
  is_outlet: boolean;
  is_sale: boolean;
  is_new: boolean;
  active: boolean;
  featured: boolean;
  frame_shape: string | null;
  frame_material: string | null;
  lens_type: string | null;
  tags: string[] | null;
  uv_protection: boolean;
  weight: number | null;
  dimensions: string | null;
  included_accessories: string[] | null;
  rating_average: number;
  rating_count: number;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[] | null;
  max_installments: number;
  video_url: string | null;
  created_at: string;
  updated_at: string;
  product_variants: DbVariant[];
  product_images: DbImage[];
};

function toColorSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
    .replace(/\s+/g, "-");
}

function pickCategoryRef(raw: DbProduct["categories"], productSlug: string): CategoryRef {
  const cat = Array.isArray(raw) ? raw[0] : raw;
  if (!cat) {
    // Dado inconsistente: produto sem FK pra categories. Sinaliza pra cima
    // ao invés de seguir silencioso — categoria é parte do contrato.
    throw new Error(`Product "${productSlug}" has no category join row.`);
  }
  return {
    id: cat.id,
    slug: cat.slug,
    name_pt: cat.name_pt,
    name_en: cat.name_en,
    name_es: cat.name_es,
  };
}

function mapSubcategories(rows: DbProductSubcategoryJoin[] | null): SubcategoryRef[] {
  if (!rows || rows.length === 0) return [];
  const subs: SubcategoryRef[] = [];
  for (const row of rows) {
    const sub = Array.isArray(row.subcategories) ? row.subcategories[0] : row.subcategories;
    if (!sub) continue;
    subs.push({
      id: sub.id,
      slug: sub.slug,
      name_pt: sub.name_pt,
      name_en: sub.name_en,
      name_es: sub.name_es,
      display_order: sub.display_order,
    });
  }
  return subs.sort((a, b) => a.display_order - b.display_order);
}

function mapProduct(p: DbProduct, reservedByVariant: Map<string, number>): Product {
  const images: ProductImage[] = [...p.product_images]
    .sort((a, b) => a.position - b.position)
    .map((img, i) => ({
      url: img.url,
      alt: img.alt ?? p.name,
      isPrimary: i === 0,
      order: img.position,
    }));

  const variants: ProductVariant[] = p.product_variants.map((v) => {
    const color: ProductColor = {
      name: v.color_name,
      hex: v.color_hex,
      slug: toColorSlug(v.color_name),
    };
    const variantImages = p.product_images
      .filter((img) => img.variant_id === v.id)
      .map((img) => img.url);

    const reserved = reservedByVariant.get(v.id) ?? 0;
    const available = Math.max(0, v.stock_quantity - reserved);
    const sellable = v.in_stock && available > 0;

    return {
      id: v.id,
      sku: "",
      color,
      inStock: sellable,
      stockQuantity: available,
      images: variantImages.length > 0 ? variantImages : images.map((i) => i.url),
    };
  });

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description ?? "",
    shortDescription: p.short_description ?? "",
    price: Math.round(p.price),
    compareAtPrice: p.compare_at_price ? Math.round(p.compare_at_price) : undefined,
    currency: "BRL",
    category: pickCategoryRef(p.categories, p.slug),
    subcategories: mapSubcategories(p.product_subcategories),
    frameShape: (p.frame_shape ?? "round") as Product["frameShape"],
    frameMaterial: (p.frame_material ?? "acetate") as Product["frameMaterial"],
    lensType: (p.lens_type ?? "solid") as Product["lensType"],
    tags: p.tags ?? [],
    images,
    variants,
    rating: { average: Number(p.rating_average), count: p.rating_count },
    seo: {
      title: p.seo_title ?? p.name,
      description: p.seo_description ?? "",
      keywords: p.seo_keywords ?? [],
    },
    inStock: variants.some((v) => v.inStock),
    stockQuantity: 0,
    status: p.active ? "active" : "archived",
    featured: p.featured,
    isNew: p.is_new,
    isOnSale: p.is_sale,
    isOutlet: p.is_outlet,
    maxInstallments: p.max_installments,
    uvProtection: p.uv_protection,
    weight: p.weight ?? undefined,
    dimensions: p.dimensions ?? undefined,
    includedAccessories: p.included_accessories ?? [],
    videoUrl: p.video_url ?? undefined,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

const SELECT = `
  *,
  categories ( id, slug, name_pt, name_en, name_es ),
  product_subcategories ( subcategories ( id, slug, name_pt, name_en, name_es, display_order ) ),
  product_variants(*),
  product_images(*)
`;

/**
 * Busca quantidade reservada (em pedidos nÃ£o-cancelados) por variant_id.
 * Usado pra calcular `available = stock_quantity - reserved`.
 */
async function loadReservedByVariant(variantIds: string[]): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  if (variantIds.length === 0) return map;

  const { data } = await getSupabaseServer()
    .from("order_items")
    .select("variant_id, quantity, orders!inner(status)")
    .in("variant_id", variantIds)
    .in("orders.status", STOCK_RESERVING_STATUSES as unknown as string[]);

  for (const row of (data ?? []) as { variant_id: string; quantity: number }[]) {
    map.set(row.variant_id, (map.get(row.variant_id) ?? 0) + (row.quantity ?? 0));
  }
  return map;
}

async function enrichWithStock(products: DbProduct[]): Promise<Product[]> {
  const variantIds = products.flatMap((p) => p.product_variants.map((v) => v.id));
  const reservedByVariant = await loadReservedByVariant(variantIds);
  return products.map((p) => mapProduct(p, reservedByVariant));
}

function sanitizeIlike(s: string): string {
  return s.replace(/[%_,]/g, (c) => `\\${c}`);
}

export async function searchProducts(params: {
  q: string;
  subcategory?: string | null;
  shape?: string | null;
  color?: string | null;
}): Promise<Product[]> {
  const safe = sanitizeIlike(params.q);

  let query = getSupabaseServer()
    .from("products")
    .select(SELECT)
    .eq("active", true)
    .or(
      `name.ilike.%${safe}%,short_description.ilike.%${safe}%,description.ilike.%${safe}%`
    )
    .limit(40);

  if (params.shape) query = query.eq("frame_shape", params.shape);

  const { data, error } = await query;
  if (error || !data) return [];

  let results = data as DbProduct[];

  if (params.subcategory) {
    const sub = params.subcategory;
    results = results.filter((p) =>
      (p.product_subcategories ?? []).some((ps) => {
        const s = Array.isArray(ps.subcategories) ? ps.subcategories[0] : ps.subcategories;
        return s?.slug === sub;
      })
    );
  }

  if (params.color) {
    const col = params.color.toLowerCase();
    results = results.filter((p) =>
      p.product_variants.some((v) => v.color_name.toLowerCase() === col)
    );
  }

  return enrichWithStock(results);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await getSupabaseServer()
    .from("products")
    .select(SELECT)
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (error || !data) return null;
  const enriched = await enrichWithStock([data as DbProduct]);
  return enriched[0] ?? null;
}

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await getSupabaseServer()
    .from("products")
    .select(SELECT)
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return enrichWithStock(data as DbProduct[]);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await getSupabaseServer()
    .from("products")
    .select(SELECT)
    .eq("active", true)
    .eq("featured", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return enrichWithStock(data as DbProduct[]);
}

export async function getNewProducts(): Promise<Product[]> {
  const { data, error } = await getSupabaseServer()
    .from("products")
    .select(SELECT)
    .eq("active", true)
    .eq("is_new", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return enrichWithStock(data as DbProduct[]);
}
