"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { homeStoryPatchSchema, type HomeStoryPatchInput } from "@features/admin/schemas/homeStory.schema";
import type { HomeStoryRow } from "@features/home/types/homeStory.types";

const labelClass =
  "font-poppins text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block";
const inputClass =
  "w-full bg-[#1a1a1a] border-2 border-white/10 text-white font-inter text-sm px-3 py-2 outline-none focus:border-brand-pink transition-colors";
const errorClass = "font-inter text-xs text-red-400 mt-1";

interface Props {
  story: HomeStoryRow;
}

export default function StoryEditForm({ story }: Props) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(homeStoryPatchSchema),
    defaultValues: {
      active: story.active,
      display_order: story.display_order,
      starts_at: story.starts_at ?? undefined,
      ends_at: story.ends_at ?? undefined,
      cta_url: story.cta_url ?? undefined,
      cta_label_pt: story.cta_label_pt ?? undefined,
      title_pt: story.title_pt ?? undefined,
      subtitle_pt: story.subtitle_pt ?? undefined,
      avatar_label: story.avatar_label ?? undefined,
      media_url: story.media_url ?? undefined,
    },
  });

  async function onSubmit(data: HomeStoryPatchInput) {
    const res = await fetch(`/api/admin/home-stories/${story.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) { toast.error("Erro ao salvar"); return; }
    toast.success("Story atualizada!");
    router.push("/admin/stories");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-2xl">
      <div className="px-4 py-3 bg-[#1a1a1a] border-l-4 border-brand-blue">
        <p className="font-inter text-xs text-gray-400">
          Tipo: <span className="text-white font-bold">{story.kind}</span>
          {story.kind === "product" && story.product_id && (
            <> &nbsp;·&nbsp; Produto: <span className="text-brand-pink">{story.product_id.slice(0, 8)}…</span></>
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Ordem de exibição</label>
          <input
            {...register("display_order", { valueAsNumber: true })}
            type="number"
            min={0}
            className={inputClass}
          />
          {errors.display_order && <p className={errorClass}>{errors.display_order.message}</p>}
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register("active")} className="w-4 h-4 accent-brand-pink" />
            <span className={labelClass.replace("mb-1 block", "")}>Ativo</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Início (opcional)</label>
          <input {...register("starts_at")} type="datetime-local" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Fim (opcional)</label>
          <input {...register("ends_at")} type="datetime-local" className={inputClass} />
        </div>
      </div>

      {story.kind === "manual" && (
        <>
          <div>
            <label className={labelClass}>URL da mídia</label>
            <input {...register("media_url")} className={inputClass} placeholder="https://..." />
            {errors.media_url && <p className={errorClass}>{errors.media_url.message}</p>}
          </div>

          <div>
            <label className={labelClass}>URL do CTA</label>
            <input {...register("cta_url")} className={inputClass} placeholder="https://..." />
            {errors.cta_url && <p className={errorClass}>{errors.cta_url.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Label CTA (PT)</label>
            <input {...register("cta_label_pt")} className={inputClass} />
            {errors.cta_label_pt && <p className={errorClass}>{errors.cta_label_pt.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Título (PT)</label>
            <input {...register("title_pt")} className={inputClass} />
            {errors.title_pt && <p className={errorClass}>{errors.title_pt.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Subtítulo (PT)</label>
            <input {...register("subtitle_pt")} className={inputClass} />
            {errors.subtitle_pt && <p className={errorClass}>{errors.subtitle_pt.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Label do avatar (máx 4 chars)</label>
            <input {...register("avatar_label")} className={inputClass} placeholder="NEW" maxLength={4} />
            {errors.avatar_label && <p className={errorClass}>{errors.avatar_label.message}</p>}
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="self-start px-8 py-3 border-4 border-brand-pink bg-brand-pink text-white font-poppins font-black text-sm uppercase tracking-widest shadow-[4px_4px_0_#000] hover:translate-y-0.5 hover:shadow-[2px_2px_0_#000] transition-all disabled:opacity-60"
      >
        {isSubmitting ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
