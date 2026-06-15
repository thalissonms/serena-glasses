/**
 * Page: AdminV2ShowcasePage — QA visual do design system Y2K Chrome do /admin.
 *
 * Renderiza todos os primitivos e motifs para validação visual interna.
 * Rota oculta (/admin/_showcase), protegida por requireAdmin().
 *
 * Usado em: validação interna do design system — não para produção.
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import { Badge } from "@features/admin/components/primitives/Badge";
import { Card } from "@features/admin/components/primitives/Card";
import { Table, type TableColumn } from "@features/admin/components/primitives/Table";
import { ChromeFrame } from "@features/admin/components/motifs/ChromeFrame";
import { NeonGlow } from "@features/admin/components/motifs/NeonGlow";
import { ScanlineLoader } from "@features/admin/components/motifs/ScanlineLoader";
import { AsciiEmpty } from "@features/admin/components/motifs/AsciiEmpty";
import { DevBadge } from "@features/admin/components/motifs/DevBadge";
import ShowcaseInteractive from "@features/admin/components/showcase/ShowcaseInteractive";

interface MockRow {
  id: string;
  order: string;
  customer: string;
  total: string;
  status: string;
}

const MOCK_ROWS: MockRow[] = [
  { id: "1", order: "SRN-0042", customer: "Ana Lima", total: "R$ 349,90", status: "paid" },
  { id: "2", order: "SRN-0041", customer: "João Melo", total: "R$ 189,00", status: "shipped" },
  { id: "3", order: "SRN-0040", customer: "Carla Roso", total: "R$ 890,00", status: "pending" },
];

const MOCK_COLUMNS: TableColumn<MockRow>[] = [
  { key: "order", label: "Pedido", sortable: true },
  { key: "customer", label: "Cliente" },
  { key: "total", label: "Total", align: "right" },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <Badge variant={row.status as "paid" | "pending" | "shipped"} />
    ),
  },
];

const STATUS_BADGES: Array<{ v: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded" | "dev" }> = [
  { v: "pending" }, { v: "paid" }, { v: "processing" }, { v: "shipped" },
  { v: "delivered" }, { v: "cancelled" }, { v: "refunded" }, { v: "dev" },
];

export default async function AdminV2ShowcasePage() {
  await requireAdmin("/admin/login");

  return (
    <div className="flex flex-col gap-12 max-w-4xl pb-20">
      <div>
        <h1 className="font-poppins text-3xl text-white">Design System</h1>
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-brand-pink mt-1">
          Y2K Chrome · /admin Primitives Showcase
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/30 border-b border-white/5 pb-2">
          DevBadge
        </h2>
        <DevBadge />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/30 border-b border-white/5 pb-2">
          Badges
        </h2>
        <div className="flex flex-wrap gap-2">
          {STATUS_BADGES.map(({ v }) => (
            <Badge key={v} variant={v} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/30 border-b border-white/5 pb-2">
          Cards
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <Card variant="flat" title="Flat">
            <p className="font-mono text-[12px] text-white/40">Variante flat</p>
          </Card>
          <Card variant="cyber" title="Cyber">
            <p className="font-mono text-[12px] text-white/40">Variante cyber</p>
          </Card>
          <Card variant="neon" title="Neon">
            <p className="font-mono text-[12px] text-white/40">Variante neon</p>
          </Card>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/30 border-b border-white/5 pb-2">
          Table
        </h2>
        <Table
          columns={MOCK_COLUMNS}
          data={MOCK_ROWS}
          keyExtractor={(row) => row.id}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/30 border-b border-white/5 pb-2">
          Table — Empty State
        </h2>
        <Table
          columns={MOCK_COLUMNS}
          data={[]}
          keyExtractor={(row) => row.id}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/30 border-b border-white/5 pb-2">
          ChromeFrame
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {(["none", "pink", "cyan", "gold"] as const).map((g) => (
            <ChromeFrame key={g} glow={g} className="p-4">
              <p className="font-mono text-[11px] text-white/40 uppercase tracking-wider">
                Glow: {g}
              </p>
            </ChromeFrame>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/30 border-b border-white/5 pb-2">
          NeonGlow
        </h2>
        <div className="flex gap-8 items-center">
          <NeonGlow color="var(--brand-pink)" intensity="sm">
            <p className="font-poppins text-2xl text-brand-pink">Pink SM</p>
          </NeonGlow>
          <NeonGlow color="var(--brand-pink)" intensity="md">
            <p className="font-poppins text-2xl text-brand-pink">Cyan MD</p>
          </NeonGlow>
          <NeonGlow color="#FFD700" intensity="lg" pulse>
            <p className="font-poppins text-2xl text-[#FFD700]">Gold LG</p>
          </NeonGlow>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/30 border-b border-white/5 pb-2">
          AsciiEmpty
        </h2>
        <div className="border border-white/5">
          <AsciiEmpty
            message="Sem resultados"
            description="Tente ajustar os filtros de busca"
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/30 border-b border-white/5 pb-2">
          Interactive Components
        </h2>
        <ShowcaseInteractive />
      </section>
    </div>
  );
}
