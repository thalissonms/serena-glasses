"use client";

import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

export const NavSearch = () => {
  const { t } = useTranslation("nav");

  return (
    <div className="relative hidden md:block group">
      <div className="absolute inset-0 bg-brand-pink-light transform rotate-2 border-2 border-black shadow-[4px_4px_0px_#000]" />
      <div className="relative flex items-center bg-brand-pink-light dark:bg-brand-pink-dark border-2 border-black/80 dark:border-brand-pink-light group-focus-within:border-brand-black-dark group-focus-within:dark:border-brand-pink transform -rotate-2 focus-within:rotate-0 transition-all duration-300">
        <Search
          className="ml-3 text-black dark:text-brand-pink-light group-focus-within:dark:text-brand-pink group-focus-within:text-brand-pink-dark"
          size={18}
        />
        <input
          type="text"
          aria-label={t("searchPlaceholder", { defaultValue: "Buscar..." })}
          placeholder={t("searchPlaceholder", { defaultValue: "Buscar..." })}
          className="w-32 md:w-48 px-2 py-2 font-poppins uppercase text-xs text-var(--color-foreground) dark:text-var(--color-foreground) placeholder-brand-pink/60 placeholder:font-semibold dark:placeholder:text-brand-pink-light/20 bg-transparent outline-none"
        />
      </div>
    </div>
  );
};
