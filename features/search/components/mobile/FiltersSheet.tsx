"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { m } from "framer-motion";
import { useSearchFacets } from "@features/search/hooks/useSearch";
import type { SearchFilters } from "@features/search/types/search.types";
import clsx from "clsx";
import { Pill } from "@shared/components/ui/Pills";

export function FiltersSheet({
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
    <m.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 340, damping: 36 }}
      className="fixed inset-x-0 z-300 bg-white dark:bg-brand-dark-surface-0 flex flex-col rounded-t-md bottom-(--nav-bottom-height)"
      role="dialog"
      aria-modal="true"
      aria-label={t("filters.title")}
    >
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-8 h-1 rounded-full bg-black/20 dark:bg-white/20" />
      </div>

      <div className="flex items-center justify-between px-4 py-2 border-b-2 border-black dark:border-brand-white/40">
        <h2 className={clsx("font-family-poppins uppercase tracking-widest font-bold text-2xl text-brand-pink",
          "[-webkit-text-stroke:1px_rgba(18,18,18,1)] [text-stroke:1px_rgba(18,18,18,1)] dark:[-webkit-text-stroke:1px_rgba(155,0,255,0.75)] dark:[text-stroke:1.5px_rgba(155,0,255,0.75)]",
          "text-shadow-[2px_2px_0] text-shadow-brand-black"
        )}>{t("filters.title")}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("filters.close")}
          className="p-2 hover:bg-brand-pink hover:text-white transition-colors cursor-pointer"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="overflow-y-auto flex-1 px-4 py-4 space-y-5">
        {facets?.subcategories && facets.subcategories.length > 0 && (
          <section>
            <p className="font-poppins text-xs font-black uppercase tracking-widest text-black dark:text-white mb-2">
              {t("filters.subcategories")}
            </p>
            <div className="flex flex-wrap gap-2">
              {facets.subcategories
                .filter((sub, index, self) => self.findIndex(t => t.slug === sub.slug) === index)
                .map((sub) => (
                  <Pill
                    key={sub.slug}
                    onClick={() => toggle("subcategory", sub.slug)}
                    aria-label={sub.label_pt}
                    active={local.subcategory === sub.slug}
                  >
                    {sub.label_pt}
                  </Pill>
                ))}
            </div>
          </section>
        )}

        {facets?.shapes && facets.shapes.length > 0 && (
          <section>
            <p className="font-poppins text-xs font-black uppercase tracking-widest text-black dark:text-white mb-2">
              {t("filters.shapes")}
            </p>
            <div className="flex flex-wrap gap-2">
              {facets.shapes.map((shape) => (
                <Pill
                  key={shape.slug}
                  onClick={() => toggle("shape", shape.slug)}
                  aria-label={shape.label_pt}
                  active={local.shape === shape.slug}
                >
                  {shape.label_pt}
                </Pill>
              ))}
            </div>
          </section>
        )}

        {facets?.colors && facets.colors.length > 0 && (
          <section>
            <p className="font-poppins text-xs font-black uppercase tracking-widest text-black dark:text-white mb-2">
              {t("filters.colors")}
            </p>
            <div className="flex flex-wrap gap-3">
              {facets.colors.map((color) => (
                <Pill
                  key={color.name}
                  onClick={() => toggle("color", color.name)}
                  aria-label={color.name}
                  active={local.color === color.name}
                >
                  <span
                    className={`w-3 h-3 rounded-full border-2 transition-all block ${local.color === color.name
                      ? "border-brand-pink shadow-[0_0_0_0.5px] shadow-brand-pink"
                      : "border-black/30 dark:border-white/20"
                      }`}
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-[9px] font-poppins text-black/60 dark:text-white/50 leading-tight text-center max-w-10 truncate">
                    {color.name}
                  </span>
                </Pill>
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
          className="flex-2 py-3 font-poppins text-xs font-black uppercase tracking-widest border-2 border-black dark:border-brand-pink bg-brand-pink text-white shadow-[4px_4px_0_#000] active:shadow-[2px_2px_0_#000] active:translate-y-0.5 transition-all cursor-pointer"
        >
          {t("filters.apply")}
        </button>
      </div>
    </m.div>
  );
}
