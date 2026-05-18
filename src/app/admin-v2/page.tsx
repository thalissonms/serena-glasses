/**
 * Page: AdminV2Dashboard — painel de controle principal do admin-v2.
 *
 * Row 1: tira de métricas (receita/pedidos/AOV/clientes) com seletor Hoje/7d/30d/Total.
 * Row 2: gráfico de barras de receita (últimos 30 dias).
 * Row 3: últimos 10 pedidos + alertas de estoque baixo.
 * Row 4: status da integração Melhor Envio.
 *
 * Usado em: rota /admin-v2.
 */
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { requireAdmin } from "@shared/lib/auth/admin";
import { getDashboardV2Data } from "@features/admin-v2/services/dashboard.service";
import { meRequest } from "@shared/lib/melhor-envio/client";
import { MetricStrip } from "@features/admin-v2/components/dashboard/MetricStrip";
import { SalesChart } from "@features/admin-v2/components/dashboard/SalesChart";
import { LatestOrdersTable } from "@features/admin-v2/components/dashboard/LatestOrdersTable";
import { LowStockAlerts } from "@features/admin-v2/components/dashboard/LowStockAlerts";
import { MelhorEnvioCard } from "@features/admin-v2/components/dashboard/MelhorEnvioCard";

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
  await requireAdmin();

  const [data, health] = await Promise.all([
    getDashboardV2Data(),
    getMeHealth(),
  ]);

  const lowStockCount = data.lowStockAlerts.length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col mb-4 mt-2">
          <span className="font-shrikhand text-[32px] text-white leading-none tracking-wide">
            Dashboard
          </span>
          <span className="font-mono text-[16px] uppercase tracking-[0.3em] text-brand-pink-light/60 mt-2">
            Serena Admin · Sistema Operacional
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {data.pendingCount > 0 && (
            <Link
              href="/admin-v2/orders?status=pending"
              className="flex items-center gap-2 px-3 py-1.5 border border-brand-yellow/25 bg-brand-yellow/5 hover:bg-brand-yellow/10 transition-colors"
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse shrink-0"
                style={{ boxShadow: "0 0 6px #FFD700" }}
                aria-hidden="true"
              />
              <span className="font-mono text-[8px] uppercase tracking-wider text-brand-yellow">
                {data.pendingCount}{" "}
                {data.pendingCount === 1 ? "pendente" : "pendentes"}
              </span>
            </Link>
          )}
          {lowStockCount > 0 && (
            <span className="flex items-center gap-2 px-3 py-1.5 border border-[#FF3355]/20 bg-[#FF3355]/5">
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#FF3355] flex-shrink-0"
                style={{ boxShadow: "0 0 5px #FF3355" }}
                aria-hidden="true"
              />
              <span className="font-mono text-[8px] uppercase tracking-wider text-[#FF3355]/80">
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
          className="bg-[#141414] border border-white/8 relative overflow-hidden shadow-[4px_4px_0px] shadow-gray-500"
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
              <p className="font-mono text-[8px] uppercase tracking-[0.35em] text-white/40">
                Últimos Pedidos
              </p>
              <Link
                href="/admin-v2/orders"
                className="font-mono text-[12px] uppercase tracking-wider text-brand-blue/60 hover:text-brand-blue transition-colors"
              >
                Ver todos →
              </Link>
            </div>
            <LatestOrdersTable orders={data.latestOrders} />
          </div>
        </section>

        <section
          className="bg-[#141414] border border-white/8 relative shadow-[4px_4px_0px] shadow-gray-500 overflow-hidden"
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
              <p className="font-mono text-[8px] uppercase tracking-[0.35em] text-white/40">
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
        className="bg-[#141414] border border-white/8 p-5 shadow-[4px_4px_0px] shadow-blue-900 relative overflow-hidden"
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
