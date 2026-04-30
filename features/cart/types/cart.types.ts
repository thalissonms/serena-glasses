export interface CartItem {
  variantId: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  image: string;
  color: { name: string; hex: string };
}
