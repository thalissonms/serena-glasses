/**
 * Component: Card — container de conteúdo com 3 variantes Y2K Chrome.
 *
 * flat: bg simples | chrome: chrome bevel (inset shadow) | holo: border gradient animada.
 * Variante holo usa wrapper extra com gradient para simular border colorida.
 *
 * Usado em: seções de dashboard, formulários e listagens do /admin-v2.
 */
import { type ReactNode } from "react";
import { clsx } from "clsx";

type Variant = "flat" | "chrome" | "holo";

interface Props {
  children: ReactNode;
  variant?: Variant;
  padding?: boolean;
  className?: string;
  title?: string;
}

const variantClasses: Record<"flat" | "chrome", string> = {
  flat: "bg-[#141414] border border-white/5",
  chrome: [
    "bg-[#141414] border border-white/10",
    "shadow-[inset_1px_1px_0_rgba(255,255,255,0.06),inset_-1px_-1px_0_rgba(0,0,0,0.4)]",
  ].join(" "),
};

function CardInner({
  children,
  title,
  padding,
  className,
}: Pick<Props, "children" | "title" | "padding" | "className">) {
  return (
    <div className={clsx(padding && "p-5", className)}>
      {title && (
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30 mb-4 pb-3 border-b border-white/5">
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

export function Card({ children, variant = "flat", padding = true, className, title }: Props) {
  if (variant === "holo") {
    return (
      <div className="p-[2px] bg-linear-to-r from-[#FF00B6] via-[#00F0FF] to-[#FFD700] bg-[length:200%_100%] animate-holo">
        <div className="bg-[#141414]">
          <CardInner title={title} padding={padding} className={className}>
            {children}
          </CardInner>
        </div>
      </div>
    );
  }

  return (
    <div className={variantClasses[variant]}>
      <CardInner title={title} padding={padding} className={className}>
        {children}
      </CardInner>
    </div>
  );
}
