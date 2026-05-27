"use client";
/**
 * Component: BannerFormClient — formulário create/edit de site_banners com Y2K Chrome.
 *
 * Create: POST /api/admin/site-banners.
 * Edit: PATCH /api/admin/site-banners/[id].
 * Live preview do banner com bg_color e text_color em tempo real.
 * Color fields controlados via Controller para sincronizar picker + hex input.
 *
 * Usado em: /admin/banners/new e /admin/banners/[id].
 */
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, Save, Megaphone, ExternalLink } from "lucide-react";
import type { SiteBannerRow } from "@features/home/types/siteBanner.types";

const formSchema = z.object({
  message_pt: z.string().min(1, "Obrigatório").max(200, "Máximo 200 caracteres"),
  message_en: z.string().max(200).optional(),
  message_es: z.string().max(200).optional(),
  link_url: z
    .string()
    .optional()
    .refine(
      (v) => !v || v === "" || z.string().url().safeParse(v).success,
      "URL inválida — inclua https://",
    ),
  bg_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Formato: #RRGGBB"),
  text_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Formato: #RRGGBB"),
  starts_at: z.string().optional(),
  ends_at: z.string().optional(),
  active: z.boolean(),
  dismissible: z.boolean(),
  display_order: z.number().int().nonnegative(),
});

type FormData = z.infer<typeof formSchema>;

interface Props {
  banner?: SiteBannerRow;
}

function toDatetimeLocal(iso: string | null | undefined): string {
  if (!iso) return "";
  return iso.slice(0, 16);
}

function toISO(local: string | undefined): string | undefined {
  if (!local) return undefined;
  const d = new Date(local);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}

