"use client";
import { useState, useMemo, useCallback } from "react";
import { fmtDate } from "../../utils/formatDate";
import {
  Search,
  Star,
  CheckCircle,
  XCircle,
  Trash2,
  MessageSquare,
} from "lucide-react";
import { AsciiEmpty } from "@features/admin/components/motifs/AsciiEmpty";
import { Badge } from "@features/admin/components/primitives/Badge";

export interface ReviewRow {
  id: string;
  product_id: string;
  product_name: string;
  product_thumb: string | null;
  author_name: string;
  rating: number;
  comment: string | null;
  status: string;
  verified: boolean | null;
  created_at: string | null;
  city: string | null;
  purchased_at: string | null;
}

interface Props {
  reviews: ReviewRow[];
}

type StatusFilter = "all" | "pending" | "approved" | "rejected";

const STATUS_CHIPS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "TODOS" },
  { value: "pending", label: "PENDENTE" },
  { value: "approved", label: "APROVADO" },
  { value: "rejected", label: "REJEITADO" },
];



function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={s <= rating ? "text-[#FFD700] fill-[#FFD700]" : "text-white/15"}
        />
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "approved") return <Badge variant="ready" label="Aprovado" />;
  if (status === "rejected") return <Badge variant="cancelled" label="Rejeitado" />;
  return <Badge variant="pending" label="Pendente" />;
}

export function ReviewsListClient({ reviews: initial }: Props) {
  const [reviews, setReviews] = useState(initial);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const lower = q.toLowerCase();
    return reviews.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (q) {
        return (
          r.product_name.toLowerCase().includes(lower) ||
          r.author_name.toLowerCase().includes(lower) ||
          (r.comment ?? "").toLowerCase().includes(lower)
        );
      }
      return true;
    });
  }, [reviews, q, statusFilter]);

  const counts = useMemo(() => ({
    all: reviews.length,
    pending: reviews.filter((r) => r.status === "pending").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    rejected: reviews.filter((r) => r.status === "rejected").length,
  }), [reviews]);

  const moderate = useCallback(async (id: string, status: "approved" | "rejected") => {
    setLoading(id + status);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, status, verified: status === "approved" ? true : r.verified } : r,
          ),
        );
      }
    } finally {
      setLoading(null);
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    if (!confirm("Excluir esta avaliação?")) return;
    setLoading(id + "delete");
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
      }
    } finally {
      setLoading(null);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <MessageSquare size={18} className="text-brand-pink" />
        <h1 className="font-poppins font-black text-2xl text-white tracking-wide">Avaliações</h1>
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/25 ml-1">{"// "}{reviews.length} total
        </span>
      </div>

      {/* Status Chips + Search */}
      <div className="flex items-center gap-2 flex-wrap">
        {STATUS_CHIPS.map((chip) => {
          const active = statusFilter === chip.value;
          return (
            <button
              key={chip.value}
              type="button"
              onClick={() => setStatusFilter(chip.value)}
              className={`flex items-center gap-2 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] border transition-all ${
                active
                  ? "border-brand-pink/50 bg-brand-pink/8 text-brand-pink"
                  : "border-white/8 bg-transparent text-white/30 hover:text-white/50 hover:border-white/15"
              }`}
            >
              {chip.label}
              <span className={active ? "text-brand-pink" : "text-white/20"}>
                ({counts[chip.value]})
              </span>
            </button>
          );
        })}

        <div className="relative ml-auto">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="BUSCAR..."
            className="pl-9 pr-4 py-2 bg-[#0a0a0a] border border-white/8 font-mono text-[13px] text-white/70 placeholder:text-white/20 focus:outline-none focus:border-brand-pink/40 transition-all w-48"
          />
        </div>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <AsciiEmpty
          message="Nenhuma avaliação encontrada"
          description={q ? "Tente outro termo de busca" : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((review) => {
            const isLoading = loading?.startsWith(review.id);
            return (
              <div
                key={review.id}
                className={`border border-white/5 bg-[#0a0a0a] p-4 shadow-[inset_1px_1px_0_rgba(255,255,255,0.03)] hover:border-white/10 transition-colors ${isLoading ? "opacity-60" : ""}`}
              >
                <div className="flex items-start gap-4">
                  {/* Thumb */}
                  <div className="shrink-0 w-12 h-12 border border-white/5 bg-[#0a0a0a] overflow-hidden">
                    {review.product_thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={review.product_thumb} alt={review.product_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-mono text-[10px] text-white/15">{"// "}IMG</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-[12px] uppercase tracking-widest text-white/40">{"// "}{review.product_name}
                        </span>
                        <div className="flex items-center gap-2">
                          <StarRating rating={review.rating} />
                          <span className="font-mono text-[11px] text-white/30">{"// "}{review.rating}/5</span>
                        </div>
                      </div>
                      <StatusBadge status={review.status} />
                    </div>

                    {review.comment && (
                      <p className="font-mono text-[13px] text-white/55 mt-2 leading-relaxed line-clamp-3">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                    )}

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 mt-3 pt-3 border-t border-white/5 flex-wrap gap-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-[12px] text-white/40">{"// "}{review.author_name}</span>
                        {review.city && (
                          <span className="font-mono text-[11px] text-white/25">{"// "}{review.city}</span>
                        )}
                        {review.verified && (
                          <span className="font-mono text-[10px] uppercase tracking-widest text-brand-pink/50">{"// "}verificado</span>
                        )}
                        {(review.purchased_at || review.created_at) && (
                          <span className="font-mono text-[11px] text-white/20">{"// "}{fmtDate(review.purchased_at ?? review.created_at)}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5">
                        {review.status !== "approved" && (
                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => moderate(review.id, "approved")}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-widest border transition-all border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <CheckCircle size={14} />
                            Aprovar
                          </button>
                        )}
                        {review.status !== "rejected" && (
                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => moderate(review.id, "rejected")}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-widest border transition-all border-white/10 text-white/30 hover:text-red-400 hover:border-red-400/30 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <XCircle size={14} />
                            Rejeitar
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => remove(review.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-widest border border-white/5 text-white/15 hover:text-red-500 hover:border-red-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={14} />
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="font-mono text-[10px] text-white/12 text-center uppercase tracking-[0.3em]">{"// "}{filtered.length} / {reviews.length} avaliações
      </p>
    </div>
  );
}
