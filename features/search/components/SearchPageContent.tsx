"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useRef, useState, useCallback } from "react";
import { formatPrice } from "@features/products/utils/formatPrice";
import { useSearch, useSearchFacets } from "@features/search/hooks/useSearch";
import { SearchInput } from "@shared/components/forms/inputs/SearchInput";
import GlassesBag from "@shared/components/layout/svg/GlassesBag.svg";
import type { SearchResult } from "../types/search.types";

interface Props {
  query: string;
  initialResults: SearchResult[];
}

function MarqueeBar() {
  const text = Array(20).fill("✦ BUSCAR").join("  ");
  return (
    <div className="overflow-hidden border-b-2 border-black/10 dark:border-brand-pink/10 py-2.5 bg-brand-pink-light/40 dark:bg-brand-pink-dark/30">
      <p className="animate-marquee whitespace-nowrap font-poppins text-[10px] uppercase tracking-[0.4em] text-brand-pink/60 dark:text-brand-pink/40">
        {text}
      </p>
    </div>
  );
}

function HeroSearchInput({
  value,
  onChange,
  onClear,
  loading,
  inputRef,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  loading: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const { t } = useTranslation("search");
  return (
    <div className="relative group w-full max-w-2xl mx-auto">
      {/* Layer 1 — furthest back */}
      <div className="absolute inset-0 bg-brand-pink transform rotate-[2.5deg] border-4 border-black" />
      {/* Layer 2 */}
      <div className="absolute inset-0 bg-brand-pink-light transform rotate-[1.2deg] border-4 border-black" />
      {/* Input */}
      <SearchInput
        ref={inputRef}
        value={value}
        onChange={onChange}
        onClear={value ? onClear : undefined}
        placeholder={t("placeholder")}
        ariaLabel={t("placeholder")}
        loading={loading}
        size="lg"
        className="relative z-10 border-4 border-black dark:border-brand-pink shadow-[8px_8px_0_#000] focus-within:shadow-[4px_4px_0_#000] focus-within:-translate-y-0.5 transition-all duration-200"
      />
    </div>
  );
}

function CompactSearchBar({
  value,
  onChange,
  onClear,
  loading,
  inputRef,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  loading: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const { t } = useTranslation("search");
  return (
    <div className="relative group max-w-xl">
      <div className="absolute inset-0 bg-brand-pink transform rotate-[0.7deg] border-2 border-black" />
      <SearchInput
        ref={inputRef}
        value={value}
        onChange={onChange}
        onClear={onClear}
        placeholder={t("placeholder")}
        ariaLabel={t("placeholder")}
        loading={loading}
        className="relative z-10 border-2 border-black dark:border-brand-pink shadow-[4px_4px_0_#000]"
      />
    </div>
  );
}

function CategoryChips({ onSelect }: { onSelect: (slug: string) => void }) {
  const { t } = useTranslation("search");
  const { data: facets } = useSearchFacets();
  const chips = (facets?.subcategories ?? []).slice(0, 6);

  if (chips.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-5 justify-center">
        <div className="w-8 h-px bg-brand-pink/30" />
        <span className="font-poppins text-[10px] uppercase tracking-[0.35em] text-black/40 dark:text-white/40">
          {t("suggestions")}
        </span>
        <span className="text-brand-pink/40 text-sm">✦</span>
        <div className="w-8 h-px bg-brand-pink/30" />
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        {chips.map((sub) => (
          <button
            key={sub.slug}
            type="button"
            onClick={() => onSelect(sub.slug)}
            className="px-4 py-2 font-poppins text-xs font-bold uppercase tracking-wider border-2 border-black dark:border-brand-pink bg-transparent text-black dark:text-white hover:bg-brand-pink hover:text-white hover:border-black shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#FF00B6] hover:shadow-[4px_4px_0_#000] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all duration-150 cursor-pointer"
          >
            {sub.label_pt}
          </button>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ query, onClear }: { query: string; onClear: () => void }) {
  const { t } = useTranslation("search");
  const router = useRouter();

  return (
    <div className="relative border-4 border-black dark:border-brand-pink shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#FF00B6] bg-brand-pink-light dark:bg-[#1a1a1a] p-12 sm:p-16 overflow-hidden">
      <div className="absolute inset-0 noise-overlay opacity-50 pointer-events-none" />
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8 rotate-[-3deg] pointer-events-none select-none">
        <div className="bg-white dark:bg-[#111] border-2 border-black/10 shadow-[3px_3px_0_#000] p-2 pb-6">
          <GlassesBag className="text-brand-pink/30 dark:text-brand-pink/20" size={64} />
        </div>
      </div>
      <div className="relative text-center max-w-sm mx-auto">
        <h2 className="font-jocham text-3xl sm:text-4xl uppercase text-black dark:text-white mb-3">
          {t("emptyResults.desktopTitle")}
        </h2>
        <p className="font-inter text-sm text-black/60 dark:text-white/50 mb-2">
          {t("results.empty", { q: query })}
        </p>
        <p className="font-inter text-sm text-black/40 dark:text-white/30 mb-8">
          {t("results.emptyHint")}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="font-poppins font-bold text-xs uppercase tracking-wider bg-brand-pink text-white border-2 border-black px-5 py-3 shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] hover:-translate-y-0.5 active:shadow-none active:translate-y-0 transition-all cursor-pointer"
          >
            {t("suggestions")} →
          </button>
          <button
            type="button"
            onClick={onClear}
            className="font-poppins font-bold text-xs uppercase tracking-wider bg-transparent text-black dark:text-white border-2 border-black dark:border-brand-pink px-5 py-3 shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#FF00B6] hover:shadow-[6px_6px_0_#000] hover:-translate-y-0.5 active:shadow-none active:translate-y-0 transition-all cursor-pointer"
          >
            {t("emptyResults.clearCta")}
          </button>
        </div>
      </div>
    </div>
  );
}

function ResultGrid({ results }: { results: SearchResult[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {results.map((item) => {
        const img = item.images.find((i) => i.isPrimary) ?? item.images[0];
        return (
          <a
            key={item.id}
            href={`/products/${item.slug}`}
            className="group block bg-white dark:bg-[#1a1a1a] border-2 border-black dark:border-brand-pink-light shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0_#FF00B6] hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative aspect-square border-b-2 border-black dark:border-brand-pink/30 bg-pink-50 dark:bg-[#0a0a0a] overflow-hidden">
              {img ? (
                <Image
                  src={img.url}
                  alt={img.alt ?? item.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-brand-pink/20 text-4xl font-jocham">
                  ✦
                </div>
              )}
            </div>
            <div className="p-3">
              {item.subcategories?.[0] && (
                <p className="text-[10px] font-poppins font-semibold text-brand-pink uppercase tracking-wider mb-1">
                  {item.subcategories[0].label_pt}
                </p>
              )}
              <h3 className="font-poppins font-bold text-sm text-black dark:text-white leading-tight mb-2 line-clamp-2">
                {item.name}
              </h3>
              <div className="flex items-baseline gap-1.5">
                <span className="font-yellowtail text-xl text-brand-pink leading-none">
                  {formatPrice(item.price)}
                </span>
                {item.compareAtPrice && (
                  <span className="text-xs text-gray-400 font-inter line-through">
                    {formatPrice(item.compareAtPrice)}
                  </span>
                )}
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}

function ResultSkeletons() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-brand-pink/5 border-2 border-black/10 dark:border-brand-pink/10"
          style={{ aspectRatio: "3/4" }}
        />
      ))}
    </div>
  );
}

export function SearchPageContent({ query: initialQuery, initialResults }: Props) {
  const { t } = useTranslation("search");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQ, setDebouncedQ] = useState(initialQuery);
  const [hasInteracted, setHasInteracted] = useState(false);

  const { data: liveResults = [], isFetching } = useSearch(debouncedQ);

  // Use SSR results until user interacts; then switch to live results
  const results = hasInteracted
    ? liveResults
    : liveResults.length > 0
    ? liveResults
    : initialResults;

  const hasQuery = (hasInteracted ? debouncedQ : initialQuery).length >= 2;
  const effectiveQuery = hasInteracted ? debouncedQ : initialQuery;
  const isEmpty = hasQuery && !isFetching && results.length === 0;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setQuery(val);
      setHasInteracted(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setDebouncedQ(val);
        const url = val.length >= 2 ? `/search?q=${encodeURIComponent(val)}` : "/search";
        router.replace(url, { scroll: false });
      }, 300);
    },
    [router],
  );

  function handleClearSearch() {
    setQuery("");
    setDebouncedQ("");
    setHasInteracted(true);
    router.replace("/search", { scroll: false });
  }

  function handleCategorySelect(slug: string) {
    router.push(`/search?subcategory=${encodeURIComponent(slug)}`);
  }

  return (
    <>
      {!hasQuery && <MarqueeBar />}

      <main className="min-h-screen bg-[#FFF0FA] dark:bg-brand-pink-bg-dark text-black dark:text-white transition-colors">
        {/* ── HERO (sem query) ─────────────────────────────────────── */}
        {!hasQuery ? (
          <section className="relative overflow-hidden border-b-4 border-black dark:border-brand-pink/30">
            {/* Noise atmosphere */}
            <div className="noise-overlay absolute inset-0 opacity-25 pointer-events-none z-0" />

            {/* Decorative large ✦ */}
            <span
              className="absolute right-8 top-1/2 -translate-y-1/2 font-jocham text-[160px] text-brand-pink/5 dark:text-brand-pink/8 leading-none select-none pointer-events-none z-0"
              aria-hidden="true"
            >
              ✦
            </span>
            {/* Decorative tilted square */}
            <div className="absolute top-10 left-10 w-20 h-20 border-4 border-brand-pink/10 rotate-12 pointer-events-none z-0" />
            <div className="absolute bottom-8 right-1/4 w-10 h-10 border-4 border-brand-pink/10 -rotate-6 pointer-events-none z-0" />

            <div className="relative z-10 py-20 px-4 sm:px-8 text-center">
              <p className="font-poppins text-[10px] uppercase tracking-[0.45em] text-brand-pink/60 dark:text-brand-pink/50 mb-3">
                ✦ Serena Glasses ✦
              </p>

              <h1 className="font-jocham text-6xl sm:text-8xl uppercase text-black dark:text-white leading-none mb-10">
                {t("title")}
              </h1>

              <HeroSearchInput
                value={query}
                onChange={handleChange}
                onClear={handleClearSearch}
                loading={isFetching && debouncedQ.length >= 2}
                inputRef={inputRef}
              />

              <p className="font-poppins text-[10px] uppercase tracking-widest text-black/30 dark:text-white/30 mt-4">
                {t("promptShort")}
              </p>

              <CategoryChips onSelect={handleCategorySelect} />
            </div>
          </section>
        ) : (
          /* ── COMPACT HEADER (com query) ───────────────────────────── */
          <section className="border-b-4 border-black dark:border-brand-pink/30 bg-brand-pink-light/30 dark:bg-brand-pink-dark/30 py-6 px-4 sm:px-8 lg:px-20">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-5">
                <h1 className="font-jocham text-4xl sm:text-5xl uppercase text-black dark:text-white leading-none">
                  {t("results.title")}{" "}
                  <span className="font-yellowtail text-brand-pink normal-case">
                    &ldquo;{effectiveQuery}&rdquo;
                  </span>
                </h1>
                {!isFetching && results.length > 0 && (
                  <p
                    className="text-gray-500 dark:text-gray-400 font-poppins text-sm sm:mb-1 shrink-0"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {t(
                      results.length === 1 ? "results.count_one" : "results.count_other",
                      { count: results.length },
                    )}
                  </p>
                )}
              </div>

              <CompactSearchBar
                value={query}
                onChange={handleChange}
                onClear={handleClearSearch}
                loading={isFetching}
                inputRef={inputRef}
              />
            </div>
          </section>
        )}

        {/* ── RESULTS ───────────────────────────────────────────────── */}
        {hasQuery && (
          <div
            className="py-10 px-4 sm:px-8 lg:px-20"
            aria-live="polite"
            aria-busy={isFetching}
          >
            <div className="max-w-7xl mx-auto">
              {isEmpty ? (
                <EmptyState query={effectiveQuery} onClear={handleClearSearch} />
              ) : isFetching ? (
                <ResultSkeletons />
              ) : (
                <ResultGrid results={results} />
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
