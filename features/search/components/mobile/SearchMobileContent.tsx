"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ArrowLeft, SlidersHorizontal, X } from "lucide-react";
import Image from "next/image";
import { SearchInput } from "@shared/components/forms/inputs/SearchInput";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { useSmartBack } from "@features/navigation/hooks/useBackIntercept";
import { useSearch, useSearchFacets } from "@features/search/hooks/useSearch";
import { formatPrice } from "@features/products/utils/formatPrice";
import type { SearchFilters } from "@features/search/types/search.types";

type ActiveFilter = { type: keyof SearchFilters; value: string; label: string };

const POPULAR_CHIPS = ["Cat-Eye", "Acetato", "Rosa"];

function SearchResultSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-black/10 dark:border-brand-pink/10 animate-pulse">
      <div className="w-16 h-16 shrink-0 bg-brand-pink/10 border border-black/10" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-brand-pink/10 rounded w-3/4" />
        <div className="h-2 bg-brand-pink/10 rounded w-1/3" />
        <div className="h-3 bg-brand-pink/15 rounded w-1/4" />
      </div>
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  const { t } = useTranslation("search");
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-pink text-white font-poppins text-[10px] font-bold uppercase tracking-wide border border-black shadow-[2px_2px_0_#000]">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={t("removeFilter", { label })}
        className="ml-0.5 cursor-pointer"
      >
        <X size={10} aria-hidden="true" />
      </button>
    </span>
  );
}

