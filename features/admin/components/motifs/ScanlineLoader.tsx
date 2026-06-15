/**
 * Component: ScanlineLoader — loader full-screen com scanlines e texto monospace Y2K.
 *
 * Overlay fixo escuro com linha de scan animada, grid de fundo e barras de loading.
 * Bloqueia interação quando ativo via fixed inset 0.
 *
 * Usado em: transições de página longas e operações de batch no /admin.
 */
interface Props {
  message?: string;
}

export function ScanlineLoader({ message = "LOADING SYSTEM DATA" }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 opacity-4 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: [
            "linear-gradient(rgba(255,0,182,0.6) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(255,0,182,0.6) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "40px 40px",
        }}
      />

      <div
        className="absolute left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-brand-pink to-transparent opacity-70 animate-scanline pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative flex flex-col items-center gap-7 z-10">
        <p
          className="font-shrikhand text-5xl text-brand-pink animate-neon-pulse"
        >
          SERENA
        </p>

        <div className="flex flex-col items-center gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.5em] text-brand-pink">
            {message}
          </p>
          <div className="flex gap-1">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="w-[3px] h-4 bg-brand-pink animate-neon-pulse rounded-none border border-brand-pink/30"
                style={{ animationDelay: `${i * 0.06}s` }}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
