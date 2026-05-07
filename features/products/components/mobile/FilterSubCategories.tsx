"use client";

import SlidesHeart from "@shared/components/layout/svg/Slides.svg";
import HeaderDivider from "@features/home/components/mobile/HeaderDivider";
import clsx from "clsx";
import { motion } from "framer-motion";
import { ArrowDownNarrowWide, ArrowUpNarrowWide, Search, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const subcategoryMock = [
  "Categoria 1",
  "Categoria 2",
  "Categoria 3",
  "Categoria 4",
];

export const FilterSubCategories = ({ title }: { title: string }) => {
  const { t } = useTranslation("nav");
  const [selectedSubcategory, setSelectSubcategory] = useState(0);
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);
  const [narrowOpen, setNarrowOpen] = useState(false);
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
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: -20, height: 0 }}
        animate={
          subCategoryOpen
            ? { opacity: 1, y: 0, height: "auto" }
            : { opacity: 0, y: 20, height: 0 }
        }
        className="flex flex-wrap items-center justify-start mt-2 gap-3"
      >
        {subcategoryMock.map((category, i) => (
          <button
            className={clsx(
              "border-2 shadow-brand-black dark:shadow-brand-blue py-1 px-2 cursor-pointer transition-all duration-300",
              selectedSubcategory === i
                ? "bg-brand-blue dark:bg-pink-400 shadow-[1px_1px_0px] border-brand-pink-dark"
                : "dark:bg-brand-pink-dark bg-brand-pink shadow-[3px_3px_0px] hover:shadow-[4px_4px_0px] border-brand-black dark:border-brand-pink-light",
            )}
            key={i}
            onClick={() => setSelectSubcategory(i)}
          >
            <span
              className={clsx(
                "font-family-jocham font-light",
                selectedSubcategory === i
                  ? "text-brand-black dark:text-brand-pink-bg-dark"
                  : "text-white dark:text-white",
              )}
            >
              {category}
            </span>
          </button>
        ))}
      </motion.div>
    </section>
  );
};
