"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  ChevronLeft,
  Save,
  PlaySquare,
  Package,
  Upload,
  VideoIcon,
  ImageIcon,
  X,
  Loader2,
} from "lucide-react";
import type { HomeStoryRow } from "@features/home/types/homeStory.types";
import { toDatetimeLocal, toISO } from "../../utils/datetimeInputs";

const commonFields = {
  display_order: z.number().int().nonnegative(),
  active: z.boolean(),
  starts_at: z.string().optional(),
  ends_at: z.string().optional(),
};

const createProductSchema = z.object({
  ...commonFields,
  kind: z.literal("product"),
  product_code: z.string().min(1, "Código obrigatório").max(40),
});

const createManualSchema = z.object({
  ...commonFields,
  kind: z.literal("manual"),
  media_type: z.enum(["image", "video"]),
  media_url: z.string().url("Faça upload de uma mídia"),
  cta_url: z.string().url("URL inválida").optional().or(z.literal("")),
  cta_label_pt: z.string().max(40).optional(),
  cta_label_en: z.string().max(40).optional(),
  cta_label_es: z.string().max(40).optional(),
  title_pt: z.string().max(80).optional(),
  title_en: z.string().max(80).optional(),
  title_es: z.string().max(80).optional(),
  subtitle_pt: z.string().max(120).optional(),
  subtitle_en: z.string().max(120).optional(),
  subtitle_es: z.string().max(120).optional(),
  avatar_label: z.string().max(4).optional(),
});

const editSchema = z.object({
  ...commonFields,
  media_url: z.string().url().optional().or(z.literal("")),
  cta_url: z.string().url("URL inválida").optional().or(z.literal("")),
  cta_label_pt: z.string().max(40).optional(),
  title_pt: z.string().max(80).optional(),
  title_en: z.string().max(80).optional(),
  title_es: z.string().max(80).optional(),
  subtitle_pt: z.string().max(120).optional(),
  subtitle_en: z.string().max(120).optional(),
  subtitle_es: z.string().max(120).optional(),
  avatar_label: z.string().max(4).optional(),
});

type CreateProductData = z.infer<typeof createProductSchema>;
type CreateManualData = z.infer<typeof createManualSchema>;
type EditData = z.infer<typeof editSchema>;

interface Props {
  story?: HomeStoryRow;
}


const inputCls =
  "w-full bg-[#0f0f0f] border-2 border-[#FF00B6]/20 focus:border-[#FF00B6] text-white font-mono text-sm px-3 py-2 outline-none transition-colors placeholder:text-white/20";
const labelCls = "block font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1.5";
const errorCls = "font-mono text-[10px] text-[#FF00B6] mt-1";
const panelCls = "border-2 border-white/10 bg-[#1a1a1a] p-5 space-y-4";
const panelTitleCls =
  "font-mono text-[10px] uppercase tracking-[0.3em] text-[#00F0FF]/50 border-b border-white/5 pb-2 mb-1";

function CommonFields<T extends { display_order: number; active: boolean; starts_at?: string; ends_at?: string }>({
  register,
  errors,
}: {
  register: ReturnType<typeof useForm<T>>["register"];
  errors: Record<string, { message?: string } | undefined>;
}) {
  return (
    <div className={panelCls}>
      <div className={panelTitleCls}>Agendamento</div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Início (opcional)</label>
          <input {...(register as (name: string) => object)("starts_at")} type="datetime-local" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Fim (opcional)</label>
          <input {...(register as (name: string) => object)("ends_at")} type="datetime-local" className={inputCls} />
        </div>
      </div>
      <div className="w-36">
        <label className={labelCls}>Ordem</label>
        <input
          {...(register as (name: string, opts: object) => object)("display_order", { valueAsNumber: true })}
          type="number"
          min={0}
          className={inputCls}
        />
        {errors.display_order && <p className={errorCls}>{errors.display_order.message}</p>}
      </div>
      <label className="flex cursor-pointer items-center gap-2.5 select-none">
        <input
          {...(register as (name: string) => object)("active")}
          type="checkbox"
          className="h-4 w-4 accent-[#FF00B6]"
        />
        <span className="font-mono text-xs tracking-wider text-white/50 uppercase">Ativo</span>
      </label>
    </div>
  );
}

