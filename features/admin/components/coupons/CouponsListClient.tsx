"use client";
/**
 * Component: CouponsListClient — listagem de cupons com tabs Ativos/Expirados/Todos.
 *
 * Tabs: active (válido + ativo) / expired (inativo ou com valid_until no passado) / all.
 * Table: code (mono grande), description, discount_type badge, discount_value, valid_until,
 * usos used/limit, applies_to, active toggle inline (PATCH), actions (editar, desativar).
 * Delete = soft delete via DELETE endpoint (sets active=false).
 *
 * Usado em: src/app/admin/coupons/page.tsx.
 */
import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Percent,
  DollarSign,
  Truck,
  Tag,
  Pencil,
  Trash2,
  X,
  Calendar,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@features/admin/components/primitives/Button";
import { Input } from "@features/admin/components/primitives/Input";

export interface CouponRow {
  id: string;
  code: string;
  description: string | null;
  discount_type: "percentage" | "fixed" | "free_shipping";
  discount_value: number;
  max_discount_cents: number | null;
  min_order_cents: number;
  first_purchase_only: boolean;
  applies_to: "all" | "products" | "categories";
  usage_limit_total: number | null;
  usage_limit_per_email: number;
  valid_from: string | null;
  valid_until: string | null;
  active: boolean;
  created_at: string;
  usage_count: number;
}

type Tab = "active" | "expired" | "all";

const PAGE_SIZE = 20;

function isExpired(c: CouponRow): boolean {
  if (!c.valid_until) return false;
  return new Date(c.valid_until) < new Date();
}

function formatDiscount(c: CouponRow): string {
  if (c.discount_type === "percentage") return `${c.discount_value}%`;
  if (c.discount_type === "fixed") {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
      c.discount_value / 100,
    );
  }
  return "Frete grátis";
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

function DiscountTypeBadge({ type }: { type: CouponRow["discount_type"] }) {
  if (type === "percentage") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] border border-brand-pink/30 bg-brand-pink/8 text-brand-pink">
        <Percent size={7} />
        PERCENT
      </span>
    );
  }
  if (type === "fixed") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] border border-brand-pink/30 bg-brand-pink/8 text-brand-pink">
        <DollarSign size={7} />
        FIXO
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] border border-emerald-500/30 bg-emerald-500/8 text-emerald-400">
      <Truck size={7} />
      FRETE
    </span>
  );
}

interface Props {
  coupons: CouponRow[];
}

