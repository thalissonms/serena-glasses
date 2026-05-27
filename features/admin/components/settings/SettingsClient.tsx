"use client";
/**
 * Component: SettingsClient — 6 painéis de configurações do site com accordion Y2K Chrome.
 *
 * Painéis: free_shipping, maintenance, pixels, whatsapp, popup_capture, installments_bulk.
 * Cada painel tem form independente que PATCH /api/admin/site-settings/[key].
 * Side card: Melhor Envio health (GET /api/admin/melhor-envio/health) + Test Email.
 * threshold_cents exibido em R$ (÷100), convertido de volta em centavos no save.
 *
 * Usado em: /admin/settings.
 */
import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ChevronDown,
  Truck,
  AlertTriangle,
  Zap,
  MessageCircle,
  MousePointerClick,
  CreditCard,
  Settings,
  CheckCircle2,
  XCircle,
  Loader2,
  Send,
  RefreshCw,
} from "lucide-react";

interface Props {
  settings: Record<string, unknown>;
}

const inputCls =
  "w-full bg-[#0f0f0f] border-2 border-[#FF00B6]/20 focus:border-[#FF00B6] text-white font-mono text-sm px-3 py-2 outline-none transition-colors placeholder:text-white/20";
const labelCls = "block font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1.5";
const errorCls = "font-mono text-[10px] text-[#FF00B6] mt-1";
const helperCls = "font-mono text-[10px] text-white/20 mt-1";

