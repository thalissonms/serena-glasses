import { LOW_STOCK_THRESHOLD } from "../consts/products.const";
import type { VariantStockType } from "../types/productVariant.interface";

interface Props {
  stock: VariantStockType;
  /** Se true, mostra "available / total" — senão só available */
  showFraction?: boolean;
}

export default function StockBadge({ stock, showFraction = true }: Props) {
  const { available, total, reserved } = stock;
  const empty = available <= 0;
  const low = !empty && available <= LOW_STOCK_THRESHOLD;

  const tone = empty
    ? "bg-red-500/20 text-red-300 border-red-500/40"
    : low
      ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/40"
      : "bg-green-500/20 text-green-300 border-green-500/40";

  const label = empty
    ? "Esgotado"
    : showFraction
      ? `${available} / ${total}`
      : String(available);

  return (
    <span
      title={`Disponível: ${available} • Reservado: ${reserved} • Total: ${total}`}
      className={`inline-flex items-center font-poppins text-[10px] font-bold uppercase tracking-wider px-2 py-1 border whitespace-nowrap ${tone}`}
    >
      {label}
    </span>
  );
}
