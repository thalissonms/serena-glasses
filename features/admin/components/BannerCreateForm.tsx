"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { siteBannerCreateSchema, type SiteBannerCreateInput } from "@features/admin/schemas/siteBanner.schema";

const labelClass =
  "font-poppins text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block";
const inputClass =
  "w-full bg-[#1a1a1a] border-2 border-white/10 text-white font-inter text-sm px-3 py-2 outline-none focus:border-brand-pink transition-colors";
const errorClass = "font-inter text-xs text-red-400 mt-1";

export default function BannerCreateForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(siteBannerCreateSchema),
    defaultValues: {
      bg_color: "#FF00B6",
      text_color: "#FFFFFF",
      active: true,
      dismissible: true,
      display_order: 0,
    },
  });

  const bgColor = watch("bg_color") ?? "#FF00B6";
  const textColor = watch("text_color") ?? "#FFFFFF";

  function setBg(v: string) {
    setValue("bg_color", v, { shouldDirty: true, shouldValidate: true });
  }
  function setText(v: string) {
    setValue("text_color", v, { shouldDirty: true, shouldValidate: true });
  }

  async function onSubmit(data: SiteBannerCreateInput) {
    const res = await fetch("/api/admin/site-banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const issue = body?.issues?.[0];
      const msg = issue
        ? `${issue.path?.join(".") ?? "campo"}: ${issue.message}`
        : (body.error ?? "Erro ao salvar");
      toast.error(msg);
      return;
    }
    const row = await res.json();
    toast.success("Banner criado!");
    router.push(`/admin/banners/${row.id}/edit`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-2xl">
      <div>
        <label className={labelClass}>Mensagem (PT) *</label>
        <input {...register("message_pt")} className={inputClass} placeholder="Frete grátis acima de R$ 200!" />
        {errors.message_pt && <p className={errorClass}>{errors.message_pt.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Mensagem (EN)</label>
        <input {...register("message_en")} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Mensagem (ES)</label>
        <input {...register("message_es")} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>URL do link (opcional)</label>
        <input {...register("link_url")} className={inputClass} placeholder="https://..." />
        {errors.link_url && <p className={errorClass}>{errors.link_url.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Cor de fundo</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBg(e.target.value.toUpperCase())}
              className="w-10 h-10 cursor-pointer bg-transparent border-0 p-0"
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => setBg(e.target.value)}
              className={inputClass}
              placeholder="#FF00B6"
              maxLength={7}
            />
          </div>
          {errors.bg_color && <p className={errorClass}>{errors.bg_color.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Cor do texto</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={textColor}
              onChange={(e) => setText(e.target.value.toUpperCase())}
              className="w-10 h-10 cursor-pointer bg-transparent border-0 p-0"
            />
            <input
              type="text"
              value={textColor}
              onChange={(e) => setText(e.target.value)}
              className={inputClass}
              placeholder="#FFFFFF"
              maxLength={7}
            />
          </div>
          {errors.text_color && <p className={errorClass}>{errors.text_color.message}</p>}
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

      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register("active")} className="w-4 h-4 accent-brand-pink" />
          <span className="font-poppins text-[10px] font-bold uppercase tracking-widest text-gray-400">Ativo</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register("dismissible")} className="w-4 h-4 accent-brand-pink" />
          <span className="font-poppins text-[10px] font-bold uppercase tracking-widest text-gray-400">Dismissível</span>
        </label>
      </div>

      <div>
        <label className={labelClass}>Ordem de exibição</label>
        <input
          {...register("display_order", {
            setValueAs: (v) => (v === "" || v === null || v === undefined ? 0 : Number(v)),
          })}
          type="number"
          min={0}
          className={inputClass}
        />
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
