/**
 * Page: AdminV2NotFoundPage — catch-all SCAFFOLD para rotas do /admin-v2 sem página dedicada.
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
  await requireAdmin("/admin-v2/login");
  const { slug } = await params;
  const routeLabel = slug.join(" / ").replace(/-/g, " ").toUpperCase();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      {/* DevBadge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#FF00B6]/20 bg-[#FF00B6]/4">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-neon-pulse shrink-0" aria-hidden="true" />
        <span
          className="font-mono text-[9px] uppercase tracking-[0.3em] font-bold"
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

      {/* Icon */}
      <div className="w-16 h-16 border border-white/10 bg-[#1a1a1a] flex items-center justify-center shadow-[4px_4px_0_#FF00B6]/30">
        <Construction size={28} className="text-[#FF00B6]/40" />
      </div>

      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="font-shrikhand text-3xl text-white tracking-wide">
          {routeLabel}
        </h1>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/25">
          Esta funcionalidade ainda está sendo implementada
        </p>
      </div>

      {/* Info box */}
      <div className="border border-white/8 bg-[#111] p-6 max-w-md w-full space-y-3">
        <p className="font-mono text-[9px] text-white/20 uppercase tracking-[0.25em]">
          Rota: <span className="text-[#00F0FF]/40">/admin-v2/{slug.join("/")}</span>
        </p>
        <p className="font-mono text-[9px] text-white/20 uppercase tracking-[0.25em]">
          Status: <span className="text-[#FFD700]/40">Planejado — backend pendente</span>
        </p>
        <p className="font-mono text-[9px] text-white/15 leading-relaxed">
          Consulte o plano em{" "}
          <span className="text-[#00F0FF]/30">AGENT/ADMIN_CMS_PLAN.md</span>{" "}
          para o cronograma de implementação desta área.
        </p>
      </div>
    </div>
  );
}
