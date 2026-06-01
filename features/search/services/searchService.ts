import type { SearchResult } from "../types/search.types";
import { searchProducts as searchProductsRaw } from "@features/products/services/productService";
import type { Product } from "@features/products/types/product.types";

function toSearchResult(p: Product): SearchResult {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    images: p.images.map((img) => ({
      url: img.url,
      alt: img.alt,
      isPrimary: img.isPrimary,
    })),
    category: p.category
      ? {
          label_pt: p.category.name_pt,
          label_en: p.category.name_en ?? undefined,
          label_es: p.category.name_es ?? undefined,
        }
      : undefined,
    subcategories: p.subcategories.map((s) => ({
      slug: s.slug,
      label_pt: s.name_pt,
      label_en: s.name_en ?? undefined,
      label_es: s.name_es ?? undefined,
    })),
    variants: p.variants.map((v) => ({
      color: { name: v.color.name, hex: v.color.hex, slug: v.color.slug },
    })),
    inStock: p.inStock,
  };
}

export async function searchProducts(params: {
  q: string;
  subcategory?: string | null;
  shape?: string | null;
  color?: string | null;
}): Promise<SearchResult[]> {
  const products = await searchProductsRaw(params);
  return products.map(toSearchResult);
}
