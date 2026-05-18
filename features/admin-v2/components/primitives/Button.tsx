"use client";
/**
 * Component: Button — botão polimórfico com 4 variantes Y2K Chrome.
 *
 * primary: holo gradient + shadow cyan | secondary: chrome bevel inset |
 * ghost: transparent + pink border | danger: red glow. Sizes: sm / md / lg.
 *
 * Usado em: toda a UI do /admin-v2.
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
    "bg-linear-to-r from-[#FF00B6] via-[#00F0FF] to-[#FFD700] bg-[length:200%_100%] animate-holo",
    "text-black font-black border-2 border-transparent",
    "shadow-[4px_4px_0_#00F0FF] hover:shadow-[2px_2px_0_#00F0FF] hover:translate-y-px",
    "active:shadow-none active:translate-y-0.5",
  ].join(" "),
  secondary: [
    "bg-[#1a1a1a] text-white/80 border-2 border-white/10",
    "shadow-[inset_1px_1px_0_rgba(255,255,255,0.08),inset_-1px_-1px_0_rgba(0,0,0,0.5)]",
    "hover:border-white/20 hover:text-white",
  ].join(" "),
  ghost: [
    "bg-transparent text-[#FF00B6] border-2 border-[#FF00B6]/30",
    "hover:border-[#FF00B6] hover:bg-[#FF00B6]/8",
    "hover:shadow-[0_0_12px_rgba(255,0,182,0.25)]",
  ].join(" "),
  danger: [
    "bg-transparent text-red-400 border-2 border-red-500/30",
    "hover:border-red-400 hover:bg-red-500/8",
    "hover:shadow-[0_0_12px_rgba(239,68,68,0.25)]",
  ].join(" "),
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-[9px] tracking-[0.15em]",
  md: "px-5 py-2.5 text-[10px] tracking-[0.2em]",
  lg: "px-8 py-3.5 text-[12px] tracking-[0.2em]",
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  loading,
  disabled,
  className,
  ...props
}: Props) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center gap-2",
        "font-poppins font-bold uppercase",
        "transition-all duration-150 cursor-pointer",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {loading ? (
        <span className="font-mono text-[10px] animate-neon-pulse">...</span>
      ) : (
        children
      )}
    </button>
  );
}
