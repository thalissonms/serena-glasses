"use client";
import { useState } from "react";
import { Star } from "lucide-react";

interface Props {
  reviewId: string;
  token: string;
  productName: string;
}

export function ReviewFormClient({ reviewId, token, productName }: Props) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MAX_CHARS = 400;
  const remaining = MAX_CHARS - comment.length;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Selecione uma quantidade de estrelas.");
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/review/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, token, rating, comment }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error ?? "Erro ao enviar. Tente novamente.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-4">
        <div className="text-5xl mb-4">★</div>
        <h2 className="font-poppins font-black text-xl uppercase text-black mb-2">
          Obrigada pelo comentário!
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Sua avaliação sobre <strong>{productName}</strong> foi enviada e será analisada pela nossa equipe.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Star picker */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
          Sua nota
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((s) => {
            const active = s <= (hovered || rating);
            return (
              <button
                key={s}
                type="button"
                onMouseEnter={() => setHovered(s)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(s)}
                className="focus:outline-none transition-transform hover:scale-110"
                aria-label={`${s} estrela${s > 1 ? "s" : ""}`}
              >
                <Star
                  size={36}
                  className={active ? "text-brand-yellow fill-brand-yellow" : "text-gray-200 fill-gray-200"}
                />
              </button>
            );
          })}
          {rating > 0 && (
            <span className="ml-2 text-sm font-bold text-brand-pink">
              {["", "Ruim", "Regular", "Bom", "Ótimo", "Perfeito!"][rating]}
            </span>
          )}
        </div>
      </div>

      {/* Comment textarea */}
      <div>
        <label
          htmlFor="review-comment"
          className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2"
        >
          Seu comentário <span className="text-gray-300 font-normal">(opcional)</span>
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, MAX_CHARS))}
          placeholder="Conte como foi sua experiência com o produto..."
          rows={4}
          className="w-full border-2 border-black p-3 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-brand-pink resize-none transition-colors"
        />
        <p className={`text-right text-xs mt-1 ${remaining < 50 ? "text-brand-pink font-bold" : "text-gray-400"}`}>
          {remaining} caracteres restantes
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-500 font-semibold border border-red-200 bg-red-50 px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || rating === 0}
        className="w-full bg-brand-pink text-white font-poppins font-black text-sm uppercase tracking-widest py-4 border-2 border-black shadow-[4px_4px_0_#000] hover:shadow-[2px_2px_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-[4px_4px_0_#000] disabled:translate-x-0 disabled:translate-y-0"
      >
        {submitting ? "Enviando..." : "Enviar avaliação"}
      </button>
    </form>
  );
}
