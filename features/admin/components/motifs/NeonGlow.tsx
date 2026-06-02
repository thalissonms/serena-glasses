/**
 * Component: NeonGlow — wrapper que aplica drop-shadow neon ao children.
 *
 * Usa CSS filter para emitir glow na cor configurada. Intensidades: sm/md/lg.
 * Pulse opcional adiciona animação de opacidade.
 *
 * Usado em: ícones de destaque, textos de status crítico e elementos de alerta.
 */
import { type ReactNode, type CSSProperties } from "react";

type Intensity = "sm" | "md" | "lg";

interface Props {
  children: ReactNode;
  color?: string;
  intensity?: Intensity;
  pulse?: boolean;
}

const intensityPx: Record<Intensity, number> = { sm: 4, md: 8, lg: 16 };

export function NeonGlow({ children, color = "var(--brand-pink)", intensity = "md", pulse }: Props) {
  const px = intensityPx[intensity];
  const style: CSSProperties = {
    filter: `drop-shadow(0 0 ${px}px ${color}) drop-shadow(0 0 ${px * 2}px ${color}40)`,
  };

  return (
    <span style={style} className={pulse ? "animate-neon-pulse" : undefined}>
      {children}
    </span>
  );
}
