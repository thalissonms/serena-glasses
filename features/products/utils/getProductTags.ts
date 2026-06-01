import { discountPercentage } from "@features/products/utils/formatPrice";
import type { Product } from "@features/products/types";

export type ProductTag = {
  label: string;
  color: "pink" | "blue" | "black";
};

/**
 * Retorna as tags Y2K de destaque de um produto (isNew, isOutlet, desconto).
 * Centraliza lógica duplicada em PolaroidProductCard, ProductCard, ProductCardMobile e ProductInfo.
 */
export function getProductTags(product: Product): ProductTag[] {
  const tags: ProductTag[] = [];

  if (product.isNew) {
    tags.push({ label: "NEW", color: "pink" });
  }

  if (product.isOutlet) {
    tags.push({ label: "OUTLET", color: "blue" });
  }

  if (product.isOnSale && product.compareAtPrice) {
    const pct = discountPercentage(product.price, product.compareAtPrice);
    tags.push({ label: `-${pct}%`, color: "black" });
  }

  return tags;
}
