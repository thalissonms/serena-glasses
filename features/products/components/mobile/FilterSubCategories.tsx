"use client";

import HeaderDivider from "@features/home/components/mobile/HeaderDivider";
import clsx from "clsx";
import {
  Clock,
  Sparkles,
  Star,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";


interface Props {
  title: string;
  categorySlug?: string;
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

export const FilterSubCategories = ({ title }: Props) => {
  const { t } = useTranslation("products");
  const [currentActive, setCurrentActive] = useState("");

  return (
    <section className="mb-4 flex w-full flex-col gap-3 pt-4 text-black transition-colors dark:text-white">
      <HeaderDivider title={title} />
      <div className="relative flex h-12 items-center justify-between">
        <div className="grid h-full w-full grid-cols-5 items-center gap-1.5">
          {SORT_OPTIONS.map(({ value, labelKey, Icon }) => {
            const active = currentActive === value;
            return (
              <button
                key={labelKey}
                className={clsx(
                  "flex h-full w-full flex-col items-center justify-center gap-1",
                  "relative rounded-bl-xs border-2",
                  active
                    ? "border-brand-white/30 bg-brand-dark-surface-1"
                    : "border-brand-white/20 bg-brand-dark-surface-2",
                )}
                onClick={() => setCurrentActive(value)}
              >
                <Icon
                  className={clsx("", active ? "text-brand-pink-light" : "text-brand-pink")}
                  size={22}
                  strokeWidth={2.5}
                />
                <span className="text-[8px] font-bold text-brand-white">
                  {t(labelKey)}
                </span>
                <div
                  className={clsx(
                    "absolute -top-1.25 -right-1.25 h-2 w-2 rotate-45 border-b-2 bg-[#20151B]",
                    active ? "block border-[#72676D]" : "hidden border-[#71646A]",
                  )}
                />
                <div className="absolute right-0 bottom-0 h-2 w-full bg-linear-0 from-brand-black/30 to-brand-black/0 dark:from-brand-black/25 dark:to-brand-black/0" />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
