"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Send, CheckCircle, XCircle } from "lucide-react";
import {
  freeShippingSchema,
  maintenanceSchema,
  pixelsSchema,
  whatsappSchema,
  popupCaptureSchema,
  installmentsBulkSchema,
  type SettingValue,
} from "@features/admin/schemas/siteSettings.schema";
import type { SiteSettingRow } from "@features/admin/services/siteSettings.service";

const labelClass =
  "font-poppins text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block";
const inputClass =
  "w-full bg-[#1a1a1a] border-2 border-white/10 text-white font-inter text-sm px-3 py-2 outline-none focus:border-brand-pink transition-colors";
const errorClass = "font-inter text-xs text-red-400 mt-1";
const checkboxClass = "w-4 h-4 accent-brand-pink cursor-pointer";
const saveBtn =
  "px-6 py-2 border-4 border-brand-pink bg-brand-pink text-white font-poppins font-black text-xs uppercase tracking-widest shadow-[4px_4px_0_#000] hover:translate-y-0.5 hover:shadow-[2px_2px_0_#000] transition-all disabled:opacity-60";

async function patchSetting(key: string, data: unknown): Promise<boolean> {
  const res = await fetch(`/api/admin/site-settings/${key}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    toast.error(json.error ?? "Erro ao salvar");
    return false;
  }
  toast.success("Salvo!");
  return true;
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-2 border-white/10 bg-[#111]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors"
      >
        <div>
          <p className="font-poppins font-bold text-sm text-white uppercase tracking-wider">
            {title}
          </p>
          {description && (
            <p className="font-inter text-xs text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
        {open ? (
          <ChevronUp size={18} className="text-gray-400 shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-gray-400 shrink-0" />
        )}
      </button>
      {open && <div className="px-5 pb-6 pt-2 border-t-2 border-white/10">{children}</div>}
    </div>
  );
}

function FreeShippingForm({ initial }: { initial: SettingValue<"free_shipping"> }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(freeShippingSchema), defaultValues: initial });

  async function onSubmit(data: SettingValue<"free_shipping">) {
    await patchSetting("free_shipping", data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
      <div className="flex items-center gap-3">
        <input type="checkbox" {...register("enabled")} className={checkboxClass} id="fs-enabled" />
        <label htmlFor="fs-enabled" className="font-inter text-sm text-white cursor-pointer">
          Frete grátis ativo
        </label>
      </div>
      <div>
        <label className={labelClass}>Threshold (centavos) *</label>
        <input
          {...register("threshold_cents", { valueAsNumber: true })}
          type="number"
          className={inputClass}
          placeholder="20000 = R$ 200"
        />
        {errors.threshold_cents && (
          <p className={errorClass}>{errors.threshold_cents.message}</p>
        )}
      </div>
      <div>
        <label className={labelClass}>Label PT *</label>
        <input {...register("label_pt")} className={inputClass} />
        {errors.label_pt && <p className={errorClass}>{errors.label_pt.message}</p>}
      </div>
      <div>
        <label className={labelClass}>Label EN</label>
        <input {...register("label_en")} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Label ES</label>
        <input {...register("label_es")} className={inputClass} />
      </div>
      <button type="submit" disabled={isSubmitting} className={`${saveBtn} self-start`}>
        {isSubmitting ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}

function MaintenanceForm({ initial }: { initial: SettingValue<"maintenance"> }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(maintenanceSchema), defaultValues: initial });

  async function onSubmit(data: SettingValue<"maintenance">) {
    await patchSetting("maintenance", data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          {...register("enabled")}
          className={checkboxClass}
          id="maint-enabled"
        />
        <label htmlFor="maint-enabled" className="font-inter text-sm text-white cursor-pointer">
          Modo manutenção ativo
        </label>
      </div>
      <div className="p-3 bg-yellow-900/30 border border-yellow-600/50">
        <p className="font-inter text-xs text-yellow-400">
          Atenção: ativar o modo manutenção redireciona todos os visitantes não-admin para
          /manutencao.
        </p>
      </div>
      <div>
        <label className={labelClass}>Mensagem PT *</label>
        <input {...register("message_pt")} className={inputClass} />
        {errors.message_pt && <p className={errorClass}>{errors.message_pt.message}</p>}
      </div>
      <div>
        <label className={labelClass}>Mensagem EN</label>
        <input {...register("message_en")} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Mensagem ES</label>
        <input {...register("message_es")} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Retorno previsto (ISO 8601)</label>
        <input
          {...register("expected_return")}
          className={inputClass}
          placeholder="2026-01-01T00:00:00Z"
        />
        {errors.expected_return && (
          <p className={errorClass}>{errors.expected_return.message}</p>
        )}
      </div>
      <button type="submit" disabled={isSubmitting} className={`${saveBtn} self-start`}>
        {isSubmitting ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}

function PixelsForm({ initial }: { initial: SettingValue<"pixels"> }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(pixelsSchema), defaultValues: initial });

  async function onSubmit(data: SettingValue<"pixels">) {
    const clean = {
      meta_pixel_id: data.meta_pixel_id || null,
      ga4_id: data.ga4_id || null,
      tiktok_pixel_id: data.tiktok_pixel_id || null,
    };
    await patchSetting("pixels", clean);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
      <div>
        <label className={labelClass}>Meta Pixel ID</label>
        <input {...register("meta_pixel_id")} className={inputClass} placeholder="123456789" />
        {errors.meta_pixel_id && <p className={errorClass}>{errors.meta_pixel_id.message}</p>}
      </div>
      <div>
        <label className={labelClass}>GA4 ID</label>
        <input {...register("ga4_id")} className={inputClass} placeholder="G-XXXXXXXXXX" />
        {errors.ga4_id && <p className={errorClass}>{errors.ga4_id.message}</p>}
      </div>
      <div>
        <label className={labelClass}>TikTok Pixel ID</label>
        <input {...register("tiktok_pixel_id")} className={inputClass} placeholder="XXXXXXXXXXXXXXXXXX" />
      </div>
      <button type="submit" disabled={isSubmitting} className={`${saveBtn} self-start`}>
        {isSubmitting ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}

function WhatsAppForm({ initial }: { initial: SettingValue<"whatsapp"> }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(whatsappSchema), defaultValues: initial });

  async function onSubmit(data: SettingValue<"whatsapp">) {
    await patchSetting("whatsapp", data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
      <div className="flex items-center gap-3">
        <input type="checkbox" {...register("enabled")} className={checkboxClass} id="wa-enabled" />
        <label htmlFor="wa-enabled" className="font-inter text-sm text-white cursor-pointer">
          Botão WhatsApp ativo
        </label>
      </div>
      <div>
        <label className={labelClass}>Telefone (somente dígitos) *</label>
        <input {...register("phone")} className={inputClass} placeholder="5511999999999" />
        {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
      </div>
      <div>
        <label className={labelClass}>Mensagem pré-definida PT *</label>
        <input {...register("message_pt")} className={inputClass} />
        {errors.message_pt && <p className={errorClass}>{errors.message_pt.message}</p>}
      </div>
      <div>
        <label className={labelClass}>Posição *</label>
        <select {...register("position")} className={inputClass}>
          <option value="bottom-right">Inferior Direita</option>
          <option value="bottom-left">Inferior Esquerda</option>
        </select>
      </div>
      <button type="submit" disabled={isSubmitting} className={`${saveBtn} self-start`}>
        {isSubmitting ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}

function PopupCaptureForm({ initial }: { initial: SettingValue<"popup_capture"> }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(popupCaptureSchema), defaultValues: initial });

  async function onSubmit(data: SettingValue<"popup_capture">) {
    const clean = { ...data, coupon_code: data.coupon_code || null };
    await patchSetting("popup_capture", clean);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          {...register("enabled")}
          className={checkboxClass}
          id="popup-enabled"
        />
        <label htmlFor="popup-enabled" className="font-inter text-sm text-white cursor-pointer">
          Pop-up ativo
        </label>
      </div>
      <div>
        <label className={labelClass}>Título PT *</label>
        <input {...register("title_pt")} className={inputClass} />
        {errors.title_pt && <p className={errorClass}>{errors.title_pt.message}</p>}
      </div>
      <div>
        <label className={labelClass}>Descrição PT *</label>
        <input {...register("description_pt")} className={inputClass} />
        {errors.description_pt && <p className={errorClass}>{errors.description_pt.message}</p>}
      </div>
      <div>
        <label className={labelClass}>Botão primário PT *</label>
        <input {...register("primary_label_pt")} className={inputClass} />
        {errors.primary_label_pt && (
          <p className={errorClass}>{errors.primary_label_pt.message}</p>
        )}
      </div>
      <div>
        <label className={labelClass}>Botão secundário PT</label>
        <input {...register("secondary_label_pt")} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Trigger *</label>
        <select {...register("trigger")} className={inputClass}>
          <option value="exit_intent">Exit Intent (mouse sai da janela)</option>
          <option value="delay">Delay (após X ms)</option>
          <option value="scroll">Scroll (50% da página)</option>
          <option value="manual">Manual</option>
        </select>
      </div>
      <div>
        <label className={labelClass}>Delay (ms)</label>
        <input
          {...register("delay_ms", { valueAsNumber: true })}
          type="number"
          className={inputClass}
          placeholder="5000"
        />
      </div>
      <div>
        <label className={labelClass}>Código do cupom</label>
        <input {...register("coupon_code")} className={inputClass} placeholder="DESCONTO10" />
      </div>
      <div>
        <label className={labelClass}>Não mostrar novamente por (dias) *</label>
        <input
          {...register("show_once_per_days", { valueAsNumber: true })}
          type="number"
          className={inputClass}
          placeholder="7"
        />
        {errors.show_once_per_days && (
          <p className={errorClass}>{errors.show_once_per_days.message}</p>
        )}
      </div>
      <button type="submit" disabled={isSubmitting} className={`${saveBtn} self-start`}>
        {isSubmitting ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}

function InstallmentsBulkForm({ initial }: { initial: SettingValue<"installments_bulk"> }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(installmentsBulkSchema), defaultValues: initial });

  async function onSubmit(data: SettingValue<"installments_bulk">) {
    await patchSetting("installments_bulk", data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          {...register("enabled")}
          className={checkboxClass}
          id="inst-enabled"
        />
        <label htmlFor="inst-enabled" className="font-inter text-sm text-white cursor-pointer">
          Parcelamento automático ativo
        </label>
      </div>
      <div>
        <label className={labelClass}>Valor mínimo (centavos) *</label>
        <input
          {...register("threshold_cents", { valueAsNumber: true })}
          type="number"
          className={inputClass}
          placeholder="10000 = R$ 100"
        />
        {errors.threshold_cents && (
          <p className={errorClass}>{errors.threshold_cents.message}</p>
        )}
      </div>
      <div>
        <label className={labelClass}>Número de parcelas (1–12) *</label>
        <input
          {...register("installments", { valueAsNumber: true })}
          type="number"
          min={1}
          max={12}
          className={inputClass}
        />
        {errors.installments && <p className={errorClass}>{errors.installments.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className={`${saveBtn} self-start`}>
        {isSubmitting ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}

function TestEmailSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string; detail?: string } | null>(null);

  async function handleSend() {
    if (!email.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ ok: false, message: data.error ?? "Erro desconhecido", detail: data.detail ? JSON.stringify(data.detail, null, 2) : undefined });
      } else {
        setResult({ ok: true, message: `Enviado! ID: ${data.id} · De: ${data.from}` });
      }
    } catch (err) {
      setResult({ ok: false, message: err instanceof Error ? err.message : "Erro de rede" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      <p className="font-inter text-xs text-gray-400">
        Envia um email de teste via Resend para diagnosticar problemas de configuração.
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="seu@email.com"
          className={inputClass + " flex-1"}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={loading || !email.trim()}
          className="flex items-center gap-2 px-4 py-2 border-4 border-brand-pink bg-brand-pink text-white font-poppins font-black text-xs uppercase tracking-widest shadow-[4px_4px_0_#000] hover:translate-y-0.5 hover:shadow-[2px_2px_0_#000] transition-all disabled:opacity-60"
        >
          <Send size={13} />
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </div>
      {result && (
        <div className={`flex flex-col gap-2 p-3 border-2 ${result.ok ? "border-green-600 bg-green-900/20" : "border-red-600 bg-red-900/20"}`}>
          <div className="flex items-center gap-2">
            {result.ok
              ? <CheckCircle size={14} className="text-green-400 shrink-0" />
              : <XCircle size={14} className="text-red-400 shrink-0" />}
            <p className="font-inter text-sm text-white">{result.message}</p>
          </div>
          {result.detail && (
            <pre className="font-mono text-[11px] text-gray-400 whitespace-pre-wrap break-all bg-black/40 p-2">{result.detail}</pre>
          )}
        </div>
      )}
    </div>
  );
}

interface Props {
  initialRows: SiteSettingRow[];
}

export default function SiteSettingsClient({ initialRows }: Props) {
  function getVal<K extends string>(key: K) {
    return initialRows.find((r) => r.key === key)?.value;
  }

  const freeShipping = getVal("free_shipping") as SettingValue<"free_shipping"> | undefined;
  const maintenance = getVal("maintenance") as SettingValue<"maintenance"> | undefined;
  const pixels = getVal("pixels") as SettingValue<"pixels"> | undefined;
  const whatsapp = getVal("whatsapp") as SettingValue<"whatsapp"> | undefined;
  const popupCapture = getVal("popup_capture") as SettingValue<"popup_capture"> | undefined;
  const installmentsBulk = getVal("installments_bulk") as SettingValue<"installments_bulk"> | undefined;

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-poppins font-black text-2xl text-white uppercase tracking-widest mb-8">
          Configurações
        </h1>

        <div className="flex flex-col gap-3">
          <Section
            title="Frete Grátis"
            description="Threshold e labels de frete grátis automático"
          >
            {freeShipping ? (
              <FreeShippingForm initial={freeShipping} />
            ) : (
              <p className="font-inter text-sm text-gray-500 mt-4">
                Configuração não encontrada no banco. Rode a migration v1.6.0.
              </p>
            )}
          </Section>

          <Section
            title="Modo Manutenção"
            description="Redireciona visitantes para página de manutenção"
          >
            {maintenance ? (
              <MaintenanceForm initial={maintenance} />
            ) : (
              <p className="font-inter text-sm text-gray-500 mt-4">
                Configuração não encontrada no banco. Rode a migration v1.6.0.
              </p>
            )}
          </Section>

          <Section title="Pixels de Tracking" description="Meta Pixel, GA4 e TikTok Pixel">
            {pixels ? (
              <PixelsForm initial={pixels} />
            ) : (
              <p className="font-inter text-sm text-gray-500 mt-4">
                Configuração não encontrada no banco. Rode a migration v1.6.0.
              </p>
            )}
          </Section>

          <Section title="WhatsApp" description="Botão flutuante de WhatsApp">
            {whatsapp ? (
              <WhatsAppForm initial={whatsapp} />
            ) : (
              <p className="font-inter text-sm text-gray-500 mt-4">
                Configuração não encontrada no banco. Rode a migration v1.6.0.
              </p>
            )}
          </Section>

          <Section
            title="Pop-up de Captura"
            description="Pop-up de captura de leads com cupom opcional"
          >
            {popupCapture ? (
              <PopupCaptureForm initial={popupCapture} />
            ) : (
              <p className="font-inter text-sm text-gray-500 mt-4">
                Configuração não encontrada no banco. Rode a migration v1.6.0.
              </p>
            )}
          </Section>

          <Section
            title="Parcelamento"
            description="Parcelamento padrão aplicado a produtos sem configuração individual"
          >
            {installmentsBulk ? (
              <InstallmentsBulkForm initial={installmentsBulk} />
            ) : (
              <p className="font-inter text-sm text-gray-500 mt-4">
                Configuração não encontrada no banco. Rode a migration v1.16.0.
              </p>
            )}
          </Section>

          <Section title="Teste de Email" description="Diagnóstico do Resend — envia um email de teste">
            <TestEmailSection />
          </Section>
        </div>
      </div>
    </div>
  );
}
