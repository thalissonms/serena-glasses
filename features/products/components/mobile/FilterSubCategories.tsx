"use client";

import SlidesHeart from "@shared/components/layout/svg/Slides.svg";
import HeaderDivider from "@features/home/components/mobile/HeaderDivider";
import { SearchInput } from "@shared/components/forms/inputs/SearchInput";
import clsx from "clsx";
import { motion } from "framer-motion";
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  Clock,
  Sparkles,
  Star,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
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

const SORT_OPTIONS = [
  { value: "", labelKey: "listing.sortFeatured", Icon: Sparkles },
  { value: "newest", labelKey: "listing.sortNewest", Icon: Clock },
  { value: "price-asc", labelKey: "listing.sortPriceAsc", Icon: TrendingUp },
  {
    value: "price-desc",
    labelKey: "listing.sortPriceDesc",
    Icon: TrendingDown,
  },
  { value: "rating", labelKey: "listing.sortRating", Icon: Star },
] as const;

export const FilterSubCategories = ({ title, categorySlug }: Props) => {
  const { t } = useTranslation("products");
  const [currentActive, setCurrentActive] = useState("");

  return (
    <section className="w-full flex flex-col gap-3 mb-4 text-black dark:text-white transition-colors pt-4">
      <HeaderDivider title={title} />
      <div className="h-12 relative flex items-center justify-between">
        <div className="w-full h-full grid grid-cols-5 items-center gap-1.5">
          {SORT_OPTIONS.map(({ value, labelKey, Icon }) => {
            const active = currentActive === value;
            return (
              <>
                <button
                  key={labelKey}
                  className={clsx(
                    "w-full h-full flex flex-col justify-center items-center gap-1",
                    "border-2 relative rounded-bl-xs",
                    active
                      ? "bg-brand-dark-surface-1 border-brand-white/30"
                      : "bg-brand-dark-surface-2 border-brand-white/20",
                  )}
                  onClick={() => setCurrentActive(value)}
                >
                  <Icon
                    className={clsx("", active ? "text-brand-pink-light" : "text-brand-pink")}
                    size={22}
                    strokeWidth={2.5}
                  />
                  <span className="text-[8px] text-brand-white font-bold">
                    {t(labelKey)}
                  </span>
                  <div
                    className={clsx(
                      "w-2 h-2 bg-[#20151B] absolute rotate-45 -top-1.25 -right-1.25 border-b-2",
                      active ? "border-[#72676D] block" : "border-[#71646A] hidden",
                    )}
                  />
                  <div className="w-full h-2 absolute bg-linear-0 from-brand-black/30 to-brand-black/0 dark:from-brand-black/25 dark:to-brand-black/0 bottom-0 right-0" />
                </button>
              </>
            );
          })}
        </div>
      </div>
    </section>
  );
};
