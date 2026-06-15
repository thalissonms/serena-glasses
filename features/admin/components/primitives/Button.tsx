"use client";
/**
 * Component: Button — botão polimórfico com 4 variantes Cyber HUD.
 *
 * primary: neon cyan com brackets | secondary: border fina escuro |
 * ghost: transparente hover cyan | danger: red tactical glow. Sizes: sm / md / lg.
 *
 * Usado em: toda a UI do /admin.
 */
import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { clsx } from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: [
    "group relative overflow-hidden bg-brand-pink/5 border border-brand-pink/40",
    "text-brand-pink hover:bg-brand-pink/15 hover:border-brand-pink",
    "shadow-[inset_0_0_15px_rgba(255,0,182,0.05)]",
    "before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-brand-pink before:transition-all hover:before:w-[4px]",
  ].join(" "),
  secondary: [
    "bg-[#0a0a0a] text-white/40 border border-white/10",
    "hover:border-white/30 hover:text-white/80 hover:bg-[#0a0a0a]",
  ].join(" "),
  ghost: [
    "bg-transparent text-white/40 border border-transparent",
    "hover:border-brand-pink/20 hover:text-brand-pink hover:bg-brand-pink/5",
  ].join(" "),
  danger: [
    "bg-red-500/5 text-red-500 border border-red-500/30",
    "hover:border-red-500 hover:bg-red-500/15",
    "shadow-[inset_0_0_15px_rgba(239,68,68,0.05)]",
  ].join(" "),
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-[11px] tracking-widest",
  md: "px-6 py-2.5 text-[12px] tracking-widest",
  lg: "px-8 py-3.5 text-[13px] tracking-[0.2em]",
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  loading,
  disabled,
  className,
  type = "button",
  ...props
}: Props) {
  return (
    <button
      type={type}
      {...props}
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center gap-2",
        "font-mono font-semibold uppercase rounded-none",
        "transition-all duration-150 cursor-pointer",
        "disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-transparent",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {loading ? (
        <span className="animate-pulse tracking-widest">PROCESSANDO...</span>
      ) : (
        <>
          {variant === "primary" && <span className="opacity-40">[</span>}
          {children}
          {variant === "primary" && <span className="opacity-40">]</span>}
        </>
      )}
    </button>
  );
}
