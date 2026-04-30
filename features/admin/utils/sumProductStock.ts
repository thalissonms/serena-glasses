import type { VariantWithStockInterface } from "../types/productVariant.interface";
import type { VariantStockType } from "../types/productVariant.interface";

/**
 * Soma o estoque de todas as variantes de um produto.
 * Usado na listagem (resumo) — o detalhe vai pra página edit.
 */
export function sumProductStock(variants: VariantWithStockInterface[]): VariantStockType {
  return variants.reduce(
    (acc, v) => ({
      total: acc.total + v.stock.total,
      reserved: acc.reserved + v.stock.reserved,
      available: acc.available + v.stock.available,
    }),
    { total: 0, reserved: 0, available: 0 },
  );
}
