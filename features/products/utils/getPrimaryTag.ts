import { pickLocale } from "@shared/utils/pickLocale";
import type { Product } from "@features/products/types/product.types";

export function getPrimaryTag(product: Product, lang: string): string {
  const sub = product.subcategories[0];
  return sub ? pickLocale(sub, lang) : pickLocale(product.category, lang);
}
