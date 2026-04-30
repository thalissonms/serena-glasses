"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import StockBadge from "./StockBadge";
import type { VariantWithStockInterface } from "../types/productVariant.interface";

interface Props {
  variant: VariantWithStockInterface;
}

export default function VariantStockEditor({ variant }: Props) {
  const router = useRouter();
  const [stockQty, setStockQty] = useState<number>(variant.stock.total);
  const [inStock, setInStock] = useState<boolean>(variant.in_stock);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const dirty = stockQty !== variant.stock.total || inStock !== variant.in_stock;
  const liveAvailable = Math.max(0, stockQty - variant.stock.reserved);

  async function handleDelete() {
    if (!confirm(`Excluir a variante "${variant.color_name}"? Esta ação não pode ser desfeita.`)) return;
    setDeleting(true);

    const res = await fetch(`/api/admin/variants/${variant.id}`, { method: "DELETE" });

    if (res.ok) {
      toast.success(`Variante "${variant.color_name}" excluída`);
      router.refresh();
    } else {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error ?? "Falha ao excluir variante");
      setDeleting(false);
    }
  }

  async function save() {
    if (!dirty) return;
    setSaving(true);

    const res = await fetch(`/api/admin/variants/${variant.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock_quantity: stockQty, in_stock: inStock }),
    });

    if (res.ok) {
      toast.success(`Estoque de "${variant.color_name}" salvo`);
      router.refresh();
    } else {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error ?? "Falha ao salvar estoque");
    }

    setSaving(false);
  }

  return (
    <div className="border-2 border-white/10 bg-[#0f0f0f] p-4 flex flex-col gap-3">
      {/* Cor */}
      <div className="flex items-center gap-3">
        <span
          className="w-6 h-6 border-2 border-white/20 shrink-0"
          style={{ backgroundColor: variant.color_hex }}
          title={variant.color_hex}
        />
        <div className="flex-1">
          <p className="font-poppins font-bold text-sm text-white leading-none">
            {variant.color_name}
          </p>
          <p className="font-inter text-[10px] text-gray-600 mt-0.5">{variant.color_hex}</p>
        </div>
        <StockBadge
          stock={{ ...variant.stock, total: stockQty, available: liveAvailable }}
        />
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="font-poppins text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Estoque total
          </label>
          <input
            type="number"
            min={0}
            value={stockQty}
            onChange={(e) => setStockQty(Math.max(0, Number(e.target.value) || 0))}
            className="bg-[#0f0f0f] border-2 border-white/20 px-3 py-2 font-inter text-sm text-white outline-none focus:border-brand-pink transition-colors"
          />
          <p className="font-inter text-[10px] text-gray-600">
            {variant.stock.reserved} reservado{variant.stock.reserved !== 1 ? "s" : ""} em pedidos ativos
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-poppins text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Disponível para venda
          </label>
          <label className="inline-flex items-center gap-2 mt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="accent-brand-pink"
            />
            <span className="font-inter text-sm text-gray-300">
              {inStock ? "Vendendo" : "Pausado"}
            </span>
          </label>
          <p className="font-inter text-[10px] text-gray-600">
            Mesmo com estoque, pode pausar manualmente
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-1.5 px-3 py-1.5 font-poppins text-[10px] font-bold uppercase tracking-wider border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
        >
          {deleting ? <Loader2 size={10} className="animate-spin" /> : <Trash2 size={10} />}
          Excluir
        </button>

        <button
          type="button"
          onClick={save}
          disabled={!dirty || saving}
          className="flex items-center gap-1.5 px-4 py-2 font-poppins text-xs font-black uppercase tracking-wider border-2 border-brand-pink bg-brand-pink text-white hover:translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          Salvar
        </button>
      </div>
    </div>
  );
}
