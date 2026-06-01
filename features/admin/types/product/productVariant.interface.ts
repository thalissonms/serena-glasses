export interface VariantStockType {
  total: number;
  reserved: number;
  available: number;
}

export interface VariantWithStockInterface {
  id: string;
  color_name: string;
  color_hex: string;
  in_stock: boolean;
  stock: VariantStockType;
}
