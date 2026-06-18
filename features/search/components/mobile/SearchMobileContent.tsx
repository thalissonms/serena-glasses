"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ArrowLeft, Frown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, m } from "framer-motion";
import { useSmartBack } from "@shared/navigation/hooks/useBackIntercept";
import { useSearch } from "@features/search/hooks/useSearch";
import type { SearchFilters } from "@features/search/types/search.types";
import clsx from "clsx";
import SlidesHeart from "@shared/components/layout/svg/Slides.svg";
import { PillY2K } from "@shared/components/ui/Pills";
import BadgeCounter from "@shared/navigation/components/BadgeCounter";
import { ListItemMobile } from "@shared/components/ui/ListItemMobile";

import { EmptyListMobile } from "@shared/components/ui/EmptyListMobile";
import { SearchResultSkeleton } from "./SearchResultSkeleton";
import { FilterChip } from "./FilterChip";
import { FiltersSheet } from "./FiltersSheet";
import { POPULAR_CHIPS } from "../../consts/PopularSearch.const";
import { SearchInput } from "@shared/components/forms/inputs/SearchInput";

type ActiveFilter = { type: keyof SearchFilters; value: string; label: string };

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
    <div className="min-h-screen bg-brand-pink-light/60 dark:bg-brand-dark-surface-0 text-black dark:text-white">
      <header className="w-full sticky top-0 z-50 bg-brand-pink-light/80 dark:bg-brand-dark-surface-0 backdrop-blur-3xl border-b-2 border-brand-pink/20 dark:border-brand-dark-surface-2/40 border-dashed">
        <div className="flex items-center gap-2 px-2 py-2 h-16">
          <button
            type="button"
            onClick={handleBack}
            aria-label={t("back")}
            className="p-2 shrink-0 cursor-pointer focus:outline-0"
          >
            <ArrowLeft
              className="w-6.5 h-6.5 text-brand-black/80 dark:text-brand-pink-light"
              strokeWidth={2.5}
              aria-hidden="true"
            />
          </button>
          <div className={clsx("w-10 flex-1 relative group",
            "[clip-path:polygon(0%_0%,calc(100%-10px)_0%,100%_10px,100%_100%,calc(0%+10px)_100%,0%_calc(100%-10px))]"
          )}>
            <div className="p-px bg-brand-black/75 dark:bg-brand-white/75 rounded-tl-md rounded-br-md focus-within:bg-brand-pink dark:focus-within:bg-brand-purple">
              <SearchInput
                ref={inputRef}
                value={query}
                onChange={handleChange}
                placeholder={t("placeholder")}
                ariaLabel={t("placeholder")}
                onClear={() => { setQuery(""); setDebouncedQ(""); }}
                loading={isFetching && debouncedQ.length >= 2}
                autoFocus
                className={clsx("border-none rounded-tl-[5px] rounded-br-[5px] transition-all duration-300 font-semibold ",
                  "[clip-path:polygon(0%_0%,calc(100%-9.5px)_0%,100%_9.5px,100%_100%,calc(0%+9.5px)_100%,0%_calc(100%-9.5px))]"
                )}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowFilters(true)}
            aria-label={t("openFilters")}
            className={"p-2 shrink-0 transition-all cursor-pointer text-black dark:text-brand-white hover:bg-brand-pink hover:text-brand-white hover:border-brand-black"}
          >
            <div className="relative">
              <SlidesHeart className="w-6.25 h-6.25 text-brand-black/80 dark:text-brand-pink-light"
                strokeWidth={10}
                aria-hidden="true" />
              {activeFilterChips.length > 0 && (
                <div className="absolute -top-1 -right-1">
                  <BadgeCounter count={activeFilterChips.length} />
                </div>

              )}
            </div>
          </button>
        </div>

        {activeFilterChips.length > 0 && (
          <div className="flex gap-2 px-4 pb-4 flex-wrap">
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

      <div className="relative pb-20">
        {debouncedQ.length < 2 && (
          <div className="relative z-10 flex flex-col items-center justify-center py-12 px-6 text-center">
            <p className="font-poppins text-[14px] text-brand-pink/75 dark:text-brand-purple/75 font-black uppercase tracking-widest mb-6">
              {t("promptShort")}
            </p>
            <div className="flex gap-2 flex-wrap justify-center -mt-4">
              {POPULAR_CHIPS.map((chip) => (
                <PillY2K
                  key={chip}
                  active={false}
                  onClick={() => handleChipClick(chip)}
                >

                  {chip}
                </ PillY2K>
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

        {showEmpty && (
          <EmptyListMobile
            mainText={t("emptyResults.title")}
            subText={t("results.emptyHint")}
            icon={<Frown className="w-16 h-16 text-brand-pink dark:text-brand-pink-light" />}
          />
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

            <ul className="relative z-10 divide-y divide-black/10 dark:divide-brand-pink/10 mt-2 px-1" aria-busy={isFetching}>
              <AnimatePresence initial={false}>
                {results.map((item, idx) => {
                  const img = item.images.find((i) => i.isPrimary) ?? item.images[0];
                  return (
                    <ListItemMobile
                      key={item.id}
                      href={`/products/${item.slug}`}
                      name={item.name}
                      price={item.price}
                      compareAtPrice={item.compareAtPrice}
                      image={img}
                      index={idx}
                    />
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
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 z-299 bg-black/40 backdrop-blur-sm"
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
