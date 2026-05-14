import type { Product } from "../types/product.types";

export type ListingParams = {
  category?: string;
  outlet?: string;
  sale?: string;
  new?: string;
  sort?: string;
  color?: string;
  shape?: string;
};

export function filterAndSortProducts(products: Product[], params: ListingParams): Product[] {
  let result = products.filter((p) => p.status === "active");

  if (params.category) result = result.filter((p) => p.category.slug === params.category);
  if (params.outlet === "true") result = result.filter((p) => p.isOutlet);
  if (params.sale === "true") result = result.filter((p) => p.isOnSale);
  if (params.new === "true") result = result.filter((p) => p.isNew);
  if (params.color) result = result.filter((p) => p.variants.some((v) => v.color.slug === params.color));
  if (params.shape) result = result.filter((p) => p.frameShape === params.shape);

  switch (params.sort) {
    case "price-asc":
      result = [...result].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result = [...result].sort((a, b) => b.price - a.price);
      break;
    case "newest":
      result = [...result].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      break;
    case "rating":
      result = [...result].sort((a, b) => b.rating.average - a.rating.average);
      break;
    default:
      result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  return result;
}
