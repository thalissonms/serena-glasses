/**
 * Component: Badge — badge de status com estética Cyber HUD.
 *
 * Status: pending (gold), paid (cyan), processing (blue), shipped (pink),
 * delivered (green), cancelled (gray), refunded (red). Especial: dev (holo animado).
 *
 * Usado em: tabelas de pedidos, listagens e headers de páginas SCAFFOLD.
 */
import { clsx } from "clsx";

type BadgeVariant =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "dev"
  | "ready"
  | "scaffold";

interface Props {
  variant: BadgeVariant;
  label?: string;
  className?: string;
}

const VARIANT_CONFIG: Record<
  Exclude<BadgeVariant, "dev">,
  { label: string; classes: string }
> = {
  pending: {
    label: "Pendente",
    classes:
      "text-[#FFD700] border-[#FFD700]/40 bg-[#FFD700]/5 shadow-[inset_0_0_10px_rgba(255,215,0,0.1)]",
  },
  paid: {
    label: "Pago",
    classes:
      "text-brand-pink border-brand-pink/40 bg-brand-pink/5 shadow-[inset_0_0_10px_rgba(255,0,182,0.1)]",
  },
  processing: {
    label: "Processando",
    classes: "text-blue-400 border-blue-500/40 bg-blue-500/5 shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]",
  },
  shipped: {
    label: "Enviado",
    classes:
      "text-brand-pink border-brand-pink/40 bg-brand-pink/5 shadow-[inset_0_0_10px_rgba(255,0,182,0.1)]",
  },
  delivered: {
    label: "Entregue",
    classes: "text-emerald-400 border-emerald-500/40 bg-emerald-500/5 shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]",
  },
  cancelled: {
    label: "Cancelado",
    classes: "text-white/40 border-white/20 bg-[#050505] shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]",
  },
  refunded: {
    label: "Reembolsado",
    classes: "text-red-500 border-red-500/40 bg-red-500/5 shadow-[inset_0_0_10px_rgba(239,68,68,0.1)]",
  },
  ready: {
    label: "Pronto",
    classes: "text-emerald-400 border-emerald-500/40 bg-emerald-500/5 shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]",
  },
  scaffold: {
    label: "Scaffold",
    classes: "text-brand-pink/60 border-brand-pink/20 bg-brand-pink/5",
  },
};

export function Badge({ variant, label, className }: Props) {
  if (variant === "dev") {
    return (
      <span
        className={clsx(
          "inline-flex items-center px-2 py-0.5 font-mono text-[11px] uppercase tracking-widest font-bold border border-brand-pink/30",
          "bg-linear-to-r from-[var(--brand-pink)] via-brand-pink to-[#FFD700] bg-[length:200%_100%] animate-holo bg-clip-text text-transparent rounded-none",
          className,
        )}
      >
        <span className="opacity-40 mr-1 text-brand-pink">[</span>
        {label ?? "Em Desenvolvimento"}
        <span className="opacity-40 ml-1 text-brand-pink">]</span>
      </span>
    );
  }

  const config = VARIANT_CONFIG[variant];

  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 font-mono text-[11px] uppercase tracking-widest border rounded-none whitespace-nowrap",
        config.classes,
        className,
      )}
    >
      <span className="opacity-40 mr-1">[</span>
      {label ?? config.label}
      <span className="opacity-40 ml-1">]</span>
    </span>
  );
}