function UploadWidget({
  value,
  onChange,
  mediaType,
}: {
  value: string;
  onChange: (url: string) => void;
  mediaType: "image" | "video";
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", mediaType);
      const res = await fetch("/api/admin/home-stories/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload falhou");
      const data = (await res.json()) as { url: string };
      onChange(data.url);
      toast.success("Upload concluído");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha no upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative max-w-[120px] border-2 border-[#00F0FF]/30 bg-[#0f0f0f] p-2">
          {mediaType === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="preview" className="aspect-9/16 w-full object-cover" />
          ) : (
            <div className="flex aspect-9/16 w-full items-center justify-center bg-[#111]">
              <VideoIcon size={20} className="text-white/30" />
            </div>
          )}
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center bg-black/70 text-white/50 transition-colors hover:text-[#FF00B6]"
          >
            <X size={11} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex h-28 w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-[#FF00B6]/25 bg-[#0f0f0f] transition-colors hover:border-[#FF00B6]/50 disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 size={20} className="animate-spin text-[#FF00B6]" />
          ) : (
            <Upload size={20} className="text-[#FF00B6]/50" />
          )}
          <span className="font-mono text-[10px] tracking-widest text-white/25 uppercase">
            {uploading ? "Enviando…" : `Clique para enviar ${mediaType === "image" ? "imagem" : "vídeo"}`}
          </span>
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept={mediaType === "image" ? "image/jpeg,image/png,image/webp,image/gif" : "video/mp4,video/webm,video/quicktime"}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
    </div>
  );
}

function TextFieldsPanel({
  register,
  errors,
}: {
  register: (name: string) => object;
  errors: Record<string, { message?: string } | undefined>;
}) {
  return (
    <div className={panelCls}>
      <div className={panelTitleCls}>Textos e CTA</div>
      <div>
        <label className={labelCls}>Avatar Label (máx 4 chars)</label>
        <input {...register("avatar_label")} className={`${inputCls} w-32 uppercase`} placeholder="NEW" maxLength={4} />
        {errors.avatar_label && <p className={errorCls}>{errors.avatar_label.message}</p>}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelCls}>Título PT</label>
          <input {...register("title_pt")} className={inputCls} placeholder="Novidades" />
        </div>
        <div>
          <label className={labelCls}>Título EN</label>
          <input {...register("title_en")} className={inputCls} placeholder="New Arrivals" />
        </div>
        <div>
          <label className={labelCls}>Título ES</label>
          <input {...register("title_es")} className={inputCls} placeholder="Novedades" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelCls}>Subtítulo PT</label>
          <input {...register("subtitle_pt")} className={inputCls} placeholder="Descubra a coleção" />
        </div>
        <div>
          <label className={labelCls}>Subtítulo EN</label>
          <input {...register("subtitle_en")} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Subtítulo ES</label>
          <input {...register("subtitle_es")} className={inputCls} />
        </div>
      </div>
      <div>
        <label className={labelCls}>CTA URL (opcional)</label>
        <input {...register("cta_url")} className={inputCls} placeholder="https://serenaglasses.com.br/..." />
        {errors.cta_url && <p className={errorCls}>{errors.cta_url.message}</p>}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelCls}>Label CTA PT</label>
          <input {...register("cta_label_pt")} className={inputCls} placeholder="Ver coleção" />
        </div>
        <div>
          <label className={labelCls}>Label CTA EN</label>
          <input {...register("cta_label_en")} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Label CTA ES</label>
          <input {...register("cta_label_es")} className={inputCls} />
        </div>
      </div>
    </div>
  );
}

function CreateProductForm({ onSuccess }: { onSuccess: () => void }) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<CreateProductData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: { kind: "product", display_order: 0, active: true },
  });

  async function onSubmit(data: CreateProductData) {
    setSaving(true);
    try {
      const payload = {
        kind: "product",
        product_code: data.product_code.toUpperCase().trim(),
        display_order: data.display_order,
        active: data.active,
        starts_at: toISO(data.starts_at),
        ends_at: toISO(data.ends_at),
      };
      const res = await fetch("/api/admin/home-stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(err.error ?? "Erro desconhecido");
      }
      toast.success("Story criado");
      onSuccess();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className={panelCls}>
        <div className={panelTitleCls}>Produto</div>
        <div>
          <label className={labelCls}>
            <Package size={10} className="mr-1 inline" />
            Código do produto *
          </label>
          <input
            {...register("product_code")}
            className={`${inputCls} uppercase`}
            placeholder="ARO-0001"
          />
          {errors.product_code && (
            <p className={errorCls}>{errors.product_code.message}</p>
          )}
          <p className="mt-1 font-mono text-[10px] text-white/20">
            O código é convertido para maiúsculas automaticamente.
          </p>
        </div>
      </div>
      <CommonFields register={register as unknown as Parameters<typeof CommonFields>[0]["register"]} errors={errors} />
      <SaveRow saving={saving} />
    </form>
  );
}

