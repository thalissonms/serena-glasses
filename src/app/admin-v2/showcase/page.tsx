/**
 * Page: AdminV2ShowcasePage — QA visual do design system Y2K Chrome do /admin-v2.
 *
 * Renderiza todos os primitivos e motifs para validação visual interna.
 * Rota oculta (/admin-v2/_showcase), protegida por requireAdmin().
 *
 * Usado em: validação interna do design system — não para produção.
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import { Badge } from "@features/admin-v2/components/primitives/Badge";
import { Card } from "@features/admin-v2/components/primitives/Card";
import { Table, type TableColumn } from "@features/admin-v2/components/primitives/Table";
import { ChromeFrame } from "@features/admin-v2/components/motifs/ChromeFrame";
import { NeonGlow } from "@features/admin-v2/components/motifs/NeonGlow";
import { ScanlineLoader } from "@features/admin-v2/components/motifs/ScanlineLoader";
import { AsciiEmpty } from "@features/admin-v2/components/motifs/AsciiEmpty";
import { DevBadge } from "@features/admin-v2/components/motifs/DevBadge";
import ShowcaseInteractive from "@features/admin-v2/components/showcase/ShowcaseInteractive";

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
  await requireAdmin();

  return (
    <div className="flex flex-col gap-12 max-w-4xl pb-20">
      <div>
        <h1 className="font-shrikhand text-3xl text-white">Design System</h1>
        <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#00F0FF] mt-1">
          Y2K Chrome · /admin-v2 Primitives Showcase
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30 border-b border-white/5 pb-2">
          DevBadge
        </h2>
        <DevBadge />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30 border-b border-white/5 pb-2">
          Badges
        </h2>
        <div className="flex flex-wrap gap-2">
          {STATUS_BADGES.map(({ v }) => (
            <Badge key={v} variant={v} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30 border-b border-white/5 pb-2">
          Cards
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <Card variant="flat" title="Flat">
            <p className="font-mono text-[10px] text-white/40">Variante flat</p>
          </Card>
          <Card variant="chrome" title="Chrome">
            <p className="font-mono text-[10px] text-white/40">Variante chrome</p>
          </Card>
          <Card variant="holo" title="Holo">
            <p className="font-mono text-[10px] text-white/40">Variante holo</p>
          </Card>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30 border-b border-white/5 pb-2">
          Table
        </h2>
        <Table
          columns={MOCK_COLUMNS}
          data={MOCK_ROWS}
          keyExtractor={(row) => row.id}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30 border-b border-white/5 pb-2">
          Table — Empty State
        </h2>
        <Table
          columns={MOCK_COLUMNS}
          data={[]}
          keyExtractor={(row) => row.id}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30 border-b border-white/5 pb-2">
          ChromeFrame
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {(["none", "pink", "cyan", "gold"] as const).map((g) => (
            <ChromeFrame key={g} glow={g} className="p-4">
              <p className="font-mono text-[9px] text-white/40 uppercase tracking-wider">
                Glow: {g}
              </p>
            </ChromeFrame>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30 border-b border-white/5 pb-2">
          NeonGlow
        </h2>
        <div className="flex gap-8 items-center">
          <NeonGlow color="#FF00B6" intensity="sm">
            <p className="font-shrikhand text-2xl text-[#FF00B6]">Pink SM</p>
          </NeonGlow>
          <NeonGlow color="#00F0FF" intensity="md">
            <p className="font-shrikhand text-2xl text-[#00F0FF]">Cyan MD</p>
          </NeonGlow>
          <NeonGlow color="#FFD700" intensity="lg" pulse>
            <p className="font-shrikhand text-2xl text-[#FFD700]">Gold LG</p>
          </NeonGlow>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30 border-b border-white/5 pb-2">
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
        <h2 className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30 border-b border-white/5 pb-2">
          Interactive Components
        </h2>
        <ShowcaseInteractive />
      </section>
    </div>
  );
}
