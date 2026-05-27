import type { VariantWithStockInterface } from "./productVariant.interface";
import type { CategoryRef } from "@features/products/types/product.types";

export interface ProductImageType {
  url: string;
  alt: string | null;
  position: number;
}

export interface ProductType {
  id: string;
  name: string;
  slug: string;
  code: string | null;
  price: number;
  active: boolean;
  featured: boolean;
  category: CategoryRef | null;
  is_new: boolean;
  is_sale: boolean;
  is_outlet: boolean;
  product_images: ProductImageType[] | null;
  product_variants: VariantWithStockInterface[];
}
