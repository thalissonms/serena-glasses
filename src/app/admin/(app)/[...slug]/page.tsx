/**
 * Page: AdminV2NotFoundPage — catch-all SCAFFOLD para rotas do /admin sem página dedicada.
 *
 * Exibe "Em Desenvolvimento" com Y2K Chrome para qualquer sub-rota inexistente.
 * Rotas com page.tsx dedicado têm precedência (Next.js App Router).
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import { Construction } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export default async function AdminV2CatchAllPage({ params }: Props) {
  await requireAdmin("/admin/login");
  const { slug } = await params;
  const routeLabel = slug.join(" / ").replace(/-/g, " ").toUpperCase();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      {/* DevBadge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 border border-brand-pink/20 bg-brand-pink/4">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-pink animate-neon-pulse shrink-0" aria-hidden="true" />
        <span
          className="font-mono text-[11px] uppercase tracking-[0.3em] font-bold"
          style={{
            background: "linear-gradient(90deg, var(--brand-pink), var(--brand-pink), #FFD700)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Em Desenvolvimento
        </span>
      </div>

      {/* Icon */}
      <div className="w-16 h-16 border border-white/10 bg-[#0a0a0a] flex items-center justify-center shadow-[4px_4px_0_var(--brand-pink)]/30">
        <Construction size={28} className="text-brand-pink/40" />
      </div>

      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="font-poppins text-3xl text-white tracking-wide">
          {routeLabel}
        </h1>
        <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-white/25">
          Esta funcionalidade ainda está sendo implementada
        </p>
      </div>

      {/* Info box */}
      <div className="border border-white/8 bg-[#111] p-6 max-w-md w-full space-y-3">
        <p className="font-mono text-[11px] text-white/20 uppercase tracking-[0.25em]">
          Rota: <span className="text-brand-pink/40">/admin/{slug.join("/")}</span>
        </p>
        <p className="font-mono text-[11px] text-white/20 uppercase tracking-[0.25em]">
          Status: <span className="text-[#FFD700]/40">Planejado — backend pendente</span>
        </p>
        <p className="font-mono text-[11px] text-white/15 leading-relaxed">
          Consulte o plano em{" "}
          <span className="text-brand-pink/30">AGENT/ADMIN_CMS_PLAN.md</span>{" "}
          para o cronograma de implementação desta área.
        </p>
      </div>
    </div>
  );
}
