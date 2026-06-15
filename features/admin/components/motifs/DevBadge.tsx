/**
 * Component: DevBadge — badge "Em Desenvolvimento" para páginas SCAFFOLD.
 *
 * Gradient holográfico animado com dot pulsante cyan. Renderizar como primeiro
 * elemento do conteúdo de pages com status SCAFFOLD.
 *
 * Usado em: todas as páginas /admin com status SCAFFOLD.
 */
export function DevBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-brand-pink/20 bg-brand-pink/4 mb-6">
      <span
        className="w-1.5 h-1.5 rounded-none bg-brand-pink animate-neon-pulse shrink-0"
        aria-hidden="true"
      />
      <span
        className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold"
        style={{
          background: "linear-gradient(90deg, var(--brand-pink), brand-pink, #FFD700)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Em Desenvolvimento
      </span>
    </div>
  );
}
