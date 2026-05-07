"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useReviewsOverlay } from "@features/products/hooks/useReviewsOverlay";

export function ReviewsOverlay() {
  const { t } = useTranslation("products");
  const { open, productName, close } = useReviewsOverlay();
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="reviews-overlay-title"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 500) close();
            }}
            className="fixed inset-x-0 bottom-0 z-50 flex flex-col bg-white dark:bg-[#1a1a1a] rounded-t-2xl max-h-[90vh] border-t-2 border-black dark:border-brand-pink touch-none"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 bg-brand-pink/40 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-dashed border-brand-pink/20 shrink-0">
              <h2
                id="reviews-overlay-title"
                className="font-poppins font-black text-base uppercase tracking-wide text-black dark:text-white"
              >
                {t("feed.reviewsTitle")} ✦
              </h2>
              <button
                onClick={close}
                aria-label={t("feed.reviewsClose")}
                className="p-1.5 text-gray-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Product name */}
            {productName && (
              <p className="px-5 pt-3 pb-1 font-poppins text-sm text-gray-500 dark:text-gray-400 shrink-0">
                {productName}
              </p>
            )}

            {/* Content — scrollable */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 touch-auto">
              <ReviewsPlaceholder t={t} />
            </div>

            {/* CTA footer */}
            <div className="px-5 py-4 border-t-2 border-black dark:border-brand-pink shrink-0">
              <button className="w-full font-poppins font-bold text-sm uppercase tracking-wider text-black dark:text-white border-2 border-black dark:border-brand-pink py-3 shadow-[4px_4px_0_#FF00B6] hover:shadow-[6px_6px_0_#FF00B6] hover:-translate-y-0.5 transition-all cursor-pointer">
                {t("feed.writeReview")} ✎
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < count
              ? "fill-brand-pink text-brand-pink"
              : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
          }
        />
      ))}
    </div>
  );
}

const MOCK_REVIEWS = [
  { name: "Maria S.", city: "SP", stars: 5, text: "Amei o tom rosé, mood Y2K total. Chegou rápido!", date: "2d", verified: true },
  { name: "Ana L.", city: "RJ", stars: 4, text: "Lente boa, armação um pouco apertada pra rosto largo.", date: "1 sem", verified: true },
  { name: "Julia M.", city: "BH", stars: 5, text: "Melhor compra do ano! Super elegante.", date: "2 sem", verified: false },
];

function ReviewsPlaceholder({ t }: { t: (key: string, opts?: object) => string }) {
  return (
    <div className="flex flex-col gap-4">
      {MOCK_REVIEWS.map((review, i) => (
        <div
          key={i}
          className="bg-pink-50/40 dark:bg-brand-pink-bg-dark/40 p-4 border-b border-dashed border-brand-pink/20"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-pink/20 flex items-center justify-center shrink-0">
                <span className="font-poppins font-bold text-xs text-brand-pink">{review.name[0]}</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-poppins font-bold text-sm text-black dark:text-white">{review.name}</span>
                  {review.verified && (
                    <span className="font-poppins text-[10px] uppercase bg-brand-blue text-black px-1.5 py-0.5">
                      {t("description.reviews.verified")}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 font-inter">{review.city} · {review.date}</p>
              </div>
            </div>
            <StarRow count={review.stars} />
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 font-inter leading-relaxed border-l-4 border-brand-pink/40 pl-3">
            {review.text}
          </p>
        </div>
      ))}
    </div>
  );
}
