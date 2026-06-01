import clsx from "clsx";
import { ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { VariantWithStockInterface } from "../../types/product/productVariant.interface";
import {
  useToggleInVariantStock,
  useUpdateVariantStock,
} from "../../hooks/product/useProductVariantStock.hook";
import { isApiError } from "../../utils/isApiError";

export default function VariantCard({
  variant,
  onDelete,
  onUpdate,
}: {
  variant: VariantWithStockInterface;
  onDelete: (id: string) => void;
  onUpdate: (id: string, patch: Partial<VariantWithStockInterface>) => void;
}) {
  const [stockInput, setStockInput] = useState(String(variant.stock.total));
  const addMutation = useUpdateVariantStock(variant.id);
  const toggleMutation = useToggleInVariantStock(variant.id);

  async function saveStock() {
    const qty = parseInt(stockInput, 10);
    if (isNaN(qty) || qty < 0) {
      setStockInput(String(variant.stock.total));
      return;
    }

    if (qty === variant.stock.total) return;

    try {
      await addMutation.mutateAsync(qty);

      onUpdate(variant.id, {
        stock: {
          total: qty,
          reserved: variant.stock.reserved,
          available: Math.max(0, qty - variant.stock.reserved),
        },
      });

      toast.success("Estoque atualizado");
    } catch (err: unknown) {
      setStockInput(String(variant.stock.total));

      if (isApiError(err)) {
        toast.error(err.message);

        return;
      }
      toast.error("Erro inesperado");
    }
  }
  async function toggleInStock() {
    const next = !variant.in_stock;

    try {
      await toggleMutation.mutateAsync(next);

      onUpdate(variant.id, { in_stock: next });

      toast.success("Disponibilidade atualizada");
    } catch (err: unknown) {
      setStockInput(String(variant.stock.total));

      if (isApiError(err)) {
        toast.error(err.message);

        return;
      }
      toast.error("Erro inesperado");
    }
  }

  return (
    <div className="border border-white/8 bg-[#141414] p-4 flex flex-col gap-3 hover:border-white/12 transition-colors duration-150">
      <div className="flex items-center gap-3">
        <div
          className="w-7 h-7 border border-white/15 shrink-0"
          style={{ backgroundColor: variant.color_hex }}
          title={variant.color_hex}
        />
        <div className="flex-1 min-w-0">
          <p className="font-poppins font-semibold text-[12px] text-white truncate">
            {variant.color_name}
          </p>
          <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest">
            {variant.color_hex}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[8px] uppercase tracking-widest text-white/35 whitespace-nowrap">
            Estoque
          </span>
          <input
            type="number"
            min={0}
            value={stockInput}
            onChange={(e) => setStockInput(e.target.value)}
            onBlur={saveStock}
            disabled={addMutation.isPending}
            className={clsx(
              "w-16 bg-[#1a1a1a] border-2 border-[#FF00B6]/20 px-2 py-1",
              "font-mono text-[11px] text-white text-center outline-none",
              "focus:border-[#FF00B6] transition-colors duration-150",
              "disabled:opacity-50 [appearance:textfield]",
            )}
          />
        </div>
        <div className="flex items-center gap-3 font-mono text-[9px]">
          <span className="text-white/25">
            Res:{" "}
            <span className="text-[#FF00B6]/60">{variant.stock.reserved}</span>
          </span>
          <span className="text-white/25">
            Disp:{" "}
            <span className="text-[#00F0FF]/60">{variant.stock.available}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={toggleInStock}
          disabled={toggleMutation.isPending}
          className={clsx(
            "flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-widest",
            "transition-all duration-150 disabled:opacity-50",
            variant.in_stock
              ? "text-[#00F0FF]"
              : "text-white/25 hover:text-white/40",
          )}
        >
          {variant.in_stock ? (
            <ToggleRight size={14} />
          ) : (
            <ToggleLeft size={14} />
          )}
          {variant.in_stock ? "Em estoque" : "Fora de estoque"}
        </button>
        <button
          type="button"
          onClick={() => onDelete(variant.id)}
          className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-widest text-red-500/40 hover:text-red-400 transition-colors duration-150"
        >
          <Trash2 size={10} />
          Excluir
        </button>
      </div>
    </div>
  );
}
