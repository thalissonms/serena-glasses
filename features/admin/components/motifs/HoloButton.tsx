"use client";
/**
 * Component: HoloButton — botão CTA especial com gradient holográfico animado.
 *
 * Gradient pink→cyan→gold em loop contínuo. Hard shadow cyan. Para ações de máxima prioridade.
 * Mais impactante que o Button primary — reservar para 1 CTA por página.
 *
 * Usado em: CTAs principais de hero sections e calls-to-action de dashboard.
 */
import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { clsx } from "clsx";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function HoloButton({ children, className, disabled, ...props }: Props) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-none",
        "px-8 py-4 font-shrikhand text-lg uppercase tracking-widest text-black",
        "bg-linear-to-r from-[var(--brand-pink)] via-brand-pink to-[#FFD700] bg-[length:300%_100%] animate-holo",
        "border border-brand-pink/30 shadow-[inset_0_0_15px_rgba(255,0,182,0.1)] hover:shadow-none hover:bg-brand-pink-light",
        "active:shadow-none",
        "transition-all duration-150",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        className,
      )}
    >
      [ {children} ]
    </button>
  );
}
