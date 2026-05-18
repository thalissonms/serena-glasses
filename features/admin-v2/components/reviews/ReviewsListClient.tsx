"use client";
/**
 * Component: ReviewsListClient — moderação SCAFFOLD de avaliações com cards Y2K Chrome.
 *
 * Filtros: status chip (todos/pendente/aprovado/rejeitado), busca por produto/autor.
 * Cards: thumb produto, nome, rating em estrelas, comentário, autor, status badge, data.
 * Ações Approve/Reject/Delete desabilitadas com tooltip "Moderação em breve".
 * DevBadge fixo no topo.
 *
 * Usado em: src/app/admin-v2/reviews/page.tsx.
 */
import { useState, useMemo } from "react";
import {
  Search,
  Star,
  CheckCircle,
  XCircle,
  Trash2,
  MessageSquare,
} from "lucide-react";
import { AsciiEmpty } from "@features/admin-v2/components/motifs/AsciiEmpty";
import { DevBadge } from "@features/admin-v2/components/motifs/DevBadge";
import { Badge } from "@features/admin-v2/components/primitives/Badge";

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
}

interface Props {
  reviews: ReviewRow[];
}

type StatusFilter = "all" | "pending" | "approved" | "rejected";

const STATUS_CHIPS: { value: StatusFilter; label: string; color: string }[] = [
  { value: "all", label: "TODOS", color: "text-white/40" },
  { value: "pending", label: "PENDENTE", color: "text-[#FFD700]" },
  { value: "approved", label: "APROVADO", color: "text-emerald-400" },
  { value: "rejected", label: "REJEITADO", color: "text-white/30" },
];

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR");
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={11}
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

function DisabledAction({
  icon: Icon,
  label,
}: {
  icon: typeof CheckCircle;
  label: string;
}) {
  return (
    <div className="relative group/action">
      <button
        type="button"
        disabled
        className="flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-widest text-white/15 border border-white/5 bg-white/2 cursor-not-allowed select-none"
      >
        <Icon size={11} className="shrink-0" />
        {label}
      </button>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#1a1a1a] border border-white/10 font-mono text-[8px] text-white/50 whitespace-nowrap opacity-0 group-hover/action:opacity-100 transition-opacity pointer-events-none z-10">
        Moderação em breve
      </div>
    </div>
  );
}

export function ReviewsListClient({ reviews }: Props) {
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

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

  const counts = useMemo(() => {
    return {
      all: reviews.length,
      pending: reviews.filter((r) => r.status === "pending").length,
      approved: reviews.filter((r) => r.status === "approved").length,
      rejected: reviews.filter((r) => r.status === "rejected").length,
    };
  }, [reviews]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <DevBadge />
        <div className="flex items-center gap-3">
          <MessageSquare size={18} className="text-[#FF00B6]" />
          <h1 className="font-shrikhand text-2xl text-white tracking-wide">
            Avaliações
          </h1>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/25">
          {reviews.length} avaliações — moderação em desenvolvimento
        </p>
      </div>

      {/* Status Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {STATUS_CHIPS.map((chip) => {
          const active = statusFilter === chip.value;
          return (
            <button
              key={chip.value}
              type="button"
              onClick={() => setStatusFilter(chip.value)}
              className={`flex items-center gap-2 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.25em] border transition-all ${
                active
                  ? "border-[#FF00B6]/50 bg-[#FF00B6]/8 text-[#FF00B6]"
                  : "border-white/8 bg-transparent text-white/30 hover:text-white/50 hover:border-white/15"
              }`}
            >
              {chip.label}
              <span className={`${active ? "text-[#FF00B6]" : "text-white/20"}`}>
                ({counts[chip.value]})
              </span>
            </button>
          );
        })}

        <div className="relative ml-auto">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
          />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="BUSCAR..."
            className="pl-9 pr-4 py-2 bg-[#141414] border border-white/8 font-mono text-[11px] text-white/70 placeholder:text-white/20 focus:outline-none focus:border-[#FF00B6]/40 transition-all w-48"
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
          {filtered.map((review) => (
            <div
              key={review.id}
              className="border border-white/5 bg-[#141414] p-4 shadow-[inset_1px_1px_0_rgba(255,255,255,0.03)] hover:border-white/10 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Thumb */}
                <div className="shrink-0 w-12 h-12 border border-white/5 bg-[#111111] overflow-hidden">
                  {review.product_thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={review.product_thumb}
                      alt={review.product_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-mono text-[8px] text-white/15">IMG</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                        {review.product_name}
                      </span>
                      <div className="flex items-center gap-2">
                        <StarRating rating={review.rating} />
                        <span className="font-mono text-[9px] text-white/30">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={review.status} />
                  </div>

                  {review.comment && (
                    <p className="font-mono text-[11px] text-white/55 mt-2 leading-relaxed line-clamp-3">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-white/40">
                        {review.author_name}
                      </span>
                      {review.verified && (
                        <span className="font-mono text-[8px] uppercase tracking-widest text-[#00F0FF]/50">
                          verificado
                        </span>
                      )}
                      <span className="font-mono text-[9px] text-white/20">
                        {fmtDate(review.created_at)}
                      </span>
                    </div>

                    {/* Disabled actions */}
                    <div className="flex items-center gap-1.5">
                      <DisabledAction icon={CheckCircle} label="Aprovar" />
                      <DisabledAction icon={XCircle} label="Rejeitar" />
                      <DisabledAction icon={Trash2} label="Excluir" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="font-mono text-[8px] text-white/12 text-center uppercase tracking-[0.3em]">
        {filtered.length} / {reviews.length} avaliações
      </p>
    </div>
  );
}