export default function BannerFormClient({ banner }: Props) {
  const router = useRouter();
  const isEdit = !!banner;
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message_pt: banner?.message_pt ?? "",
      message_en: banner?.message_en ?? "",
      message_es: banner?.message_es ?? "",
      link_url: banner?.link_url ?? "",
      bg_color: banner?.bg_color ?? "#FF00B6",
      text_color: banner?.text_color ?? "#FFFFFF",
      starts_at: toDatetimeLocal(banner?.starts_at),
      ends_at: toDatetimeLocal(banner?.ends_at),
      active: banner?.active ?? true,
      dismissible: banner?.dismissible ?? true,
      display_order: banner?.display_order ?? 0,
    },
  });

  const bgColor = watch("bg_color");
  const textColor = watch("text_color");
  const msgPt = watch("message_pt");

  async function onSubmit(data: FormData) {
    setSaving(true);
    try {
      const payload = {
        message_pt: data.message_pt,
        message_en: data.message_en || undefined,
        message_es: data.message_es || undefined,
        link_url: data.link_url || undefined,
        bg_color: data.bg_color,
        text_color: data.text_color,
        starts_at: toISO(data.starts_at),
        ends_at: toISO(data.ends_at),
        active: data.active,
        dismissible: data.dismissible,
        display_order: data.display_order,
      };

      const url = isEdit
        ? `/api/admin/site-banners/${banner.id}`
        : "/api/admin/site-banners";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(err.error ?? "Erro desconhecido");
      }

      toast.success(isEdit ? "Banner atualizado" : "Banner criado");
      router.push("/admin/banners");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao salvar");
    } finally {
      setSaving(false);
    }
  }

  const inputCls =
    "w-full bg-[#0f0f0f] border-2 border-[#FF00B6]/20 focus:border-[#FF00B6] text-white font-mono text-sm px-3 py-2 outline-none transition-colors placeholder:text-white/20";
  const labelCls =
    "block font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1.5";
  const errorCls = "font-mono text-[10px] text-[#FF00B6] mt-1";
  const panelCls = "border-2 border-white/10 bg-[#1a1a1a] p-5 space-y-4";
  const panelTitleCls =
    "font-mono text-[10px] uppercase tracking-[0.3em] text-[#00F0FF]/50 border-b border-white/5 pb-2 mb-1";

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-white/25 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-shrikhand text-3xl text-white tracking-wider flex items-center gap-3">
            <Megaphone size={24} className="text-[#FF00B6]" />
            {isEdit ? "Editar Banner" : "Novo Banner"}
          </h1>
          {isEdit && (
            <p className="font-mono text-[10px] text-white/25 mt-1 uppercase tracking-widest">
              ID: {banner.id.slice(0, 8)}…
            </p>
          )}
        </div>
      </div>

      <div className="border-2 border-[#FF00B6]/30 overflow-hidden shadow-[4px_4px_0_#FF00B6]">
        <div className="font-mono text-[9px] uppercase tracking-widest text-white/20 px-3 py-1.5 bg-[#111] border-b border-white/10">
          Preview
        </div>
        <div
          className="h-10 flex items-center justify-center px-6"
          style={{ backgroundColor: bgColor || "#FF00B6" }}
        >
          <span
            className="font-poppins text-sm font-semibold truncate"
            style={{ color: textColor || "#FFFFFF" }}
          >
            {msgPt || "Texto do banner aparece aqui…"}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className={panelCls}>
          <div className={panelTitleCls}>Mensagens i18n</div>
          <div>
            <label className={labelCls}>Mensagem PT *</label>
            <input
              {...register("message_pt")}
              className={inputCls}
              placeholder="Frete grátis acima de R$299"
            />
            {errors.message_pt && (
              <p className={errorCls}>{errors.message_pt.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Mensagem EN</label>
              <input
                {...register("message_en")}
                className={inputCls}
                placeholder="Free shipping above R$299"
              />
            </div>
            <div>
              <label className={labelCls}>Mensagem ES</label>
              <input
                {...register("message_es")}
                className={inputCls}
                placeholder="Envío gratis desde R$299"
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>
              <ExternalLink size={9} className="inline mr-1" />
              URL do link (opcional)
            </label>
            <input
              {...register("link_url")}
              className={inputCls}
              placeholder="https://serenaglasses.com.br/colecao"
            />
            {errors.link_url && (
              <p className={errorCls}>{errors.link_url.message}</p>
            )}
          </div>
        </div>

        <div className={panelCls}>
          <div className={panelTitleCls}>Cores</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Cor de Fundo</label>
              <Controller
                control={control}
                name="bg_color"
                render={({ field }) => (
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-10 h-[38px] bg-transparent border-2 border-white/10 cursor-pointer p-0.5 shrink-0"
                    />
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className={inputCls}
                      placeholder="#FF00B6"
                    />
                  </div>
                )}
              />
              {errors.bg_color && (
                <p className={errorCls}>{errors.bg_color.message}</p>
              )}
            </div>
            <div>
              <label className={labelCls}>Cor do Texto</label>
              <Controller
                control={control}
                name="text_color"
                render={({ field }) => (
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-10 h-[38px] bg-transparent border-2 border-white/10 cursor-pointer p-0.5 shrink-0"
                    />
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className={inputCls}
                      placeholder="#FFFFFF"
                    />
                  </div>
                )}
              />
              {errors.text_color && (
                <p className={errorCls}>{errors.text_color.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className={panelCls}>
          <div className={panelTitleCls}>Agendamento e Configuração</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Início (opcional)</label>
              <input
                {...register("starts_at")}
                type="datetime-local"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Fim (opcional)</label>
              <input
                {...register("ends_at")}
                type="datetime-local"
                className={inputCls}
              />
            </div>
          </div>
          <div className="w-40">
            <label className={labelCls}>Ordem de exibição</label>
            <input
              {...register("display_order", { valueAsNumber: true })}
              type="number"
              min={0}
              className={inputCls}
            />
          </div>
          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                {...register("active")}
                type="checkbox"
                className="w-4 h-4 accent-[#FF00B6]"
              />
              <span className="font-mono text-xs text-white/50 uppercase tracking-wider">
                Ativo
              </span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                {...register("dismissible")}
                type="checkbox"
                className="w-4 h-4 accent-[#FF00B6]"
              />
              <span className="font-mono text-xs text-white/50 uppercase tracking-wider">
                Fechável pelo usuário
              </span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-linear-to-r from-[#FF00B6] to-[#00F0FF] text-black font-mono text-xs font-bold uppercase tracking-widest px-5 py-2.5 border-2 border-black shadow-[4px_4px_0_#000] hover:-translate-x-px hover:-translate-y-px hover:shadow-[5px_5px_0_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={13} />
            {saving ? "Salvando…" : "Salvar Banner"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="font-mono text-xs uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors px-4 py-2.5 border border-white/10 hover:border-white/20"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