function CreateManualForm({ onSuccess }: { onSuccess: () => void }) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<CreateManualData>({
    resolver: zodResolver(createManualSchema),
    defaultValues: { kind: "manual", media_type: "image", display_order: 0, active: true, media_url: "" },
  });

  const mediaType = watch("media_type");
  const mediaUrl = watch("media_url");

  async function onSubmit(data: CreateManualData) {
    setSaving(true);
    try {
      const payload = {
        kind: "manual",
        media_type: data.media_type,
        media_url: data.media_url,
        cta_url: data.cta_url || undefined,
        cta_label_pt: data.cta_label_pt || undefined,
        cta_label_en: data.cta_label_en || undefined,
        cta_label_es: data.cta_label_es || undefined,
        title_pt: data.title_pt || undefined,
        title_en: data.title_en || undefined,
        title_es: data.title_es || undefined,
        subtitle_pt: data.subtitle_pt || undefined,
        subtitle_en: data.subtitle_en || undefined,
        subtitle_es: data.subtitle_es || undefined,
        avatar_label: data.avatar_label || undefined,
        display_order: data.display_order,
        active: data.active,
        starts_at: toISO(data.starts_at),
        ends_at: toISO(data.ends_at),
      };
      const res = await fetch("/api/admin/home-stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(err.error ?? "Erro desconhecido");
      }
      toast.success("Story criado");
      onSuccess();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className={panelCls}>
        <div className={panelTitleCls}>Mídia</div>
        <div>
          <label className={labelCls}>Tipo de mídia *</label>
          <div className="flex gap-4">
            {(["image", "video"] as const).map((t) => (
              <label key={t} className="flex cursor-pointer items-center gap-2 select-none">
                <input
                  {...register("media_type")}
                  type="radio"
                  value={t}
                  className="accent-[#FF00B6]"
                />
                <span className="flex items-center gap-1 font-mono text-xs tracking-wider text-white/50 uppercase">
                  {t === "image" ? <ImageIcon size={12} /> : <VideoIcon size={12} />}
                  {t === "image" ? "Imagem" : "Vídeo"}
                </span>
              </label>
            ))}
          </div>
        </div>
        <Controller
          control={control}
          name="media_url"
          render={({ field }) => (
            <UploadWidget
              value={field.value ?? ""}
              onChange={field.onChange}
              mediaType={mediaType}
            />
          )}
        />
        {errors.media_url && <p className={errorCls}>{errors.media_url.message}</p>}
      </div>
      <TextFieldsPanel
        register={(name) => register(name as keyof CreateManualData)}
        errors={errors}
      />
      <CommonFields register={register as unknown as Parameters<typeof CommonFields>[0]["register"]} errors={errors} />
      <SaveRow saving={saving} />
    </form>
  );
}

