"use client";
/**
 * Component: ProductsListClient — listagem de produtos com filtros Y2K Chrome.
 *
 * Filtros: search (nome/SKU), categoria, status (ativo/inativo), flags multi-toggle.
 * Table: thumbnail, nome+SKU, categoria, preço, estoque, variantes, flags, toggle ativo, ações.
 * Empty state: AsciiEmpty + CTA "Criar primeiro produto".
 * Paginação: footer monospace 20 por página.
 *
 * Usado em: src/app/admin-v2/products/page.tsx.
 */
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Edit2, Trash2, Package, X } from "lucide-react";
import { toast } from "sonner";
import { clsx } from "clsx";
import type { ProductType } from "@features/admin/types/products.type";
import type { CategoryRow } from "@features/categories/types/category.types";
import { formatPrice } from "@features/products/utils/formatPrice";
import { Button } from "@features/admin-v2/components/primitives/Button";
import { Input } from "@features/admin-v2/components/primitives/Input";
import { Select } from "@features/admin-v2/components/primitives/Select";
import { Table, type TableColumn, type SortState } from "@features/admin-v2/components/primitives/Table";
import { AsciiEmpty } from "@features/admin-v2/components/motifs/AsciiEmpty";

interface Props {
  products: ProductType[];
  categories: CategoryRow[];
}

type FlagKey = "featured" | "is_new" | "is_sale" | "is_outlet";

const FLAG_CONFIG: Record<FlagKey, { label: string; color: string }> = {
  featured: { label: "DEST", color: "#FFD700" },
  is_new: { label: "NEW", color: "#00F0FF" },
  is_sale: { label: "SALE", color: "#FF00B6" },
  is_outlet: { label: "OUTL", color: "#FF7700" },
};

const PAGE_SIZE = 20;

