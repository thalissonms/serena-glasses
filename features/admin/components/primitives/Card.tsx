/**
 * Component: Card — container de conteúdo com 3 variantes Cyber HUD.
 *
 * flat: fundo vazio escuro | cyber: borda cyan sutil | neon: borda magenta ativa
 *
 * Usado em: seções de dashboard, formulários e listagens do /admin.
 */
import { type ReactNode } from "react";
import { clsx } from "clsx";

type Variant = "flat" | "cyber" | "neon";

interface Props {
  children: ReactNode;
  variant?: Variant;
  padding?: boolean;
  className?: string;
  title?: string;
}

const variantClasses: Record<Variant, string> = {
  flat: "bg-[#050505] border border-white/5",
  cyber: "bg-[#0a0a0a] border border-brand-pink/20 shadow-[inset_0_0_15px_rgba(255,0,182,0.03)]",
  neon: "bg-brand-pink/5 border border-brand-pink/30 shadow-[inset_0_0_20px_rgba(255,0,182,0.05)]",
};

export function Card({ children, variant = "flat", padding = true, className, title }: Props) {
  return (
    <div className={clsx("relative rounded-none", variantClasses[variant], className)}>
      {/* Decorative corners for cyber/neon variants */}
      {(variant === "cyber" || variant === "neon") && (
        <>
          <div className={clsx("absolute -left-[1px] -top-[1px] h-2 w-2 border-l border-t", variant === "cyber" ? "border-brand-pink" : "border-brand-pink")}></div>
          <div className={clsx("absolute -right-[1px] -top-[1px] h-2 w-2 border-r border-t", variant === "cyber" ? "border-brand-pink" : "border-brand-pink")}></div>
          <div className={clsx("absolute -left-[1px] -bottom-[1px] h-2 w-2 border-l border-b", variant === "cyber" ? "border-brand-pink" : "border-brand-pink")}></div>
          <div className={clsx("absolute -right-[1px] -bottom-[1px] h-2 w-2 border-r border-b", variant === "cyber" ? "border-brand-pink" : "border-brand-pink")}></div>
        </>
      )}

      <div className={clsx("h-full w-full", padding && "p-6")}>
        {title && (
          <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3">
            <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-brand-pink">
              // {title}
            </p>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