export function CouponsListClient({ coupons: initial }: Props) {
  const [coupons, setCoupons] = useState(initial);
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pendingToggles, setPendingToggles] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const tabCounts = useMemo(() => {
    const now = new Date();
    return {
      active: coupons.filter((c) => c.active && (!c.valid_until || new Date(c.valid_until) >= now))
        .length,
      expired: coupons.filter(
        (c) => !c.active || (!!c.valid_until && new Date(c.valid_until) < now),
      ).length,
      all: coupons.length,
    };
  }, [coupons]);

  const filtered = useMemo(() => {
    const now = new Date();
    let list = coupons;
    if (tab === "active") {
      list = list.filter((c) => c.active && (!c.valid_until || new Date(c.valid_until) >= now));
    } else if (tab === "expired") {
      list = list.filter(
        (c) => !c.active || (!!c.valid_until && new Date(c.valid_until) < now),
      );
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          (c.description?.toLowerCase().includes(q) ?? false),
      );
    }
    return list;
  }, [coupons, tab, search]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function handleToggleActive(coupon: CouponRow) {
    if (pendingToggles.has(coupon.id)) return;
    setPendingToggles((prev) => new Set(prev).add(coupon.id));
    const next = !coupon.active;
    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: next }),
      });
      if (!res.ok) throw new Error();
      setCoupons((prev) => prev.map((c) => (c.id === coupon.id ? { ...c, active: next } : c)));
      toast.success(next ? "Cupom ativado" : "Cupom desativado");
    } catch {
      toast.error("Erro ao atualizar cupom");
    } finally {
      setPendingToggles((prev) => {
        const s = new Set(prev);
        s.delete(coupon.id);
        return s;
      });
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, active: false } : c)));
      setConfirmDelete(null);
      toast.success("Cupom desativado");
    } catch {
      toast.error("Erro ao desativar cupom");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Tag size={18} className="text-brand-pink" />
            <h1 className="font-poppins font-black text-2xl text-white tracking-wide">CUPONS</h1>
          </div>
          <p className="font-mono text-[12px] uppercase tracking-widest text-white/25">{"// "}{coupons.length} cupons no sistema
          </p>
        </div>
        <Link href="/admin/coupons/new">
          <Button variant="primary" size="sm">
            <Plus size={14} />
            Novo Cupom
          </Button>
        </Link>
      </div>

      <div className="flex items-end gap-0 border-b border-white/8">
        {(["all", "active", "expired"] as const).map((t) => {
          const labels = { all: "Todos", active: "Ativos", expired: "Expirados / Inativos" };
          const active = tab === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTab(t);
                setPage(1);
              }}
              className={`relative px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] transition-all duration-150 border-b-2 ${
                active
                  ? "text-brand-pink border-brand-pink -mb-px"
                  : "text-white/30 hover:text-white/60 border-transparent"
              }`}
            >
              {labels[t]}
              <span
                className={`ml-2 font-mono text-[10px] ${active ? "text-brand-pink/60" : "text-white/15"}`}
              >
                {tabCounts[t]}
              </span>
            </button>
          );
        })}
        <div className="flex-1" />
        <div className="mb-2 w-64">
          <Input
            placeholder="Buscar código ou descrição..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            prefix={<Search size={14} />}
            suffix={
              search ? (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="pr-3 text-white/25 hover:text-white/60"
                >
                  <X size={14} />
                </button>
              ) : null
            }
          />
        </div>
      </div>

      {paginated.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-white/5">
          <Tag size={32} className="text-white/10 mb-4" />
          <p className="font-mono text-[12px] uppercase tracking-widest text-white/20">{"// "}Nenhum cupom encontrado
          </p>
          <Link href="/admin/coupons/new" className="mt-4">
            <Button variant="ghost" size="sm">
              <Plus size={13} />
              Criar primeiro cupom
            </Button>
          </Link>
        </div>
      ) : (
        <div className="border border-white/8 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                {[
                  "Código",
                  "Tipo",
                  "Valor",
                  "Válido até",
                  "Usos",
                  "Aplica-se a",
                  "Ativo",
                  "Ações",
                ].map((h, i) => (
                  <th
                    key={h}
                    className={`px-4 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/25 ${i >= 6 ? "text-center" : "text-left"} ${i === 7 ? "text-right" : ""}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((coupon) => {
                const expired = isExpired(coupon);
                return (
                  <tr
                    key={coupon.id}
                    className={`border-b border-white/4 transition-all duration-150 ${expired ? "opacity-50" : "hover:bg-brand-pink/3"}`}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <span className="font-mono text-[15px] font-bold text-white tracking-wider">
                          {coupon.code}
                        </span>
                        {coupon.description && (
                          <p className="font-mono text-[11px] text-white/30 mt-0.5 max-w-[200px] truncate">{"// "}{coupon.description}
                          </p>
                        )}
                        {coupon.first_purchase_only && (
                          <span className="inline-block mt-1 font-mono text-[9px] uppercase tracking-widest text-[#FFD700]/60 border border-[#FFD700]/20 px-1.5 py-0.5">
                            1ª compra
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <DiscountTypeBadge type={coupon.discount_type} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[15px] font-bold text-white">
                        {formatDiscount(coupon)}
                      </span>
                      {coupon.max_discount_cents != null && (
                        <p className="font-mono text-[10px] text-white/25">{"// "}máx{" "}
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(coupon.max_discount_cents / 100)}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {coupon.valid_until && (
                          <Calendar
                            size={12}
                            className={expired ? "text-red-400/60" : "text-white/20"}
                          />
                        )}
                        <span
                          className={`font-mono text-[12px] ${expired ? "text-red-400/60" : "text-white/50"}`}
                        >
                          {formatDate(coupon.valid_until)}
                        </span>
                      </div>
                      {expired && (
                        <span className="font-mono text-[9px] uppercase tracking-widest text-red-400/60">
                          expirado
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Users size={12} className="text-white/20" />
                        <span className="font-mono text-[12px] text-white/50">{"// "}{coupon.usage_count}
                          {coupon.usage_limit_total != null ? (
                            <span className="text-white/25"> / {coupon.usage_limit_total}</span>
                          ) : (
                            <span className="text-white/20"> / ∞</span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[11px] text-white/35 uppercase tracking-wider">{"// "}{coupon.applies_to === "all"
                          ? "Todos"
                          : coupon.applies_to === "products"
                            ? "Produtos"
                            : "Categorias"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(coupon)}
                        disabled={pendingToggles.has(coupon.id)}
                        className={`relative w-10 h-5 border transition-all duration-200 disabled:opacity-40 ${
                          coupon.active
                            ? "bg-brand-pink/15 border-brand-pink/40"
                            : "bg-white/4 border-white/10"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-4 h-4 transition-all duration-200 ${
                            coupon.active
                              ? "left-5 bg-brand-pink shadow-[0_0_8px_rgba(255,0,182,0.5)]"
                              : "left-0.5 bg-white/20"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/coupons/${coupon.id}`}
                          className="p-1.5 text-white/25 hover:text-brand-pink transition-colors duration-150"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(coupon.id)}
                          className="p-1.5 text-white/25 hover:text-red-400 transition-colors duration-150"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {pages > 1 && (
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 px-4 py-3 border-t border-white/5 bg-white/1">
              <span className="font-mono text-[11px] text-white/20">{"// "}{filtered.length} cupons · página {page} de {pages}
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 font-mono text-[11px] text-white/30 hover:text-white/60 border border-white/5 hover:border-white/15 disabled:opacity-30 transition-all"
                >{"// "}←
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 font-mono text-[11px] border transition-all ${
                      p === page
                        ? "text-brand-pink border-brand-pink/40 bg-brand-pink/8"
                        : "text-white/30 border-white/5 hover:border-white/15 hover:text-white/60"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={page === pages}
                  className="px-3 py-1 font-mono text-[11px] text-white/30 hover:text-white/60 border border-white/5 hover:border-white/15 disabled:opacity-30 transition-all"
                >{"// "}→
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
          <div className="bg-[#111] border border-white/10 shadow-[4px_4px_0_var(--brand-pink)] p-6 w-96">
            <h3 className="font-mono text-[13px] uppercase tracking-widest text-red-400 mb-3">
              Desativar cupom
            </h3>
            <p className="font-poppins text-base text-white/70 mb-5">
              O cupom será desativado (soft delete). O histórico de usos é preservado.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(null)}>
                Cancelar
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete(confirmDelete)}>
                Desativar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
