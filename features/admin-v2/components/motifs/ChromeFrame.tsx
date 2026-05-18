/**
 * Component: ChromeFrame — container com chrome bevel Y2K e glow opcional.
 *
 * Usa inset shadows para simular superfície elevada cromada dos anos 2000.
 * Glow externo configurável em pink, cyan ou gold. Wrapper puramente visual.
 *
 * Usado em: painéis de destaque, widgets do dashboard e seções especiais do /admin-v2.
 */
import { type ReactNode } from "react";
import { clsx } from "clsx";

type GlowColor = "pink" | "cyan" | "gold" | "none";

interface Props {
  children: ReactNode;
  className?: string;
  glow?: GlowColor;
}

const bevel = "inset_1px_1px_0_rgba(255,255,255,0.08),inset_-1px_-1px_0_rgba(0,0,0,0.5)";

const glowMap: Record<GlowColor, string> = {
  pink: `shadow-[0_0_24px_rgba(255,0,182,0.2),${bevel}]`,
  cyan: `shadow-[0_0_24px_rgba(0,240,255,0.2),${bevel}]`,
  gold: `shadow-[0_0_24px_rgba(255,215,0,0.2),${bevel}]`,
  none: `shadow-[${bevel}]`,
};

export function ChromeFrame({ children, className, glow = "none" }: Props) {
  return (
    <div
      className={clsx(
        "bg-[#1a1a1a] border border-white/10",
        glowMap[glow],
        className,
      )}
    >
      {children}
    </div>
  );
}
