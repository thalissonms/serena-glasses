"use client";
/**
 * Component: WishlistListClient — viewer SCAFFOLD de favoritos agregados por produto.
 *
 * Filtro client-side: busca por nome de produto.
 * Sort: total_favorites DESC (padrão), last_added DESC.
 * Table: thumb, nome do produto, total favoritos, última adição.
 * Read-only — sem CRUD.
 *
 * Usado em: src/app/admin/wishlist/page.tsx.
 */
import { useState, useMemo } from "react";
import { fmtDate, fmtDateTime } from "../../utils/formatDate";
import { Search, Heart, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { AsciiEmpty } from "@features/admin/components/motifs/AsciiEmpty";
import { DevBadge } from "@features/admin/components/motifs/DevBadge";

export interface WishlistRow {
  product_id: string;
  product_name: string;
  product_thumb: string | null;
  total_favorites: number;
  last_added: string | null;
}

interface Props {
  items: WishlistRow[];
}

type SortKey = "total_favorites" | "last_added";



export function WishlistListClient({ items }: Props) {
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("total_favorites");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    const lower = q.toLowerCase();
    const src = q
      ? items.filter((i) => i.product_name.toLowerCase().includes(lower))
      : items;

    return [...src].sort((a, b) => {
      if (sortKey === "total_favorites") {
        const cmp = a.total_favorites - b.total_favorites;
        return sortDir === "desc" ? -cmp : cmp;
      }
      const cmp = (a.last_added ?? "").localeCompare(b.last_added ?? "");
      return sortDir === "desc" ? -cmp : cmp;
    });
  }, [items, q, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function SortChevron({ k }: { k: SortKey }) {
    if (k !== sortKey) return <ArrowUpDown size={9} className="text-white/20" />;
    return sortDir === "desc" ? (
      <ArrowDown size={9} className="text-[#FF00B6]" />
    ) : (
      <ArrowUp size={9} className="text-[#FF00B6]" />
    );
  }

  const totalFavs = items.reduce((s, i) => s + i.total_favorites, 0);
  const mostFaved = items[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <DevBadge />
        <div className="flex items-center gap-3">
          <Heart size={18} className="text-[#FF00B6]" />
          <h1 className="font-shrikhand text-2xl text-white tracking-wide">
            Wishlists
          </h1>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/25">
          {items.length} produtos favoritados — somente leitura
        </p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Produtos Favoritados", value: items.length.toString() },
          { label: "Total Favoritamentos", value: totalFavs.toString() },
          {
            label: "Mais Favoritado",
            value: mostFaved?.product_name ?? "—",
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="border border-white/5 bg-[#141414] px-5 py-4 shadow-[inset_1px_1px_0_rgba(255,255,255,0.03)]"
          >
            <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/25 mb-1">
              {kpi.label}
            </p>
            <p className="font-mono text-sm text-white/80 truncate">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
        />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="BUSCAR POR PRODUTO..."
          className="w-full pl-9 pr-4 py-2.5 bg-[#141414] border border-white/8 font-mono text-[11px] text-white/70 placeholder:text-white/20 focus:outline-none focus:border-[#FF00B6]/40 transition-all"
        />
      </div>

      {/* Table */}
      <div className="border border-white/5 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#1a1a1a] shadow-[inset_1px_1px_0_rgba(255,255,255,0.05)]">
              {[
                { label: "PRODUTO" },
                { label: "FAVORITOS", sortKey: "total_favorites" as SortKey },
                { label: "ÚLTIMA ADIÇÃO", sortKey: "last_added" as SortKey },
              ].map((col) => (
                <th
                  key={col.label}
                  onClick={col.sortKey ? () => handleSort(col.sortKey!) : undefined}
                  className={`px-4 py-3 font-mono text-[8px] uppercase tracking-[0.25em] text-white/25 font-normal border-b border-white/5 text-left ${col.sortKey ? "cursor-pointer hover:text-white/50 select-none" : ""}`}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortKey && <SortChevron k={col.sortKey} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3}>
                  <AsciiEmpty message="Nenhum produto favoritado" />
                </td>
              </tr>
            ) : (
              filtered.map((row, i) => (
                <tr
                  key={row.product_id}
                  className={`border-b border-white/3 transition-colors hover:bg-[#FF00B6]/4 ${
                    i % 2 === 0 ? "bg-[#141414]" : "bg-[#111111]"
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 shrink-0 border border-white/5 bg-[#0f0f0f] overflow-hidden">
                        {row.product_thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={row.product_thumb}
                            alt={row.product_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="font-mono text-[7px] text-white/15">IMG</span>
                          </div>
                        )}
                      </div>
                      <span className="font-mono text-[11px] text-white/65">
                        {row.product_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Heart size={11} className="text-[#FF00B6]/50 fill-[#FF00B6]/30" />
                      <span className="font-mono text-[13px] text-[#FF00B6]">
                        {row.total_favorites}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] text-white/30">
                    {fmtDate(row.last_added)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="font-mono text-[8px] text-white/12 text-center uppercase tracking-[0.3em]">
        {filtered.length} / {items.length} produtos — somente leitura
      </p>
    </div>
  );
}
