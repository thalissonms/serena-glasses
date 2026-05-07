import { Glasses, Sparkles, Gem } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ProductCategory } from "@features/products/types";

/**
 * Retorna o ícone Lucide correspondente a uma categoria de produto.
 * Para mapear por href de navegação, use getIconForHref em FilterProducts.
 */
export function getCategoryIcon(category: ProductCategory): LucideIcon {
  switch (category) {
    case "sunglasses":
      return Glasses;
    case "miniDrop":
      return Sparkles;
    case "accessories":
      return Gem;
    default:
      return Glasses;
  }
}
