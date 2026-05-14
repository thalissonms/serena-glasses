"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { categoryCreateSchema, type CategoryCreateInput } from "@features/admin/schemas/category.schema";
import IconPicker from "./IconPicker";

const labelClass =
  "font-poppins text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block";
const inputClass =
  "w-full bg-[#1a1a1a] border-2 border-white/10 text-white font-inter text-sm px-3 py-2 outline-none focus:border-brand-pink transition-colors";
const errorClass = "font-inter text-xs text-red-400 mt-1";

export default function CategoryCreateForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(categoryCreateSchema),
    defaultValues: { kind: "category" as const, icon_name: "Glasses" as const },
  });

  const kind = watch("kind");

  async function onSubmit(data: CategoryCreateInput) {
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.status === 409) { toast.error("Slug já em uso"); return; }
    if (!res.ok) { toast.error("Erro ao salvar"); return; }
    const { id } = await res.json();
    toast.success("Categoria criada!");
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    router.push(`/admin/categories/${id}/edit`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-2xl">
      <div>
        <label className={labelClass}>Slug *</label>
        <input {...register("slug")} className={inputClass} placeholder="oculos-de-sol" />
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
          <label className={labelClass}>URL do link (href_override) *</label>
          <input
            {...register("href_override")}
            className={inputClass}
            placeholder="/products?outlet=true"
          />
        </div>
      )}

      <div>
        <label className={labelClass}>Ícone *</label>
        <Controller
          name="icon_name"
          control={control}
          render={({ field }) => (
            <IconPicker value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.icon_name && <p className={errorClass}>{errors.icon_name.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="self-start px-8 py-3 border-4 border-brand-pink bg-brand-pink text-white font-poppins font-black text-sm uppercase tracking-widest shadow-[4px_4px_0_#000] hover:translate-y-0.5 hover:shadow-[2px_2px_0_#000] transition-all disabled:opacity-60"
      >
        {isSubmitting ? "Salvando..." : "Criar"}
      </button>
    </form>
  );
}