export default function ProductsListClient({ products: initialProducts, categories }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [status, setStatus] = useState("all");
  const [activeFlags, setActiveFlags] = useState<FlagKey[]>([]);
  const [sort, setSort] = useState<SortState>({ key: "name", direction: "asc" });
  const [page, setPage] = useState(1);
  const [pendingToggles, setPendingToggles] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function toggleFlag(flag: FlagKey) {
    setActiveFlags((prev) =>
      prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag],
    );
    setPage(1);
  }

  function handleSort(key: string) {
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" },
    );
  }

  const filtered = useMemo(() => {
    let result = products;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || (p.code ?? "").toLowerCase().includes(q),
      );
    }

    if (categoryId !== "all") {
      result = result.filter((p) => p.category?.id === categoryId);
    }

    if (status === "active") result = result.filter((p) => p.active);
    else if (status === "inactive") result = result.filter((p) => !p.active);

    for (const flag of activeFlags) {
      result = result.filter((p) => Boolean(p[flag]));
    }

    return [...result].sort((a, b) => {
      let aVal: string | number = a.name;
      let bVal: string | number = b.name;
      if (sort.key === "price") {
        aVal = a.price;
        bVal = b.price;
      } else if (sort.key === "stock") {
        aVal = a.product_variants.reduce((s, v) => s + v.stock.available, 0);
        bVal = b.product_variants.reduce((s, v) => s + v.stock.available, 0);
      }
      if (aVal < bVal) return sort.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [products, search, categoryId, status, activeFlags, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function handleActiveToggle(p: ProductType) {
    if (pendingToggles.has(p.id)) return;
    const next = !p.active;
    setPendingToggles((prev) => new Set(prev).add(p.id));
    setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, active: next } : x)));
    try {
      const res = await fetch(`/api/admin/products/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: next }),
      });
      if (!res.ok) throw new Error();
      toast.success(next ? "Produto ativado" : "Produto desativado");
    } catch {
      setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, active: p.active } : x)));
      toast.error("Erro ao atualizar produto");
    } finally {
      setPendingToggles((prev) => {
        const s = new Set(prev);
        s.delete(p.id);
        return s;
      });
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setConfirmDelete(null);
      toast.success("Produto removido");
    } catch {
      toast.error("Erro ao remover produto");
    }
  }

  const categoryOptions = [
    { value: "all", label: "Todas as categorias" },
    ...categories.filter((c) => c.active).map((c) => ({ value: c.id, label: c.name_pt })),
  ];

  const columns: TableColumn<ProductType>[] = [
    {
      key: "thumbnail",
      label: "",
      render: (p) => (
        <div className="w-10 h-10 relative flex-shrink-0 bg-[#1a1a1a] border border-white/8 overflow-hidden">
          {p.product_images?.[0] ? (
            <Image
              src={p.product_images[0].url}
              alt={p.product_images[0].alt ?? p.name}
              fill
              className="object-cover"
              sizes="40px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={14} className="text-white/15" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      label: "Produto",
      sortable: true,
      render: (p) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="font-mono text-[11px] text-white/85 leading-snug truncate">{p.name}</span>
          {p.code && (
            <span className="font-mono text-[8px] text-[#00F0FF]/60 tracking-widest">{p.code}</span>
          )}
        </div>
      ),
    },
    {
      key: "category",
      label: "Categoria",
      render: (p) => (
        <span className="font-mono text-[10px] text-white/40">{p.category?.name_pt ?? "—"}</span>
      ),
    },
    {
      key: "price",
      label: "Preço",
      sortable: true,
      align: "right",
      render: (p) => (
        <span className="font-jocham text-[12px] text-white/80">{formatPrice(p.price)}</span>
      ),
    },
    {
      key: "stock",
      label: "Estoque",
      sortable: true,
      align: "center",
      render: (p) => {
        const available = p.product_variants.reduce((s, v) => s + v.stock.available, 0);
        return (
          <span
            className={clsx(
              "font-mono text-[11px] font-bold tabular-nums",
              available === 0
                ? "text-red-400"
                : available <= 5
                  ? "text-yellow-400"
                  : "text-[#00F0FF]",
            )}
          >
            {available}
          </span>
        );
      },
    },
    {
      key: "variants",
      label: "Vars",
      align: "center",
      render: (p) => (
        <span className="font-mono text-[10px] text-white/30">{p.product_variants.length}</span>
      ),
    },
    {
      key: "flags",
      label: "Flags",
      render: (p) => {
        const flagValues: Record<FlagKey, boolean> = {
          featured: p.featured,
          is_new: p.is_new,
          is_sale: p.is_sale,
          is_outlet: p.is_outlet,
        };
        const active = (Object.entries(FLAG_CONFIG) as [FlagKey, { label: string; color: string }][]).filter(
          ([key]) => flagValues[key],
        );
        return (
          <div className="flex gap-1 flex-wrap">
            {active.map(([key, cfg]) => (
              <span
                key={key}
                className="px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-widest border"
                style={{
                  color: cfg.color,
                  borderColor: `${cfg.color}40`,
                  backgroundColor: `${cfg.color}10`,
                }}
              >
                {cfg.label}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      key: "active",
      label: "Ativo",
      align: "center",
      render: (p) => {
        const isPending = pendingToggles.has(p.id);
        return (
          <button
            type="button"
            onClick={() => handleActiveToggle(p)}
            disabled={isPending}
            aria-label={p.active ? "Desativar produto" : "Ativar produto"}
            className={clsx(
              "relative w-9 h-5 flex-shrink-0 border-2 transition-all duration-200",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              p.active ? "bg-[#FF00B6]/20 border-[#FF00B6]/50" : "bg-white/3 border-white/15",
            )}
          >
            <span
              className={clsx(
                "absolute top-0.5 h-3 w-3 transition-all duration-200",
                p.active ? "right-0.5 bg-[#FF00B6]" : "left-0.5 bg-white/25",
              )}
              style={p.active ? { boxShadow: "0 0 6px #FF00B6" } : undefined}
            />
          </button>
        );
      },
    },
    {
      key: "actions",
      label: "",
      align: "center",
      render: (p) => (
        <div className="flex items-center gap-1">
          <Link
            href={`/admin-v2/products/${p.id}`}
            className="p-1.5 text-white/25 hover:text-[#00F0FF] border border-transparent hover:border-[#00F0FF]/20 hover:bg-[#00F0FF]/8 transition-all duration-150"
          >
            <Edit2 size={11} />
          </Link>
          {confirmDelete === p.id ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleDelete(p.id)}
                className="px-2 py-1 font-mono text-[8px] uppercase text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors"
              >
                OK
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="p-1 text-white/20 hover:text-white/50 transition-colors"
              >
                <X size={10} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(p.id)}
              className="p-1.5 text-white/25 hover:text-red-400 border border-transparent hover:border-red-500/20 hover:bg-red-500/8 transition-all duration-150"
            >
              <Trash2 size={11} />
            </button>
          )}
        </div>
      ),
    },
  ];

  const isFiltering =
    search.trim() !== "" || categoryId !== "all" || status !== "all" || activeFlags.length > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-shrikhand text-2xl text-white tracking-wide">PRODUTOS</h1>
          <p className="font-mono text-[9px] uppercase tracking-widest text-white/25 mt-1">
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
            {products.length !== filtered.length ? ` de ${products.length}` : ""}
          </p>
        </div>
        <Link href="/admin-v2/products/new">
          <Button variant="primary" size="md">
            <Plus size={12} />
            Novo Produto
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div
        className="bg-[#141414] border border-white/5 p-4 flex flex-wrap gap-3 items-end"
        style={{ boxShadow: "inset 1px 1px 0 rgba(255,255,255,0.03)" }}
      >
        <div className="flex-1 min-w-[180px]">
          <Input
            label="Buscar"
            placeholder="Nome ou SKU..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            prefix={<Search size={12} />}
          />
        </div>
        <div className="w-48">
          <Select
            label="Categoria"
            options={categoryOptions}
            value={categoryId}
            onValueChange={(v) => {
              setCategoryId(v);
              setPage(1);
            }}
          />
        </div>
        <div className="w-36">
          <Select
            label="Status"
            options={[
              { value: "all", label: "Todos" },
              { value: "active", label: "Ativos" },
              { value: "inactive", label: "Inativos" },
            ]}
            value={status}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 select-none">
            Flags
          </span>
          <div className="flex gap-1.5">
            {(
              Object.entries(FLAG_CONFIG) as [FlagKey, { label: string; color: string }][]
            ).map(([key, cfg]) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleFlag(key)}
                className={clsx(
                  "px-2.5 py-2 font-mono text-[8px] uppercase tracking-widest border-2 transition-all duration-150",
                  !activeFlags.includes(key) && "border-white/10 text-white/25 hover:border-white/25",
                )}
                style={
                  activeFlags.includes(key)
                    ? {
                        color: cfg.color,
                        borderColor: `${cfg.color}60`,
                        backgroundColor: `${cfg.color}12`,
                        boxShadow: `0 0 8px ${cfg.color}30`,
                      }
                    : undefined
                }
              >
                {cfg.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table or Empty State */}
      {filtered.length === 0 ? (
        <AsciiEmpty
          message={isFiltering ? "Nenhum resultado" : "Sem produtos ainda"}
          description={
            isFiltering
              ? "Ajuste os filtros para ver mais resultados."
              : "Crie seu primeiro produto para começar."
          }
          cta={
            !isFiltering ? (
              <Link href="/admin-v2/products/new">
                <Button variant="primary" size="sm">
                  <Plus size={10} />
                  Criar primeiro produto
                </Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <Table
          columns={columns}
          data={paginated}
          keyExtractor={(p) => p.id}
          sort={sort}
          onSort={handleSort}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <span className="font-mono text-[9px] uppercase tracking-widest text-white/20">
            Página {page}/{totalPages} · {filtered.length} produto{filtered.length !== 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest border border-white/8 text-white/30 hover:border-[#FF00B6]/30 hover:text-white/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
            >
              ← Ant
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const pageNum =
                totalPages <= 7
                  ? i + 1
                  : page <= 4
                    ? i + 1
                    : page >= totalPages - 3
                      ? totalPages - 6 + i
                      : page - 3 + i;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setPage(pageNum)}
                  className={clsx(
                    "w-8 h-8 font-mono text-[9px] border transition-all duration-150",
                    pageNum === page
                      ? "border-[#FF00B6]/60 text-[#FF00B6] bg-[#FF00B6]/10"
                      : "border-white/8 text-white/25 hover:border-white/20 hover:text-white/50",
                  )}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest border border-white/8 text-white/30 hover:border-[#FF00B6]/30 hover:text-white/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
            >
              Prox →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
