"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface Props {
  productId: string;
}

export default function VariantCreateForm({ productId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#000000");
  const [hexInput, setHexInput] = useState("#000000");
  const [inStock, setInStock] = useState(true);

  function handleHexInput(value: string) {
    setHexInput(value);
    if (/^#[0-9a-fA-F]{6}$/.test(value)) setColorHex(value);
  }

  function handleColorPicker(value: string) {
    setColorHex(value);
    setHexInput(value);
  }

  function reset() {
    setColorName("");
    setColorHex("#000000");
    setHexInput("#000000");
    setInStock(true);
    setOpen(false);
  }

  async function handleSubmit() {
    if (!colorName.trim()) { toast.error("Nome da cor é obrigatório"); return; }
    if (!/^#[0-9a-fA-F]{6}$/.test(colorHex)) { toast.error("Hex inválido"); return; }

    setSaving(true);

    const res = await fetch(`/api/admin/products/${productId}/variants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ color_name: colorName.trim(), color_hex: colorHex, in_stock: inStock }),
    });

    if (res.ok) {
      toast.success(`Variante "${colorName.trim()}" criada`);
      reset();
      router.refresh();
    } else {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error ?? "Falha ao criar variante");
    }

    setSaving(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 font-poppins text-[10px] font-bold uppercase tracking-wider border-2 border-dashed border-white/20 text-gray-500 px-3 py-2 hover:border-brand-pink/60 hover:text-brand-pink transition-colors"
      >
        <Plus size={10} /> Adicionar cor
      </button>
    );
  }

  return (
    <div className="border-2 border-white/10 bg-[#0a0a0a] p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-poppins text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Nova variante
        </span>
        <button type="button" onClick={reset} className="text-gray-600 hover:text-white transition-colors">
          <X size={14} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Nome */}
        <div className="flex flex-col gap-1">
          <label className="font-poppins text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Nome da cor
          </label>
          <input
            type="text"
            value={colorName}
            onChange={(e) => setColorName(e.target.value)}
            placeholder="Ex: Preto Fosco"
            maxLength={60}
            autoFocus
            className="bg-[#0f0f0f] border-2 border-white/20 px-3 py-2 font-inter text-sm text-white placeholder:text-gray-600 outline-none focus:border-brand-pink transition-colors"
          />
        </div>

        {/* Hex */}
        <div className="flex flex-col gap-1">
          <label className="font-poppins text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Cor (hex)
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={colorHex}
              onChange={(e) => handleColorPicker(e.target.value)}
              className="w-10 h-10 border-2 border-white/20 bg-transparent cursor-pointer p-0.5"
            />
            <input
              type="text"
              value={hexInput}
              onChange={(e) => handleHexInput(e.target.value)}
              maxLength={7}
              placeholder="#000000"
              className="flex-1 bg-[#0f0f0f] border-2 border-white/20 px-3 py-2 font-inter text-sm text-white placeholder:text-gray-600 outline-none focus:border-brand-pink transition-colors uppercase"
            />
          </div>
        </div>
      </div>

      {/* In stock */}
      <label className="inline-flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) => setInStock(e.target.checked)}
          className="accent-brand-pink"
        />
        <span className="font-inter text-sm text-gray-300">Disponível para venda</span>
      </label>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 font-poppins text-xs font-black uppercase tracking-wider border-2 border-brand-pink bg-brand-pink text-white hover:translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
          Criar
        </button>
      </div>
    </div>
  );
}
