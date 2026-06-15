"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, Save, Megaphone, ExternalLink } from "lucide-react";
import type { SiteBannerRow } from "@features/home/types/siteBanner.types";
import { useCreateSiteBanner, useUpdateSiteBanner } from "../../hooks/banner/useSiteBanner.hook";
import { isApiError } from "../../utils/isApiError";
import { toDatetimeLocal, toISO } from "../../utils/datetimeInputs";

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


export default function BannerFormClient({ banner }: Props) {
  const router = useRouter();
  const isEdit = !!banner;

  const createMutation = useCreateSiteBanner();
  const updateMutation = useUpdateSiteBanner();
  const saving = createMutation.isPending || updateMutation.isPending;

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
      bg_color: banner?.bg_color ?? "var(--brand-pink)",
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

      if (isEdit) {
        await updateMutation.mutateAsync({ id: banner!.id, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }

      toast.success(isEdit ? "Banner atualizado" : "Banner criado");
      router.push("/admin/banners");
      router.refresh();
    } catch (e: unknown) {
      if (isApiError(e)) {
        toast.error(e.message);
      } else {
        toast.error(e instanceof Error ? e.message : "Falha ao salvar");
      }
    }
  }

  const inputCls =
    "w-full bg-[#050505] border-2 border-brand-pink/20 focus:border-brand-pink text-white font-mono text-base px-3 py-2 outline-none transition-colors placeholder:text-white/20";
  const labelCls =
    "block font-mono text-[12px] uppercase tracking-widest text-white/40 mb-1.5";
  const errorCls = "font-mono text-[12px] text-brand-pink mt-1";
  const panelCls = "border-2 border-white/10 bg-[#0a0a0a] p-5 space-y-4";
  const panelTitleCls =
    "font-mono text-[12px] uppercase tracking-[0.3em] text-brand-pink/50 border-b border-white/5 pb-2 mb-1";

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
            <Megaphone size={24} className="text-brand-pink" />
            {isEdit ? "Editar Banner" : "Novo Banner"}
          </h1>
          {isEdit && (
            <p className="mt-1 font-mono text-[12px] tracking-widest text-white/25 uppercase">
              ID: {banner.id.slice(0, 8)}…
            </p>
          )}
        </div>
      </div>

      <div className="overflow-hidden border border-brand-pink/30 shadow-[inset_0_0_15px_rgba(255,0,182,0.05)] rounded-none">
        <div className="border-b border-brand-pink/30 bg-[#050505] px-3 py-1.5 font-mono text-[11px] tracking-widest text-white/20 uppercase">
          Preview
        </div>
        <div
          className="flex h-10 items-center justify-center px-6"
          style={{ backgroundColor: bgColor || "var(--brand-pink)" }}
        >
          <span
            className="font-poppins truncate text-base font-semibold"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              <ExternalLink size={12} className="mr-1 inline" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Cor de Fundo</label>
              <Controller
                control={control}
                name="bg_color"
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="h-[38px] w-10 shrink-0 cursor-pointer border-2 border-white/10 bg-transparent p-0.5"
                    />
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className={inputCls}
                      placeholder="var(--brand-pink)"
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
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="h-[38px] w-10 shrink-0 cursor-pointer border-2 border-white/10 bg-transparent p-0.5"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <label className="flex cursor-pointer items-center gap-2.5 select-none">
              <input
                {...register("active")}
                type="checkbox"
                className="h-4 w-4 accent-[var(--brand-pink)]"
              />
              <span className="font-mono text-base tracking-wider text-white/50 uppercase">
                Ativo
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 select-none">
              <input
                {...register("dismissible")}
                type="checkbox"
                className="h-4 w-4 accent-[var(--brand-pink)]"
              />
              <span className="font-mono text-base tracking-wider text-white/50 uppercase">
                Fechável pelo usuário
              </span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 border-2 border-black bg-linear-to-r from-[var(--brand-pink)] to-brand-pink px-5 py-2.5 font-mono text-base font-bold tracking-widest text-black uppercase transition-colors hover:bg-brand-pink-light disabled:cursor-not-allowed disabled:opacity-50 rounded-none"
          >
            <Save size={16} />
            [ {saving ? "Salvando…" : "Salvar Banner"} ]
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="border border-white/10 px-4 py-2.5 font-mono text-base tracking-widest text-white/30 uppercase transition-colors hover:border-white/20 hover:text-white/60"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