async function patchSetting(key: string, data: unknown) {
  const res = await fetch(`/api/admin/site-settings/${key}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error ?? "Erro ao salvar");
  }
}

function AccordionPanel({
  id,
  title,
  icon: Icon,
  isOpen,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  icon: React.ElementType;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-2 border-white/10 bg-[#1a1a1a] shadow-[4px_4px_0_#000]">
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-5 py-4 transition-colors ${isOpen ? "border-b border-white/10" : ""}`}
      >
        <div className="flex items-center gap-3">
          <Icon
            size={16}
            className={isOpen ? "text-[#FF00B6]" : "text-white/30"}
          />
          <span className="font-mono text-xs uppercase tracking-widest text-white/70 font-semibold">
            {title}
          </span>
        </div>
        <ChevronDown
          size={14}
          className={`text-white/30 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && <div className="p-5">{children}</div>}
    </div>
  );
}

function ToggleField({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-[#FF00B6]"
      />
      <span className="font-mono text-xs text-white/50 uppercase tracking-wider">{label}</span>
    </label>
  );
}

function SaveButton({ saving }: { saving: boolean }) {
  return (
    <button
      type="submit"
      disabled={saving}
      className="flex items-center gap-2 bg-linear-to-r from-[#FF00B6] to-[#00F0FF] text-black font-mono text-[10px] font-bold uppercase tracking-widest px-4 py-2 border-2 border-black shadow-[3px_3px_0_#000] hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_#000] transition-all disabled:opacity-50"
    >
      {saving ? <Loader2 size={11} className="animate-spin" /> : null}
      {saving ? "Salvando…" : "Salvar"}
    </button>
  );
}

function parseSettings<T>(raw: unknown, fallback: T): T {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) return raw as T;
  return fallback;
}

function FreeShippingPanel({ raw }: { raw: unknown }) {
  const defaults = parseSettings(raw, {
    enabled: false,
    threshold_cents: 0,
    label_pt: "",
    label_en: "",
    label_es: "",
  });

  const schema = z.object({
    enabled: z.boolean(),
    threshold_brl: z.number().nonnegative("Deve ser ≥ 0"),
    label_pt: z.string().max(80),
    label_en: z.string().max(80).optional(),
    label_es: z.string().max(80).optional(),
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      enabled: defaults.enabled,
      threshold_brl: defaults.threshold_cents / 100,
      label_pt: defaults.label_pt,
      label_en: defaults.label_en ?? "",
      label_es: defaults.label_es ?? "",
    },
  });

  const [saving, setSaving] = useState(false);
  const enabled = watch("enabled");

  async function onSubmit(data: z.infer<typeof schema>) {
    setSaving(true);
    try {
      await patchSetting("free_shipping", {
        enabled: data.enabled,
        threshold_cents: Math.round(data.threshold_brl * 100),
        label_pt: data.label_pt,
        label_en: data.label_en || undefined,
        label_es: data.label_es || undefined,
      });
      toast.success("Frete grátis salvo");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <ToggleField
        checked={enabled}
        onChange={(v) => setValue("enabled", v)}
        label="Habilitado"
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Valor mínimo (R$)</label>
          <input
            {...register("threshold_brl", { valueAsNumber: true })}
            type="number"
            step="0.01"
            min={0}
            className={inputCls}
            placeholder="299.00"
          />
          {errors.threshold_brl && <p className={errorCls}>{errors.threshold_brl.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Label PT</label>
          <input {...register("label_pt")} className={inputCls} placeholder="Frete grátis acima de R$299" />
          {errors.label_pt && <p className={errorCls}>{errors.label_pt.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Label EN</label>
          <input {...register("label_en")} className={inputCls} placeholder="Free shipping above R$299" />
        </div>
        <div>
          <label className={labelCls}>Label ES</label>
          <input {...register("label_es")} className={inputCls} placeholder="Envío gratis desde R$299" />
        </div>
      </div>
      <SaveButton saving={saving} />
    </form>
  );
}

function MaintenancePanel({ raw }: { raw: unknown }) {
  const defaults = parseSettings(raw, {
    enabled: false,
    message_pt: "",
    message_en: "",
    message_es: "",
    expected_return: null as string | null,
  });

  const schema = z.object({
    enabled: z.boolean(),
    message_pt: z.string().max(200),
    message_en: z.string().max(200).optional(),
    message_es: z.string().max(200).optional(),
    expected_return: z.string().optional(),
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      enabled: defaults.enabled,
      message_pt: defaults.message_pt,
      message_en: defaults.message_en ?? "",
      message_es: defaults.message_es ?? "",
      expected_return: defaults.expected_return ? defaults.expected_return.slice(0, 16) : "",
    },
  });

  const [saving, setSaving] = useState(false);
  const enabled = watch("enabled");

  async function onSubmit(data: z.infer<typeof schema>) {
    setSaving(true);
    try {
      let expectedReturn: string | null = null;
      if (data.expected_return) {
        const d = new Date(data.expected_return);
        if (!isNaN(d.getTime())) expectedReturn = d.toISOString();
      }
      await patchSetting("maintenance", {
        enabled: data.enabled,
        message_pt: data.message_pt,
        message_en: data.message_en || undefined,
        message_es: data.message_es || undefined,
        expected_return: expectedReturn,
      });
      toast.success("Manutenção salva");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <ToggleField checked={enabled} onChange={(v) => setValue("enabled", v)} label="Modo manutenção ativo" />
      <div>
        <label className={labelCls}>Mensagem PT</label>
        <input {...register("message_pt")} className={inputCls} placeholder="Site em manutenção. Voltamos em breve." />
        {errors.message_pt && <p className={errorCls}>{errors.message_pt.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Mensagem EN</label>
          <input {...register("message_en")} className={inputCls} placeholder="Under maintenance." />
        </div>
        <div>
          <label className={labelCls}>Mensagem ES</label>
          <input {...register("message_es")} className={inputCls} placeholder="En mantenimiento." />
        </div>
      </div>
      <div className="w-64">
        <label className={labelCls}>Previsão de retorno (opcional)</label>
        <input {...register("expected_return")} type="datetime-local" className={inputCls} />
      </div>
      <SaveButton saving={saving} />
    </form>
  );
}

function PixelsPanel({ raw }: { raw: unknown }) {
  const defaults = parseSettings(raw, {
    meta_pixel_id: null as string | null,
    ga4_id: null as string | null,
    tiktok_pixel_id: null as string | null,
  });

  const schema = z.object({
    meta_pixel_id: z.string().optional(),
    ga4_id: z.string().optional(),
    tiktok_pixel_id: z.string().optional(),
  });

  const { register, handleSubmit } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      meta_pixel_id: defaults.meta_pixel_id ?? "",
      ga4_id: defaults.ga4_id ?? "",
      tiktok_pixel_id: defaults.tiktok_pixel_id ?? "",
    },
  });

  const [saving, setSaving] = useState(false);

  async function onSubmit(data: z.infer<typeof schema>) {
    setSaving(true);
    try {
      await patchSetting("pixels", {
        meta_pixel_id: data.meta_pixel_id || null,
        ga4_id: data.ga4_id || null,
        tiktok_pixel_id: data.tiktok_pixel_id || null,
      });
      toast.success("Pixels salvos");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className={labelCls}>Meta Pixel ID</label>
        <input {...register("meta_pixel_id")} className={inputCls} placeholder="123456789012345" />
        <p className={helperCls}>Deixe vazio para desativar</p>
      </div>
      <div>
        <label className={labelCls}>Google Analytics 4 ID</label>
        <input {...register("ga4_id")} className={inputCls} placeholder="G-XXXXXXXXXX" />
        <p className={helperCls}>Deixe vazio para desativar</p>
      </div>
      <div>
        <label className={labelCls}>TikTok Pixel ID</label>
        <input {...register("tiktok_pixel_id")} className={inputCls} placeholder="CXXXXXXXXXXXXXXXXX" />
        <p className={helperCls}>Deixe vazio para desativar</p>
      </div>
      <SaveButton saving={saving} />
    </form>
  );
}

function WhatsappPanel({ raw }: { raw: unknown }) {
  const defaults = parseSettings(raw, {
    enabled: false,
    phone: "",
    message_pt: "",
    position: "bottom-right" as "bottom-right" | "bottom-left",
  });

  const schema = z.object({
    enabled: z.boolean(),
    phone: z.string().regex(/^\d{10,15}$/, "Somente dígitos, 10-15 caracteres"),
    message_pt: z.string().max(200),
    position: z.enum(["bottom-right", "bottom-left"]),
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      enabled: defaults.enabled,
      phone: defaults.phone,
      message_pt: defaults.message_pt,
      position: defaults.position,
    },
  });

  const [saving, setSaving] = useState(false);
  const enabled = watch("enabled");

  async function onSubmit(data: z.infer<typeof schema>) {
    setSaving(true);
    try {
      await patchSetting("whatsapp", data);
      toast.success("WhatsApp salvo");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <ToggleField checked={enabled} onChange={(v) => setValue("enabled", v)} label="Botão WhatsApp ativo" />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Telefone (somente dígitos)</label>
          <input {...register("phone")} className={inputCls} placeholder="5511999999999" />
          {errors.phone && <p className={errorCls}>{errors.phone.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Posição</label>
          <select {...register("position")} className={inputCls}>
            <option value="bottom-right">Inferior direito</option>
            <option value="bottom-left">Inferior esquerdo</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelCls}>Mensagem padrão PT</label>
        <input {...register("message_pt")} className={inputCls} placeholder="Olá, gostaria de saber mais..." />
        {errors.message_pt && <p className={errorCls}>{errors.message_pt.message}</p>}
      </div>
      <SaveButton saving={saving} />
    </form>
  );
}

function PopupCapturePanel({ raw }: { raw: unknown }) {
  const defaults = parseSettings(raw, {
    enabled: false,
    title_pt: "",
    description_pt: "",
    primary_label_pt: "",
    secondary_label_pt: "",
    trigger: "exit_intent" as "exit_intent" | "delay" | "scroll" | "manual",
    delay_ms: 5000,
    coupon_code: null as string | null,
    show_once_per_days: 7,
  });

  const schema = z.object({
    enabled: z.boolean(),
    title_pt: z.string().max(60),
    description_pt: z.string().max(200),
    primary_label_pt: z.string().max(30),
    secondary_label_pt: z.string().max(30).optional(),
    trigger: z.enum(["exit_intent", "delay", "scroll", "manual"]),
    delay_ms: z.number().int().nonnegative(),
    coupon_code: z.string().max(40).optional(),
    show_once_per_days: z.number().int().min(1),
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      enabled: defaults.enabled,
      title_pt: defaults.title_pt,
      description_pt: defaults.description_pt,
      primary_label_pt: defaults.primary_label_pt,
      secondary_label_pt: defaults.secondary_label_pt ?? "",
      trigger: defaults.trigger,
      delay_ms: defaults.delay_ms,
      coupon_code: defaults.coupon_code ?? "",
      show_once_per_days: defaults.show_once_per_days,
    },
  });

  const [saving, setSaving] = useState(false);
  const enabled = watch("enabled");
  const trigger = watch("trigger");

  async function onSubmit(data: z.infer<typeof schema>) {
    setSaving(true);
    try {
      await patchSetting("popup_capture", {
        ...data,
        coupon_code: data.coupon_code || null,
        secondary_label_pt: data.secondary_label_pt || undefined,
      });
      toast.success("Pop-up salvo");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <ToggleField checked={enabled} onChange={(v) => setValue("enabled", v)} label="Pop-up ativo" />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Título PT</label>
          <input {...register("title_pt")} className={inputCls} placeholder="Ganhe 10% OFF" />
          {errors.title_pt && <p className={errorCls}>{errors.title_pt.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Gatilho</label>
          <select {...register("trigger")} className={inputCls}>
            <option value="exit_intent">Exit Intent</option>
            <option value="delay">Delay</option>
            <option value="scroll">Scroll</option>
            <option value="manual">Manual</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelCls}>Descrição PT</label>
        <input {...register("description_pt")} className={inputCls} placeholder="Assine nossa newsletter e receba..." />
        {errors.description_pt && <p className={errorCls}>{errors.description_pt.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Label botão primário PT</label>
          <input {...register("primary_label_pt")} className={inputCls} placeholder="Quero meu desconto" />
          {errors.primary_label_pt && <p className={errorCls}>{errors.primary_label_pt.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Label botão secundário PT</label>
          <input {...register("secondary_label_pt")} className={inputCls} placeholder="Não, obrigado" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {trigger === "delay" && (
          <div>
            <label className={labelCls}>Delay (ms)</label>
            <input
              {...register("delay_ms", { valueAsNumber: true })}
              type="number"
              min={0}
              step={500}
              className={inputCls}
            />
          </div>
        )}
        <div>
          <label className={labelCls}>Cupom (opcional)</label>
          <input {...register("coupon_code")} className={`${inputCls} uppercase`} placeholder="BEMVINDO10" />
        </div>
        <div>
          <label className={labelCls}>Exibir 1x a cada (dias)</label>
          <input
            {...register("show_once_per_days", { valueAsNumber: true })}
            type="number"
            min={1}
            className={inputCls}
          />
        </div>
      </div>
      <SaveButton saving={saving} />
    </form>
  );
}

function InstallmentsBulkPanel({ raw }: { raw: unknown }) {
  const defaults = parseSettings(raw, {
    enabled: false,
    threshold_cents: 0,
    installments: 1,
  });

  const schema = z.object({
    enabled: z.boolean(),
    threshold_brl: z.number().nonnegative(),
    installments: z.number().int().min(1).max(12),
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      enabled: defaults.enabled,
      threshold_brl: defaults.threshold_cents / 100,
      installments: defaults.installments,
    },
  });

  const [saving, setSaving] = useState(false);
  const enabled = watch("enabled");

  async function onSubmit(data: z.infer<typeof schema>) {
    setSaving(true);
    try {
      await patchSetting("installments_bulk", {
        enabled: data.enabled,
        threshold_cents: Math.round(data.threshold_brl * 100),
        installments: data.installments,
      });
      toast.success("Parcelamento salvo");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <ToggleField checked={enabled} onChange={(v) => setValue("enabled", v)} label="Parcelamento em massa ativo" />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Acima de (R$)</label>
          <input
            {...register("threshold_brl", { valueAsNumber: true })}
            type="number"
            step="0.01"
            min={0}
            className={inputCls}
            placeholder="199.00"
          />
          {errors.threshold_brl && <p className={errorCls}>{errors.threshold_brl.message}</p>}
          <p className={helperCls}>Acima deste valor, aplica o máximo de parcelas abaixo</p>
        </div>
        <div>
          <label className={labelCls}>Máx. parcelas (1-12)</label>
          <input
            {...register("installments", { valueAsNumber: true })}
            type="number"
            min={1}
            max={12}
            className={inputCls}
          />
          {errors.installments && <p className={errorCls}>{errors.installments.message}</p>}
        </div>
      </div>
      <SaveButton saving={saving} />
    </form>
  );
}

interface HealthData {
 connected: boolean,
 email?: string,
 message: string
}

function MelhorEnvioCard() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [testEmail, setTestEmail] = useState("");
  const [sending, setSending] = useState(false);

  async function fetchHealth() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/melhor-envio/health");
      const data = (await res.json()) as HealthData;
      setHealth(data);
    } catch {
      setHealth({ connected: false, message: "Falha ao verificar" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHealth();
  }, []);

  async function handleTestEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!testEmail) return;
    setSending(true);
    try {
      const res = await fetch("/api/admin/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: testEmail }),
      });
      if (!res.ok) throw new Error("Falha ao enviar");
      toast.success("E-mail de teste enviado");
      setTestEmail("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro");
    } finally {
      setSending(false);
    }
  }

  const statusColor =
    health?.connected
      ? "#00F0FF"
      : !health?.connected
      ? "#FFD700"
      : "#FF00B6";

  return (
    <div className="space-y-4">
      <div className="border-2 border-white/10 bg-[#1a1a1a] shadow-[4px_4px_0_#000]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Truck size={14} className="text-[#00F0FF]/60" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/50 font-semibold">
              Melhor Envio
            </span>
          </div>
          <button
            onClick={fetchHealth}
            disabled={loading}
            className="text-white/20 hover:text-white/50 transition-colors"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
        <div className="px-4 py-4">
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 size={14} className="text-white/20 animate-spin" />
              <span className="font-mono text-[10px] text-white/20">Verificando…</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {health?.connected ? (
                  <CheckCircle2 size={14} style={{ color: statusColor }} />
                ) : (
                  <XCircle size={14} style={{ color: statusColor }} />
                )}
                <span
                  className="font-mono text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: statusColor }}
                >
                  {health?.connected ? "Conectado" : !health?.connected && "Erro"}
                </span>
              </div>
              {health?.message && (
                <p className="font-mono text-[10px] text-white/30 leading-relaxed">
                  {health.message}
                </p>
              )}
              {!health?.connected && (
                <Link
                  href="/api/admin/melhor-envio/oauth/start"
                  className="inline-block font-mono text-[10px] uppercase tracking-widest border border-[#FFD700]/40 text-[#FFD700] px-3 py-1.5 hover:border-[#FFD700] transition-colors mt-1"
                >
                  Reconectar
                </Link>
              )}
              {/* {health?.quota && (
                <p className="font-mono text-[10px] text-white/25">
                  Quota: {health.quota.remaining}/{health.quota.limit}
                </p>
              )}
              {health?.expires_at && (
                <p className="font-mono text-[10px] text-white/20">
                  Token expira:{" "}
                  {new Date(health.expires_at).toLocaleDateString("pt-BR")}
                </p>
              )} */}
            </div>
          )}
        </div>
      </div>

      <div className="border-2 border-white/10 bg-[#1a1a1a] shadow-[4px_4px_0_#000]">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
          <Send size={13} className="text-[#FF00B6]/60" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/50 font-semibold">
            Test Email
          </span>
        </div>
        <form onSubmit={handleTestEmail} className="px-4 py-4 space-y-3">
          <div>
            <label className={labelCls}>Destinatário</label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className={inputCls}
              placeholder="admin@serenaglasses.com.br"
            />
          </div>
          <button
            type="submit"
            disabled={sending || !testEmail}
            className="flex items-center gap-2 border-2 border-[#FF00B6]/40 text-[#FF00B6] font-mono text-[10px] uppercase tracking-widest px-4 py-2 hover:bg-[#FF00B6]/10 transition-colors disabled:opacity-30"
          >
            {sending ? <Loader2 size={11} className="animate-spin" /> : <Send size={11} />}
            {sending ? "Enviando…" : "Enviar teste"}
          </button>
        </form>
      </div>
    </div>
  );
}

const PANELS = [
  { id: "free_shipping", title: "Frete Grátis", icon: Truck },
  { id: "maintenance", title: "Manutenção", icon: AlertTriangle },
  { id: "pixels", title: "Pixels & Analytics", icon: Zap },
  { id: "whatsapp", title: "WhatsApp", icon: MessageCircle },
  { id: "popup_capture", title: "Pop-up Capture", icon: MousePointerClick },
  { id: "installments_bulk", title: "Parcelamento em Massa", icon: CreditCard },
] as const;

type PanelId = (typeof PANELS)[number]["id"];

const PANEL_COMPONENTS: Record<PanelId, React.ComponentType<{ raw: unknown }>> = {
  free_shipping: FreeShippingPanel,
  maintenance: MaintenancePanel,
  pixels: PixelsPanel,
  whatsapp: WhatsappPanel,
  popup_capture: PopupCapturePanel,
  installments_bulk: InstallmentsBulkPanel,
};

export default function SettingsClient({ settings }: Props) {
  const [openPanel, setOpenPanel] = useState<PanelId | null>("free_shipping");

  function toggle(id: PanelId) {
    setOpenPanel((prev) => (prev === id ? null : id));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 mb-6">
        <Settings size={24} className="text-[#FF00B6]" />
        <h1 className="font-shrikhand text-3xl text-white tracking-wider">
          CONFIGURAÇÕES
        </h1>
      </div>

      <div className="flex gap-6 items-start">
        <div className="flex-1 space-y-2 min-w-0">
          {PANELS.map(({ id, title, icon }) => {
            const PanelForm = PANEL_COMPONENTS[id];
            return (
              <AccordionPanel
                key={id}
                id={id}
                title={title}
                icon={icon}
                isOpen={openPanel === id}
                onToggle={() => toggle(id)}
              >
                <PanelForm raw={settings[id]} />
              </AccordionPanel>
            );
          })}
        </div>

        <div className="w-72 shrink-0">
          <MelhorEnvioCard />
        </div>
      </div>
    </div>
  );
}
