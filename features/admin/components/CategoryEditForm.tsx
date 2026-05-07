"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import {
  categoryPatchSchema,
  subcategoryCreateSchema,
  type CategoryPatchInput,
  type SubcategoryCreateInput,
} from "@features/admin/schemas/category.schema";
import type { CategoryWithSubs, SubcategoryRow } from "@features/categories/types/category.types";
import IconPicker from "./IconPicker";

const labelClass =
  "font-poppins text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block";
const inputClass =
  "w-full bg-[#1a1a1a] border-2 border-white/10 text-white font-inter text-sm px-3 py-2 outline-none focus:border-brand-pink transition-colors";
const errorClass = "font-inter text-xs text-red-400 mt-1";

interface Props {
  item: CategoryWithSubs;
}

function SubcategoryInlineForm({
  categoryId,
  onCreated,
}: {
  categoryId: string;
  onCreated: (sub: SubcategoryRow) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubcategoryCreateInput>({ resolver: zodResolver(subcategoryCreateSchema) });

  async function onSubmit(data: SubcategoryCreateInput) {
    const res = await fetch(`/api/admin/categories/${categoryId}/subcategories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.status === 409) { toast.error("Slug já em uso nesta categoria"); return; }
    if (!res.ok) { toast.error("Erro ao criar subcategoria"); return; }
    const { id } = await res.json();
    toast.success("Subcategoria criada!");
    onCreated({ id, category_id: categoryId, ...data, name_en: data.name_en ?? null, name_es: data.name_es ?? null, display_order: 0, active: true, created_at: "", updated_at: "" });
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 items-start mt-3">
      <div className="flex-1">
        <input
          {...register("slug")}
          className={inputClass}
          placeholder="slug"
        />
        {errors.slug && <p className={errorClass}>{errors.slug.message}</p>}
      </div>
      <div className="flex-1">
        <input {...register("name_pt")} className={inputClass} placeholder="Nome PT" />
        {errors.name_pt && <p className={errorClass}>{errors.name_pt.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 border-2 border-brand-blue bg-brand-blue text-white font-poppins font-bold text-xs uppercase tracking-wider hover:opacity-90 disabled:opacity-60 whitespace-nowrap"
      >
        <Plus size={16} />
      </button>
    </form>
  );
}

export default function CategoryEditForm({ item }: Props) {
  const router = useRouter();
  const [subs, setSubs] = useState<SubcategoryRow[]>(item.subcategories);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(categoryPatchSchema),
    defaultValues: {
      slug: item.slug,
      name_pt: item.name_pt,
      name_en: item.name_en ?? undefined,
      name_es: item.name_es ?? undefined,
      icon_name: item.icon_name as never,
      kind: item.kind,
      href_override: item.href_override ?? undefined,
      active: item.active,
    },
  });

  const kind = watch("kind");

  async function onSubmit(data: CategoryPatchInput) {
    const res = await fetch(`/api/admin/categories/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) { toast.error("Erro ao salvar"); return; }
    toast.success("Salvo!");
  }

  async function deleteSub(subId: string) {
    const res = await fetch(`/api/admin/subcategories/${subId}`, { method: "DELETE" });
    if (!res.ok) { toast.error("Erro ao remover"); return; }
    setSubs((prev) => prev.filter((s) => s.id !== subId));
    toast.success("Subcategoria removida");
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div>
          <label className={labelClass}>Slug *</label>
          <input {...register("slug")} className={inputClass} />
          {errors.slug && <p className={errorClass}>{errors.slug.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Nome (PT) *</label>
          <input {...register("name_pt")} className={inputClass} />
          {errors.name_pt && <p className={errorClass}>{errors.name_pt.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Nome (EN)</label>
          <input {...register("name_en")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Nome (ES)</label>
          <input {...register("name_es")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Tipo *</label>
          <select {...register("kind")} className={inputClass}>
            <option value="category">Categoria</option>
            <option value="flag">Flag (link direto)</option>
          </select>
        </div>

        {kind === "flag" && (
          <div>
            <label className={labelClass}>URL do link (href_override)</label>
            <input {...register("href_override")} className={inputClass} />
          </div>
        )}

        <div>
          <label className={labelClass}>Ícone *</label>
          <Controller
            name="icon_name"
            control={control}
            render={({ field }) => (
              <IconPicker value={field.value ?? item.icon_name} onChange={field.onChange} />
            )}
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            {...register("active")}
            className="w-4 h-4 accent-brand-pink cursor-pointer"
            id="cat-active"
          />
          <label htmlFor="cat-active" className="font-inter text-sm text-white cursor-pointer">
            Ativo
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 border-4 border-brand-pink bg-brand-pink text-white font-poppins font-black text-sm uppercase tracking-widest shadow-[4px_4px_0_#000] hover:translate-y-0.5 hover:shadow-[2px_2px_0_#000] transition-all disabled:opacity-60"
          >
            {isSubmitting ? "Salvando..." : "Salvar"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/categories")}
            className="px-6 py-3 border-2 border-white/20 text-gray-400 font-poppins text-sm uppercase tracking-wider hover:border-white/40 hover:text-white transition-colors"
          >
            Voltar
          </button>
        </div>
      </form>

      {item.kind === "category" && (
        <div>
          <h2 className="font-poppins font-bold text-sm text-white uppercase tracking-wider mb-3">
            Subcategorias
          </h2>

          <div className="flex flex-col gap-2">
            {subs.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between px-4 py-3 border-2 border-white/10 bg-[#1a1a1a]"
              >
                <div>
                  <span className="font-inter text-sm text-white">{sub.name_pt}</span>
                  <span className="font-inter text-xs text-gray-500 ml-2">/{sub.slug}</span>
                  {!sub.active && (
                    <span className="ml-2 font-inter text-[10px] text-red-400 uppercase">
                      inativo
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => deleteSub(sub.id)}
                  className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                  title="Remover subcategoria"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          <SubcategoryInlineForm
            categoryId={item.id}
            onCreated={(sub) => setSubs((prev) => [...prev, sub])}
          />
        </div>
      )}
    </div>
  );
}
