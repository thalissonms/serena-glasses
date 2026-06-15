"use client";

import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { useSearch } from "@features/search/hooks/useSearch";
import { formatPrice } from "@features/products/utils/formatPrice";
import type { SearchResult } from "@features/search/types/search.types";
import { SearchInput } from "@shared/components/forms/inputs/SearchInput";

export const NavSearch = () => {
  const { t } = useTranslation("search");
  const [query, setQuery] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const { data: results = [], isFetching } = useSearch(debouncedQ);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(val.length >= 2);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedQ(val), 300);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setQuery("");
      setDebouncedQ("");
    }
  };

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  const preview = results.slice(0, 8);

  return (
    <div ref={wrapperRef} className="relative hidden md:block group">
      <div className="absolute inset-0 bg-brand-pink-light dark:bg-brand-black transform rotate-2 border-2 border-brand-black shadow-[4px_4px_0px] shadow-brand-black" />

      <SearchInput
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => query.length >= 2 && setIsOpen(true)}
        placeholder={t("placeholder")}
        ariaLabel={t("placeholder")}
        loading={isFetching && query.length >= 2}
        className="w-32 md:w-54 border-black/80 dark:border-brand-pink-light -rotate-2 focus-within:rotate-0 group-focus-within:border-brand-black-dark group-focus-within:dark:border-brand-pink"
      />

      {isOpen && (
        <div className="absolute top-10 -left-1/2 mt-2 w-80 lg:w-96 xl:w-md overflow-x-hidden bg-brand-light-surface-2 dark:bg-brand-dark-surface-2 border-4 border-brand-black   shadow-[6px_6px_0px] shadow-brand-black z-200">
          {isFetching ? (
            <ul className="divide-y divide-black/10 dark:divide-brand-pink/20">
              {Array.from({ length: 4 }).map((_, i) => (
                <li key={i} className="flex items-center gap-3 px-3 py-2.5">
                  <div className="w-10 h-10 shrink-0 bg-brand-pink/10 animate-pulse" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2.5 bg-brand-pink/10 animate-pulse rounded-none w-3/4" />
                    <div className="h-2 bg-brand-pink/10 animate-pulse rounded-none w-1/2" />
                  </div>
                  <div className="h-4 w-10 bg-brand-pink/10 animate-pulse rounded-none" />
                </li>
              ))}
            </ul>
          ) : preview.length === 0 && debouncedQ.length >= 2 ? (
            <div className="px-4 py-6 text-center">
              <span className="block font-jocham text-3xl text-brand-info/40 dark:text-brand-pink-light/60 mb-2">✦</span>
              <p className="font-poppins text-xs font-bold uppercase tracking-wider text-brand-black/60 dark:text-brand-white/60">
                {t("results.empty", { q: debouncedQ })}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-black/10 dark:divide-brand-pink/20 overflow-x-hidden max-h-96 overflow-y-auto">
              {preview.map((item: SearchResult) => {
                const img = item.images.find((i) => i.isPrimary) ?? item.images[0];
                return (
                  <li key={item.id}>
                    <a
                      href={`/products/${item.slug}`}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand-pink-light/60 dark:hover:bg-brand-pink/10 hover:translate-x-0.5 transition-all duration-150"
                    >
                      <div className="relative w-10 h-10 shrink-0 border border-brand-black/10 dark:border-brand-pink/20 bg-pink-50 dark:bg-[#0a0a0a] overflow-hidden">
                        {img ? (
                          <Image src={img.url} alt={img.alt ?? item.name} fill sizes="40px" className="object-contain p-0.5" />
                        ) : (
                          <span className="absolute inset-0 flex items-center justify-center font-jocham text-brand-pink/30 text-lg">✦</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-poppins text-xs font-bold truncate text-brand-black dark:text-brand-white">
                          {item.name}
                        </p>
                        {item.subcategories?.[0] && (
                          <p className="text-[10px] text-brand-pink dark:text-brand-pink-light font-poppins uppercase tracking-wide truncate">
                            {item.subcategories[0].label_pt}
                          </p>
                        )}
                      </div>
                      <span className="font-family-poppins font-semibold italic text-sm text-brand-pink dark:text-brand-pink-light shrink-0 leading-none">
                        {formatPrice(item.price)}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          )}

          {results.length > 0 && (
            <div className="border-t-2 border-brand-black p-2">
              <a
                href={`/search?q=${encodeURIComponent(debouncedQ)}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 font-poppins text-xs font-black uppercase tracking-wider border-2 border-brand-black bg-brand-pink text-brand-white shadow-[4px_4px_0] shadow-brand-black hover:shadow-[2px_2px_0] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-150"
              >
                {t("seeAll", { count: results.length })}
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
