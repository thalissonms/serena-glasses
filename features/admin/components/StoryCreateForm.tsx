"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import { homeStoryCreateSchema, type HomeStoryCreateInput } from "@features/admin/schemas/homeStory.schema";

const labelClass =
  "font-poppins text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block";
const inputClass =
  "w-full bg-[#1a1a1a] border-2 border-white/10 text-white font-inter text-sm px-3 py-2 outline-none focus:border-brand-pink transition-colors";
const errorClass = "font-inter text-xs text-red-400 mt-1";

export default function StoryCreateForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(homeStoryCreateSchema),
    defaultValues: { kind: "manual" as const, display_order: 0, active: true, media_type: "image" as const },
  });

  const kind = watch("kind");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const detected: "image" | "video" = isImage ? "image" : "video";

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("kind", detected);

    const res = await fetch("/api/admin/home-stories/upload", { method: "POST", body: fd });
    setUploading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error ?? "Falha no upload");
      return;
    }

    const { url } = await res.json();
    setMediaUrl(url);
    setMediaType(detected);
    setValue("media_url", url, { shouldValidate: true });
    setValue("media_type", detected, { shouldValidate: true });
    toast.success("Mídia enviada");
  }

  async function onSubmit(data: HomeStoryCreateInput) {
    const res = await fetch("/api/admin/home-stories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error ?? "Erro ao salvar");
      return;
    }
    const row = await res.json();
    toast.success("Story criada!");
    router.push(`/admin/stories/${row.id}/edit`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-2xl">
      <div>
        <label className={labelClass}>Tipo *</label>
        <select {...register("kind")} className={inputClass}>
          <option value="manual">Manual (imagem/vídeo)</option>
          <option value="product">Produto</option>
        </select>
      </div>

      {kind === "product" ? (
        <div>
          <label className={labelClass}>Código do produto *</label>
          <input
            {...register("product_code" as never)}
            className={inputClass}
            placeholder="SOL-AVT-001"
            style={{ textTransform: "uppercase" }}
            onChange={(e) => {
              e.target.value = e.target.value.toUpperCase();
            }}
          />
          {"product_code" in errors && errors.product_code && (
            <p className={errorClass}>
              {(errors as { product_code?: { message?: string } }).product_code?.message}
            </p>
          )}
          <p className="font-inter text-[11px] text-gray-500 mt-1">
            Use o código cadastrado no produto (ex: SOL-AVT-001).
          </p>
        </div>
      ) : (
        <>
          <div>
            <label className={labelClass}>Mídia (imagem ou vídeo) *</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 border-2 border-white/20 px-4 py-2 hover:border-brand-pink text-white font-poppins text-xs uppercase tracking-wider disabled:opacity-50"
            >
              {uploading ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
              {uploading ? "Enviando..." : mediaUrl ? "Trocar mídia" : "Selecionar arquivo"}
            </button>

            {mediaUrl && (
              <div className="mt-3 border-2 border-white/10 p-2 bg-black/40">
                {mediaType === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={mediaUrl} alt="preview" className="max-h-64 mx-auto" />
                ) : (
                  <video src={mediaUrl} controls className="max-h-64 mx-auto w-full" />
                )}
                <p className="font-inter text-[10px] text-gray-500 mt-2 break-all">{mediaUrl}</p>
              </div>
            )}

            <input type="hidden" {...register("media_url" as never)} />
            <input type="hidden" {...register("media_type" as never)} />

            {"media_url" in errors && errors.media_url && (
              <p className={errorClass}>
                {(errors as { media_url?: { message?: string } }).media_url?.message ?? "Envie uma imagem ou vídeo"}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>URL do CTA</label>
            <input {...register("cta_url" as never)} className={inputClass} placeholder="https://..." />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Label CTA (PT)</label>
              <input {...register("cta_label_pt" as never)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Label CTA (EN)</label>
              <input {...register("cta_label_en" as never)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Label CTA (ES)</label>
              <input {...register("cta_label_es" as never)} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Título (PT)</label>
              <input {...register("title_pt" as never)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Título (EN)</label>
              <input {...register("title_en" as never)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Título (ES)</label>
              <input {...register("title_es" as never)} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Subtítulo (PT)</label>
              <input {...register("subtitle_pt" as never)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Subtítulo (EN)</label>
              <input {...register("subtitle_en" as never)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Subtítulo (ES)</label>
              <input {...register("subtitle_es" as never)} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Label do avatar (máx 4 chars)</label>
            <input {...register("avatar_label" as never)} className={inputClass} placeholder="NEW" maxLength={4} />
          </div>
        </>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Ordem de exibição</label>
          <input
            {...register("display_order", { valueAsNumber: true })}
            type="number"
            min={0}
            className={inputClass}
          />
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

      <button
        type="submit"
        disabled={isSubmitting || uploading}
        className="self-start px-8 py-3 border-4 border-brand-pink bg-brand-pink text-white font-poppins font-black text-sm uppercase tracking-widest shadow-[4px_4px_0_#000] hover:translate-y-0.5 hover:shadow-[2px_2px_0_#000] transition-all disabled:opacity-60"
      >
        {isSubmitting ? "Salvando..." : "Criar"}
      </button>
    </form>
  );
}