function EditForm({ story, onSuccess }: { story: HomeStoryRow; onSuccess: () => void }) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<EditData>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      display_order: story.display_order,
      active: story.active,
      starts_at: toDatetimeLocal(story.starts_at),
      ends_at: toDatetimeLocal(story.ends_at),
      media_url: story.media_url ?? "",
      cta_url: story.cta_url ?? "",
      cta_label_pt: story.cta_label_pt ?? "",
      title_pt: story.title_pt ?? "",
      title_en: story.title_en ?? "",
      title_es: story.title_es ?? "",
      subtitle_pt: story.subtitle_pt ?? "",
      subtitle_en: story.subtitle_en ?? "",
      subtitle_es: story.subtitle_es ?? "",
      avatar_label: story.avatar_label ?? "",
    },
  });

  const mediaType = (story.media_type ?? "image") as "image" | "video";

  async function onSubmit(data: EditData) {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        display_order: data.display_order,
        active: data.active,
        starts_at: toISO(data.starts_at),
        ends_at: toISO(data.ends_at),
      };
      if (story.kind === "manual") {
        payload.media_url = data.media_url || undefined;
        payload.cta_url = data.cta_url || null;
        payload.cta_label_pt = data.cta_label_pt || undefined;
        payload.title_pt = data.title_pt || undefined;
        payload.title_en = data.title_en || undefined;
        payload.title_es = data.title_es || undefined;
        payload.subtitle_pt = data.subtitle_pt || undefined;
        payload.subtitle_en = data.subtitle_en || undefined;
        payload.subtitle_es = data.subtitle_es || undefined;
        payload.avatar_label = data.avatar_label || undefined;
      }
      const res = await fetch(`/api/admin/home-stories/${story.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(err.error ?? "Erro");
      }
      toast.success("Story atualizado");
      onSuccess();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {story.kind === "product" && (
        <div className={panelCls}>
          <div className={panelTitleCls}>Produto (imutável)</div>
          <div className="flex items-center gap-3 py-1">
            <Package size={14} className="text-[#00F0FF]/50" />
            <span className="font-mono text-xs text-white/40">
              product_id: {story.product_id ?? "—"}
            </span>
          </div>
        </div>
      )}
      {story.kind === "manual" && (
        <>
          <div className={panelCls}>
            <div className={panelTitleCls}>Mídia</div>
            <Controller
              control={control}
              name="media_url"
              render={({ field }) => (
                <UploadWidget
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  mediaType={mediaType}
                />
              )}
            />
            {errors.media_url && <p className={errorCls}>{errors.media_url.message}</p>}
          </div>
          <TextFieldsPanel register={(name) => register(name as keyof EditData)} errors={errors} />
        </>
      )}
      <CommonFields register={register as Parameters<typeof CommonFields>[0]["register"]} errors={errors} />
      <SaveRow saving={saving} />
    </form>
  );
}

function SaveRow({ saving }: { saving: boolean }) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-3 pt-2">
      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 border-2 border-black bg-linear-to-r from-[#FF00B6] to-[#00F0FF] px-5 py-2.5 font-mono text-xs font-bold tracking-widest text-black uppercase shadow-[4px_4px_0_#000] transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[5px_5px_0_#000] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Save size={13} />
        {saving ? "Salvando…" : "Salvar Story"}
      </button>
      <button
        type="button"
        onClick={() => router.back()}
        className="border border-white/10 px-4 py-2.5 font-mono text-xs tracking-widest text-white/30 uppercase transition-colors hover:border-white/20 hover:text-white/60"
      >
        Cancelar
      </button>
    </div>
  );
}

export default function StoryFormClient({ story }: Props) {
  const router = useRouter();
  const isEdit = !!story;
  const [selectedKind, setSelectedKind] = useState<"product" | "manual">("manual");

  function handleSuccess() {
    router.push("/admin/stories");
    router.refresh();
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-white/25 transition-colors hover:text-white"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-shrikhand flex items-center gap-3 text-3xl tracking-wider text-white">
            <PlaySquare size={24} className="text-[#FF00B6]" />
            {isEdit ? "Editar Story" : "Novo Story"}
          </h1>
          {isEdit && (
            <p className="mt-1 font-mono text-[10px] tracking-widest text-white/25 uppercase">
              kind: {story.kind} — ID: {story.id.slice(0, 8)}…
            </p>
          )}
        </div>
      </div>

      {isEdit ? (
        <EditForm story={story} onSuccess={handleSuccess} />
      ) : (
        <>
          <div className="border-2 border-white/10 bg-[#1a1a1a] p-4">
            <div className={panelTitleCls}>Tipo de story</div>
            <div className="mt-3 flex gap-6">
              {(["manual", "product"] as const).map((k) => (
                <label
                  key={k}
                  className={`flex items-center gap-2.5 cursor-pointer select-none px-3 py-2 border-2 transition-colors ${selectedKind === k
                    ? "border-[#FF00B6]/60 bg-[#FF00B6]/5 text-white"
                    : "border-white/10 text-white/30 hover:border-white/20"
                    }`}
                >
                  <input
                    type="radio"
                    name="kind-selector"
                    value={k}
                    checked={selectedKind === k}
                    onChange={() => setSelectedKind(k)}
                    className="accent-[#FF00B6]"
                  />
                  {k === "manual" ? (
                    <ImageIcon size={14} />
                  ) : (
                    <Package size={14} />
                  )}
                  <span className="font-mono text-xs tracking-wider uppercase">
                    {k === "manual" ? "Manual (mídia)" : "Produto"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {selectedKind === "product" ? (
            <CreateProductForm onSuccess={handleSuccess} />
          ) : (
            <CreateManualForm onSuccess={handleSuccess} />
          )}
        </>
      )}
    </div>
  );
}
