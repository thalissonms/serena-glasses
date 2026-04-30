import type { VariantWithStockInterface } from "./productVariant.interface";

export interface ProductImageType {
  url: string;
  alt: string | null;
  position: number;
}

export interface ProductType {
  id: string;
  name: string;
  slug: string;
  price: number;
  active: boolean;
  featured: boolean;
  category: string;
  is_new: boolean;
  is_sale: boolean;
  is_outlet: boolean;
  product_images: ProductImageType[] | null;
  product_variants: VariantWithStockInterface[];
}