function FiltersSheet({
  filters,
  onApply,
  onClose,
}: {
  filters: SearchFilters;
  onApply: (f: SearchFilters) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation("search");
  const { data: facets } = useSearchFacets();
  const [local, setLocal] = useState<SearchFilters>(filters);

  function toggle<K extends keyof SearchFilters>(key: K, value: string) {
    setLocal((prev) => ({ ...prev, [key]: prev[key] === value ? undefined : value }));
  }

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 340, damping: 36 }}
      className="fixed inset-x-0 bottom-0 z-[300] bg-white dark:bg-[#0a0a0a] border-t-4 border-black dark:border-brand-pink shadow-[-4px_-4px_0_#FF00B6] max-h-[75vh] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={t("filters.title")}
    >
      {/* Handle bar */}
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-8 h-1 rounded-full bg-black/20 dark:bg-white/20" />
      </div>

      {/* Sheet header */}
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-black dark:border-brand-pink">
        <h2 className="font-jocham text-2xl text-brand-pink">{t("filters.title")}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("filters.close")}
          className="p-1 border-2 border-black dark:border-brand-pink hover:bg-brand-pink hover:text-white transition-colors cursor-pointer"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="overflow-y-auto flex-1 px-4 py-4 space-y-5">
        {facets?.subcategories && facets.subcategories.length > 0 && (
          <section>
            <p className="font-poppins text-xs font-black uppercase tracking-widest text-black dark:text-white mb-2">
              {t("filters.subcategories")} ✦
            </p>
            <div className="flex flex-wrap gap-2">
              {facets.subcategories.map((sub) => (
                <button
                  key={sub.slug}
                  type="button"
                  onClick={() => toggle("subcategory", sub.slug)}
                  className={`px-3 py-1 font-poppins text-xs font-bold uppercase tracking-wide border-2 transition-all cursor-pointer ${
                    local.subcategory === sub.slug
                      ? "bg-brand-pink text-white border-black shadow-[2px_2px_0_#000]"
                      : "bg-transparent text-black dark:text-white border-black dark:border-brand-pink hover:border-brand-pink"
                  }`}
                >
                  {sub.label_pt}
                </button>
              ))}
            </div>
          </section>
        )}

        {facets?.shapes && facets.shapes.length > 0 && (
          <section>
            <p className="font-poppins text-xs font-black uppercase tracking-widest text-black dark:text-white mb-2">
              {t("filters.shapes")} ✦
            </p>
            <div className="flex flex-wrap gap-2">
              {facets.shapes.map((shape) => (
                <button
                  key={shape.slug}
                  type="button"
                  onClick={() => toggle("shape", shape.slug)}
                  className={`px-3 py-1 font-poppins text-xs font-bold uppercase tracking-wide border-2 transition-all cursor-pointer ${
                    local.shape === shape.slug
                      ? "bg-brand-pink text-white border-black shadow-[2px_2px_0_#000]"
                      : "bg-transparent text-black dark:text-white border-black dark:border-brand-pink hover:border-brand-pink"
                  }`}
                >
                  {shape.label_pt}
                </button>
              ))}
            </div>
          </section>
        )}

        {facets?.colors && facets.colors.length > 0 && (
          <section>
            <p className="font-poppins text-xs font-black uppercase tracking-widest text-black dark:text-white mb-2">
              {t("filters.colors")} ✦
            </p>
            <div className="flex flex-wrap gap-3">
              {facets.colors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => toggle("color", color.name)}
                  aria-label={color.name}
                  className="flex flex-col items-center gap-0.5 cursor-pointer"
                >
                  <span
                    className={`w-8 h-8 rounded-full border-2 transition-all block ${
                      local.color === color.name
                        ? "border-brand-pink shadow-[0_0_0_2px_#FF00B6]"
                        : "border-black/30 dark:border-white/20"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-[9px] font-poppins text-black/60 dark:text-white/50 leading-tight text-center max-w-[40px] truncate">
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="flex gap-3 px-4 py-4 border-t-2 border-black dark:border-brand-pink">
        <button
          type="button"
          onClick={() => { setLocal({}); onApply({}); onClose(); }}
          className="flex-1 py-3 font-poppins text-xs font-black uppercase tracking-widest border-2 border-black dark:border-brand-pink text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-brand-pink transition-all cursor-pointer"
        >
          {t("filters.clear")}
        </button>
        <button
          type="button"
          onClick={() => { onApply(local); onClose(); }}
          className="flex-[2] py-3 font-poppins text-xs font-black uppercase tracking-widest border-2 border-black dark:border-brand-pink bg-brand-pink text-white shadow-[4px_4px_0_#000] active:shadow-[2px_2px_0_#000] active:translate-y-0.5 transition-all cursor-pointer"
        >
          {t("filters.apply")}
        </button>
      </div>
    </motion.div>
  );
}

interface SearchMobileContentProps {
  initialQuery?: string;
}

export default function SearchMobileContent({ initialQuery = "" }: SearchMobileContentProps) {
  const { t } = useTranslation("search");
  const handleBack = useSmartBack("/products");
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQ, setDebouncedQ] = useState(initialQuery);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const { data: results = [], isFetching } = useSearch(debouncedQ, filters);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedQ(val), 300);
  }, []);

  function handleChipClick(term: string) {
    setQuery(term);
    setDebouncedQ(term);
    inputRef.current?.focus();
  }

  function handleClearSearch() {
    setQuery("");
    setDebouncedQ("");
    setFilters({});
  }

  const activeFilterChips: ActiveFilter[] = [
    filters.subcategory && { type: "subcategory", value: filters.subcategory, label: filters.subcategory },
    filters.shape && { type: "shape", value: filters.shape, label: filters.shape },
    filters.color && { type: "color", value: filters.color, label: filters.color },
  ].filter(Boolean) as ActiveFilter[];

  const hasResults = results.length > 0;
  const showEmpty = debouncedQ.length >= 2 && !isFetching && !hasResults;

  return (
    <div className="min-h-screen bg-[#FFF0FA] dark:bg-[#0a0a0a] text-black dark:text-white">
      {/* Header sticky */}
      <header className="w-full sticky top-0 z-50 bg-brand-pink/25 backdrop-blur-3xl border-b-2 border-brand-pink/40 border-dashed">
        <div className="flex items-center gap-2 px-2 py-2 h-16">
          <button
            type="button"
            onClick={handleBack}
            aria-label={t("back")}
            className="p-2 shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6 text-black dark:text-white" strokeWidth={2.5} aria-hidden="true" />
          </button>

          <SearchInput
            ref={inputRef}
            value={query}
            onChange={handleChange}
            placeholder={t("placeholder")}
            ariaLabel={t("placeholder")}
            onClear={() => { setQuery(""); setDebouncedQ(""); }}
            loading={isFetching && debouncedQ.length >= 2}
            autoFocus
            rotated
            className="flex-1"
          />

          <button
            type="button"
            onClick={() => setShowFilters(true)}
            aria-label={t("openFilters")}
            className={`p-2 shrink-0 border-2 transition-all cursor-pointer ${
              activeFilterChips.length > 0
                ? "border-brand-pink bg-brand-pink text-white shadow-[2px_2px_0_#000]"
                : "border-black dark:border-brand-pink text-black dark:text-white hover:bg-brand-pink hover:text-white hover:border-black"
            }`}
          >
            <div className="relative">
              <SlidersHorizontal size={20} aria-hidden="true" />
              {activeFilterChips.length > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-white text-brand-pink text-[9px] font-black flex items-center justify-center border border-brand-pink">
                  {activeFilterChips.length}
                </span>
              )}
            </div>
          </button>
        </div>

        {activeFilterChips.length > 0 && (
          <div className="flex gap-2 px-4 pb-2 flex-wrap">
            {activeFilterChips.map((f) => (
              <FilterChip
                key={f.type}
                label={f.label}
                onRemove={() => setFilters((prev) => ({ ...prev, [f.type]: undefined }))}
              />
            ))}
          </div>
        )}
      </header>

      {/* Conteúdo */}
      <div className="relative pb-20">
        {/* Noise overlay atmosférico */}
        <div className="noise-overlay absolute inset-0 opacity-50 pointer-events-none z-0" />

        {/* Estado inicial */}
        {debouncedQ.length < 2 && (
          <div className="relative z-10 flex flex-col items-center justify-center py-12 px-6 text-center">
            <span className="text-6xl text-brand-pink/20 font-jocham mb-4">✦</span>
            <p className="font-poppins text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">
              {t("promptShort")}
            </p>
            <div className="flex gap-2 flex-wrap justify-center">
              {POPULAR_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className="px-4 py-1.5 font-poppins text-xs font-bold uppercase tracking-wider border-2 border-black dark:border-brand-pink bg-brand-pink-light dark:bg-brand-pink-dark text-black dark:text-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#FF00B6] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Skeletons */}
        {isFetching && (
          <div className="relative z-10">
            {Array.from({ length: 5 }).map((_, i) => (
              <SearchResultSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty state brutal */}
        {showEmpty && (
          <div className="relative z-10 px-6 py-12" aria-live="polite">
            <div className="border-2 border-black dark:border-brand-pink shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#FF00B6] bg-white dark:bg-[#1a1a1a] p-6 text-center">
              <h3 className="font-jocham text-2xl uppercase text-black dark:text-white mb-2">
                {t("emptyResults.title")}
              </h3>
              <p className="font-inter text-xs text-black/50 dark:text-white/40 mb-4">
                {t("results.emptyHint")}
              </p>
              <button
                type="button"
                onClick={handleClearSearch}
                className="font-poppins font-black text-xs uppercase tracking-widest bg-brand-pink text-white border-2 border-black px-4 py-2 shadow-[3px_3px_0_#000] active:shadow-[1px_1px_0_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                {t("emptyResults.clearCta")}
              </button>
            </div>
          </div>
        )}

        {/* Lista de resultados */}
        {!isFetching && hasResults && (
          <>
            {/* List header decorativo */}
            <div className="relative z-10 px-4 py-2 bg-brand-pink/10 dark:bg-brand-pink/5 border-b border-brand-pink/20" aria-live="polite">
              <p className="font-poppins text-[10px] uppercase tracking-widest text-brand-pink/70 dark:text-brand-pink/50">
                {t("results.listHeader", { count: results.length })}
              </p>
            </div>

            <ul className="relative z-10 divide-y divide-black/10 dark:divide-brand-pink/10" aria-busy={isFetching}>
              <AnimatePresence initial={false}>
                {results.map((item, idx) => {
                  const img = item.images.find((i) => i.isPrimary) ?? item.images[0];
                  const colorDot = item.variants?.[0]?.color;
                  return (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03, duration: 0.2 }}
                    >
                      <a
                        href={`/products/${item.slug}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-brand-pink/5 active:bg-brand-pink/10 active:translate-x-0.5 transition-all"
                      >
                        <div className="relative w-16 h-16 shrink-0 border-2 border-black dark:border-brand-pink/30 bg-pink-50 dark:bg-[#111] overflow-hidden shadow-[2px_2px_0_#000]">
                          {img ? (
                            <Image
                              src={img.url}
                              alt={img.alt ?? item.name}
                              fill
                              sizes="64px"
                              className="object-contain p-1"
                            />
                          ) : (
                            <span className="absolute inset-0 flex items-center justify-center text-brand-pink/20 text-xl font-jocham">
                              ✦
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          {item.subcategories?.[0] && (
                            <div className="flex items-center gap-1.5 mb-0.5">
                              {colorDot && (
                                <span
                                  className="inline-block w-2 h-2 rounded-full border border-black/20 shrink-0"
                                  style={{ backgroundColor: colorDot.hex }}
                                  aria-hidden="true"
                                />
                              )}
                              <p className="text-[10px] font-poppins font-semibold text-brand-pink uppercase tracking-wider">
                                {item.subcategories[0].label_pt}
                              </p>
                            </div>
                          )}
                          <p className="font-poppins font-bold text-sm text-black dark:text-white leading-tight truncate">
                            {item.name}
                          </p>
                          <div className="flex items-baseline gap-1.5 mt-1">
                            <span className="font-yellowtail text-lg text-brand-pink leading-none">
                              {formatPrice(item.price)}
                            </span>
                            {item.compareAtPrice && (
                              <span className="text-[10px] text-gray-400 font-inter line-through">
                                {formatPrice(item.compareAtPrice)}
                              </span>
                            )}
                          </div>
                        </div>

                        <span className="text-black/20 dark:text-white/20 shrink-0" aria-hidden="true">›</span>
                      </a>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          </>
        )}
      </div>

      {/* Bottom sheet filtros */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 z-[299] bg-black/40 backdrop-blur-sm"
            />
            <FiltersSheet
              filters={filters}
              onApply={setFilters}
              onClose={() => setShowFilters(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
