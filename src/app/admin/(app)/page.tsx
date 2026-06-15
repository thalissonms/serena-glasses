/**
 * Page: AdminV2Dashboard — painel de controle principal do admin.
 *
 * Row 1: tira de métricas (receita/pedidos/AOV/clientes) com seletor Hoje/7d/30d/Total.
 * Row 2: gráfico de barras de receita (últimos 30 dias).
 * Row 3: últimos 10 pedidos + alertas de estoque baixo.
 * Row 4: status da integração Melhor Envio.
 *
 * Usado em: rota /admin.
 */
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { requireAdmin } from "@shared/lib/auth/admin";
import { getDashboardV2Data } from "@features/admin/services/dashboard.service";
import { meRequest } from "@shared/lib/melhor-envio/client";
import { MetricStrip } from "@features/admin/components/dashboard/MetricStrip";
import { SalesChart } from "@features/admin/components/dashboard/SalesChart";
import { LatestOrdersTable } from "@features/admin/components/dashboard/LatestOrdersTable";
import { LowStockAlerts } from "@features/admin/components/dashboard/LowStockAlerts";
import { MelhorEnvioCard } from "@features/admin/components/dashboard/MelhorEnvioCard";

const getMeHealth = unstable_cache(
  async (): Promise<{ connected: boolean; accountEmail: string | null }> => {
    try {
      const me = await meRequest<{ email: string }>("GET", "/api/v2/me");
      return { connected: true, accountEmail: me.email };
    } catch {
      return { connected: false, accountEmail: null };
    }
  },
  ["me-health-v2"],
  { revalidate: 300 },
);

export default async function AdminV2Dashboard() {
  await requireAdmin("/admin/login");

  const [data, health] = await Promise.all([
    getDashboardV2Data(),
    getMeHealth(),
  ]);

  const lowStockCount = data.lowStockAlerts.length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col mb-4 mt-2">
          <span className="font-poppins text-[32px] text-white leading-none tracking-wide">
            Dashboard
          </span>
          <span className="font-mono text-[18px] uppercase tracking-[0.3em] text-brand-pink-light/60 mt-2">
            Serena Admin · Sistema Operacional
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {data.pendingCount > 0 && (
            <Link
              href="/admin/orders?status=pending"
              className="flex items-center gap-2 px-3 py-1.5 border border-brand-yellow/25 bg-brand-yellow/5 hover:bg-brand-yellow/10 transition-colors"
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse shrink-0"
                style={{ boxShadow: "0 0 6px #FFD700" }}
                aria-hidden="true"
              />
              <span className="font-mono text-[10px] uppercase tracking-wider text-brand-yellow">
                {data.pendingCount}{" "}
                {data.pendingCount === 1 ? "pendente" : "pendentes"}
              </span>
            </Link>
          )}
          {lowStockCount > 0 && (
            <span className="flex items-center gap-2 px-3 py-1.5 border border-[#FF3355]/20 bg-[#FF3355]/5">
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#FF3355] shrink-0"
                style={{ boxShadow: "0 0 5px #FF3355" }}
                aria-hidden="true"
              />
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#FF3355]/80">
                {lowStockCount} estoque baixo
              </span>
            </span>
          )}
        </div>
      </div>

      <MetricStrip
        today={data.today}
        week={data.week}
        month={data.month}
        allTime={data.allTime}
      />

      <SalesChart data={data.sparkline} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <section
          className="bg-[#050505] border border-brand-pink/20 relative overflow-hidden shadow-[inset_0_0_15px_rgba(255,0,182,0.05)]"
          aria-label="Últimos pedidos"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow:
                "inset 1px 1px 0 rgba(255,255,255,0.05), inset -1px -1px 0 rgba(0,0,0,0.4)",
            }}
            aria-hidden="true"
          />
          <div className="relative z-10 p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/40">
                Últimos Pedidos
              </p>
              <Link
                href="/admin/orders"
                className="font-mono text-[14px] uppercase tracking-wider text-brand-blue/60 hover:text-brand-blue transition-colors"
              >
                Ver todos →
              </Link>
            </div>
            <LatestOrdersTable orders={data.latestOrders} />
          </div>
        </section>

        <section
          className="bg-[#050505] border border-brand-pink/20 relative shadow-[inset_0_0_15px_rgba(255,0,182,0.05)] overflow-hidden"
          aria-label="Alertas de estoque"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow:
                "inset 1px 1px 0 rgba(255,255,255,0.05), inset -1px -1px 0 rgba(0,0,0,0.4)",
            }}
            aria-hidden="true"
          />
          <div className="relative z-10 p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/40">
                Estoque Baixo
              </p>
              <span className="font-mono text-4 text-white/25">
                {"< 5 unidades"}
              </span>
            </div>
              <LowStockAlerts items={data.lowStockAlerts} />
          </div>
        </section>
      </div>

      <div
        className="bg-[#050505] border border-brand-pink/20 p-5 shadow-[inset_0_0_15px_rgba(255,0,182,0.05)] relative overflow-hidden"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow:
              "inset 1px 1px 0 rgba(255,255,255,0.05), inset -1px -1px 0 rgba(0,0,0,0.4)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <span className="font-mono text-[22px] uppercase tracking-[0.35em] text-white/40 shrink-0">
            Melhor Envio
          </span>
          <MelhorEnvioCard
            connected={health.connected}
            accountEmail={health.accountEmail}
          />
        </div>
      </div>
    </div>
  );
}
