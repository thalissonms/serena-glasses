/**
 * Component: DevBadge — badge "Em Desenvolvimento" para páginas SCAFFOLD.
 *
 * Gradient holográfico animado com dot pulsante cyan. Renderizar como primeiro
 * elemento do conteúdo de pages com status SCAFFOLD.
 *
 * Usado em: todas as páginas /admin-v2 com status SCAFFOLD.
 */
export function DevBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#FF00B6]/20 bg-[#FF00B6]/4 mb-6">
      <span
        className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-neon-pulse flex-shrink-0"
        aria-hidden="true"
      />
      <span
        className="font-mono text-[8px] uppercase tracking-[0.3em] font-bold"
        style={{
          background: "linear-gradient(90deg, #FF00B6, #00F0FF, #FFD700)",
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
