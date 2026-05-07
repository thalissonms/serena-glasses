"use client";

import SlidesHeart from "@shared/components/layout/svg/Slides.svg";
import HeaderDivider from "@features/home/components/mobile/HeaderDivider";
import clsx from "clsx";
import { motion } from "framer-motion";
import { ArrowDownNarrowWide, ArrowUpNarrowWide, Search, X } from "lucide-react";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useRouter, useSearchParams } from "next/navigation";
import { useCategories } from "@features/categories/hooks/useCategories";
import type { SubcategoryRow } from "@features/categories/types/category.types";

interface Props {
  title: string;
  categorySlug?: string;
}

function pickLabel(sub: SubcategoryRow, lang: string): string {
  if (lang.startsWith("en") && sub.name_en) return sub.name_en;
  if (lang.startsWith("es") && sub.name_es) return sub.name_es;
  return sub.name_pt;
}

export const FilterSubCategories = ({ title, categorySlug }: Props) => {
  const { t, i18n } = useTranslation("nav");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: categories = [] } = useCategories();

  const subs: SubcategoryRow[] = useMemo(() => {
    if (!categorySlug) return [];
    const cat = categories.find((c) => c.slug === categorySlug);
    return cat?.subcategories ?? [];
  }, [categories, categorySlug]);

  const activeSubSlug = searchParams.get("sub");
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);
  const [narrowOpen, setNarrowOpen] = useState(false);

  function selectSub(slug: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("sub", slug);
    else params.delete("sub");
    router.push(`/products?${params.toString()}`);
  }

  return (
    <section className="w-full bg-brand-pink-light dark:bg-brand-pink-bg-dark text-black dark:text-white transition-colors pt-4 px-4">
      <HeaderDivider title={title} />
      <div className="h-12 relative flex items-center justify-between gap-4 group">
        <Search className="absolute left-2 text-brand-pink/60 dark:text-brand-yellow group-focus-within:text-brand-pink group-focus-within:stroke-3" size={18} />
        <input
          className="h-10 w-full border-[0.5px] border-brand-pink/30 dark:border-brand-pink-dark pl-8 pr-2 placeholder:text-brand-pink/30 dark:placeholder:text-brand-pink-dark focus:border-2 focus:border-brand-pink outline-none"
          type="text"
          placeholder={t("searchPlaceholder")}
        />
        <div className="h-full flex items-center justify-end gap-3 pt-3">
          <button onClick={() => setNarrowOpen((prev) => !prev)}>
            {!narrowOpen ? (
              <ArrowUpNarrowWide
                className="text-brand-pink dark:text-brand-yellow mb-2 "
                size={28}
                strokeWidth={2.5}
              />
            ) : (
              <ArrowDownNarrowWide
                className="text-brand-pink dark:text-brand-yellow mb-2"
                size={28}
                strokeWidth={2.5}
              />
            )}
          </button>
          {subs.length > 0 && (
            <button onClick={() => setSubCategoryOpen((prev) => !prev)}>
              {!subCategoryOpen ? (
                <SlidesHeart
                  className="text-brand-pink dark:text-brand-yellow dark:stroke-brand-yellow mb-2 stroke-brand-pink"
                  size={24}
                  strokeWidth={20}
                />
              ) : (
                <X
                  className="text-brand-pink dark:text-brand-yellow mb-2"
                  size={24}
                  strokeWidth={2}
                />
              )}
            </button>
          )}
        </div>
      </div>
      {subs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={
            subCategoryOpen
              ? { opacity: 1, y: 0, height: "auto" }
              : { opacity: 0, y: 20, height: 0 }
          }
          className="flex flex-wrap items-center justify-start mt-2 gap-3"
        >
          <button
            className={clsx(
              "border-2 shadow-brand-black dark:shadow-brand-blue py-1 px-2 cursor-pointer transition-all duration-300",
              !activeSubSlug
                ? "bg-brand-blue dark:bg-pink-400 shadow-[1px_1px_0px] border-brand-pink-dark"
                : "dark:bg-brand-pink-dark bg-brand-pink shadow-[3px_3px_0px] hover:shadow-[4px_4px_0px] border-brand-black dark:border-brand-pink-light",
            )}
            onClick={() => selectSub(null)}
          >
            <span
              className={clsx(
                "font-family-jocham font-light",
                !activeSubSlug
                  ? "text-brand-black dark:text-brand-pink-bg-dark"
                  : "text-white dark:text-white",
              )}
            >
              Todos
            </span>
          </button>
          {subs.map((sub) => {
            const active = activeSubSlug === sub.slug;
            return (
              <button
                key={sub.id}
                className={clsx(
                  "border-2 shadow-brand-black dark:shadow-brand-blue py-1 px-2 cursor-pointer transition-all duration-300",
                  active
                    ? "bg-brand-blue dark:bg-pink-400 shadow-[1px_1px_0px] border-brand-pink-dark"
                    : "dark:bg-brand-pink-dark bg-brand-pink shadow-[3px_3px_0px] hover:shadow-[4px_4px_0px] border-brand-black dark:border-brand-pink-light",
                )}
                onClick={() => selectSub(sub.slug)}
              >
                <span
                  className={clsx(
                    "font-family-jocham font-light",
                    active
                      ? "text-brand-black dark:text-brand-pink-bg-dark"
                      : "text-white dark:text-white",
                  )}
                >
                  {pickLabel(sub, i18n.language)}
                </span>
              </button>
            );
          })}
        </motion.div>
      )}
    </section>
  );
};
