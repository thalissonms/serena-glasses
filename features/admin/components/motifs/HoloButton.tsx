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
        "inline-flex items-center justify-center gap-2",
        "px-8 py-4 font-shrikhand text-lg uppercase tracking-widest text-black",
        "bg-linear-to-r from-[#FF00B6] via-[#00F0FF] to-[#FFD700] bg-[length:300%_100%] animate-holo",
        "shadow-[6px_6px_0_#00F0FF] hover:shadow-[3px_3px_0_#00F0FF] hover:translate-y-px",
        "active:shadow-none active:translate-y-0.5",
        "transition-all duration-150",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0",
        className,
      )}
    >
      {children}
    </button>
  );
}
