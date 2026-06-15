/**
 * Component: ChromeFrame — container com chrome bevel Y2K e glow opcional.
 *
 * Usa inset shadows para simular superfície elevada cromada dos anos 2000.
 * Glow externo configurável em pink, cyan ou gold. Wrapper puramente visual.
 *
 * Usado em: painéis de destaque, widgets do dashboard e seções especiais do /admin.
 */
import { type ReactNode } from "react";
import { clsx } from "clsx";

type GlowColor = "pink" | "cyan" | "gold" | "none";

interface Props {
  children: ReactNode;
  className?: string;
  glow?: GlowColor;
}

const glowMap: Record<GlowColor, string> = {
  pink: `border-[var(--brand-pink)]/30 shadow-[inset_0_0_15px_rgba(255,0,182,0.1)]`,
  cyan: `border-cyan-400/30 shadow-[inset_0_0_15px_rgba(34,211,238,0.1)]`,
  gold: `border-[#FFD700]/30 shadow-[inset_0_0_15px_rgba(255,215,0,0.1)]`,
  none: `border-white/10`,
};

export function ChromeFrame({ children, className, glow = "none" }: Props) {
  return (
    <div
      className={clsx(
        "bg-[#050505] border rounded-none",
        glowMap[glow],
        className,
      )}
    >
      {children}
    </div>
  );
}
