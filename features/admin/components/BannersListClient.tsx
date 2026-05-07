"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, Edit2, Trash2 } from "lucide-react";
import type { SiteBannerRow } from "@features/home/types/siteBanner.types";

interface Props {
  initialItems: SiteBannerRow[];
}

export default function BannersListClient({ initialItems }: Props) {
  const [items, setItems] = useState(initialItems);

  async function handleDelete(id: string) {
    if (!confirm("Excluir este banner?")) return;
    const res = await fetch(`/api/admin/site-banners/${id}`, { method: "DELETE" });
    if (!res.ok) { toast.error("Erro ao excluir"); return; }
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("Banner excluído");
  }

  async function handleToggleActive(item: SiteBannerRow) {
    const res = await fetch(`/api/admin/site-banners/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !item.active }),
    });
    if (!res.ok) { toast.error("Erro ao atualizar"); return; }
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, active: !i.active } : i));
    toast.success(item.active ? "Banner desativado" : "Banner ativado");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-poppins font-black text-2xl text-white uppercase tracking-widest">
            Banners
          </h1>
          <Link
            href="/admin/banners/new"
            className="flex items-center gap-2 px-5 py-2.5 border-4 border-brand-pink bg-brand-pink text-white font-poppins font-black text-xs uppercase tracking-widest shadow-[4px_4px_0_#000] hover:translate-y-0.5 hover:shadow-[2px_2px_0_#000] transition-all"
          >
            <Plus size={16} />
            Novo
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 px-4 py-3 border-2 border-white/10 bg-[#111] hover:bg-[#181818] transition-colors"
            >
              {/* Color swatch */}
              <div
                className="w-6 h-6 shrink-0 border border-white/20"
                style={{ backgroundColor: item.bg_color }}
              />

              <div className="flex-1 min-w-0">
                <span className="font-poppins font-bold text-sm text-white truncate block">
                  {item.message_pt}
                </span>
                {item.link_url && (
                  <span className="font-inter text-xs text-gray-500 truncate block">{item.link_url}</span>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleActive(item)}
                  className={`font-inter text-[10px] uppercase px-2 py-0.5 border cursor-pointer transition-colors ${
                    item.active
                      ? "border-brand-pink/50 text-brand-pink hover:border-red-500 hover:text-red-500"
                      : "border-white/20 text-gray-500 hover:border-green-500 hover:text-green-500"
                  }`}
                >
                  {item.active ? "ativo" : "inativo"}
                </button>

                <Link
                  href={`/admin/banners/${item.id}/edit`}
                  className="p-1.5 border-2 border-white/10 text-gray-400 hover:border-brand-pink hover:text-brand-pink transition-colors"
                >
                  <Edit2 size={14} />
                </Link>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 border-2 border-white/10 text-gray-400 hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <p className="font-inter text-sm text-gray-500 text-center py-16">
            Nenhum banner. Crie o primeiro.
          </p>
        )}
      </div>
    </div>
  );
}
