/**
 * Component: AsciiEmpty — empty state com arte ASCII Y2K e mensagem descritiva.
 *
 * Frame ASCII com mensagem monospace uppercase. Aceita CTA opcional como ReactNode.
 *
 * Usado em: estados vazios de tabelas, listagens sem resultado e buscas do /admin.
 */
import { type ReactNode } from "react";

interface Props {
  message?: string;
  description?: string;
  cta?: ReactNode;
}

export function AsciiEmpty({
  message = "NADA AQUI AINDA",
  description,
  cta,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5 select-none">
      <pre
        className="font-mono text-[11px] leading-relaxed text-white/12 text-center"
        aria-hidden="true"
      >
        {`╔═══════════════════════════════╗
║  ·   ˚  ✦  ˚  ·   ˚  ✦  ˚  ·  ║
║                               ║
║      ¯\\_(ツ)_/¯               ║
║                               ║
╚═══════════════════════════════╝`}
      </pre>
      <div className="flex flex-col items-center gap-2">
        <p className="font-mono text-[12px] uppercase tracking-[0.35em] text-white/25">
          {message}
        </p>
        {description && (
          <p className="font-mono text-[11px] text-white/15 text-center max-w-[280px] leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {cta}
    </div>
  );
}
