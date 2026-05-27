/**
 * Component: Badge — badge de status com variantes cromadas Y2K para o /admin.
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
      "text-[#FFD700] border-[#FFD700]/40 bg-[#FFD700]/8 shadow-[0_0_8px_rgba(255,215,0,0.15)]",
  },
  paid: {
    label: "Pago",
    classes:
      "text-[#00F0FF] border-[#00F0FF]/40 bg-[#00F0FF]/8 shadow-[0_0_8px_rgba(0,240,255,0.15)]",
  },
  processing: {
    label: "Processando",
    classes: "text-blue-400 border-blue-500/30 bg-blue-500/8",
  },
  shipped: {
    label: "Enviado",
    classes:
      "text-[#FF00B6] border-[#FF00B6]/40 bg-[#FF00B6]/8 shadow-[0_0_8px_rgba(255,0,182,0.15)]",
  },
  delivered: {
    label: "Entregue",
    classes: "text-emerald-400 border-emerald-500/30 bg-emerald-500/8",
  },
  cancelled: {
    label: "Cancelado",
    classes: "text-white/30 border-white/10 bg-white/3",
  },
  refunded: {
    label: "Reembolsado",
    classes: "text-red-400 border-red-500/30 bg-red-500/8",
  },
  ready: {
    label: "Pronto",
    classes: "text-emerald-400 border-emerald-500/30 bg-emerald-500/8",
  },
  scaffold: {
    label: "Scaffold",
    classes: "text-[#00F0FF]/60 border-[#00F0FF]/20 bg-[#00F0FF]/4",
  },
};

export function Badge({ variant, label, className }: Props) {
  if (variant === "dev") {
    return (
      <span
        className={clsx(
          "inline-flex items-center px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.25em] font-bold border border-[#FF00B6]/30",
          "bg-linear-to-r from-[#FF00B6] via-[#00F0FF] to-[#FFD700] bg-[length:200%_100%] animate-holo bg-clip-text text-transparent",
          className,
        )}
      >
        {label ?? "Em Desenvolvimento"}
      </span>
    );
  }

  const config = VARIANT_CONFIG[variant];

  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.25em] border",
        config.classes,
        className,
      )}
    >
      {label ?? config.label}
    </span>
  );
}
