"use client";
import { Sun, Moon } from "lucide-react";
import clsx from "clsx";
import { useTheme } from "@shared/providers/ThemeProvider";
import { useMounted } from "@shared/hooks/useMounted";
import { useTranslation } from "react-i18next";

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const mounted = useMounted();
  const { t } = useTranslation("nav");
  const isDark = resolvedTheme === "dark";

  return (
    <>
      <button
        type="button"
        onClick={toggleTheme}
        className="relative group cursor-pointer hidden md:inline-flex"
        aria-label={isDark ? t("toggleTheme.toLight") : t("toggleTheme.toDark")}
      >
        <div className="absolute inset-0 bg-brand-pink transform rotate-2 group-hover:rotate-3 transition-transform duration-300 border-2 border-black dark:border-brand-pink-light shadow-[4px_4px_0px] shadow-brand-pink-light group-hover:shadow-[6px_6px_0px_#000]" />
        <div
          className={clsx(
            "relative w-12 h-12 bg-brand-pink-light dark:bg-brand-pink-dark border-2 border-black dark:border-brand-pink-light flex items-center justify-center transform -rotate-2 group-hover:rotate-0 transition-all duration-300",
            mounted ? "opacity-100" : "opacity-0",
          )}
        >
          <Sun
            size={20}
            className={`absolute text-black group-hover:text-brand-pink transition-all duration-300 ${
              isDark
                ? "opacity-0 rotate-90 scale-0"
                : "opacity-100 rotate-0 scale-100"
            }`}
          />
          <Moon
            size={20}
            className={`absolute text-black group-hover:text-brand-pink dark:text-brand-pink-light dark:group-hover:text-brand-pink transition-all duration-300 ${
              isDark
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 -rotate-90 scale-0"
            }`}
          />
        </div>
      </button>

      <button
        type="button"
        onClick={toggleTheme}
        className={clsx(
          "relative group cursor-pointer block md:hidden transition-opacity duration-300",
          mounted ? "opacity-100" : "opacity-0",
        )}
        aria-label={isDark ? t("toggleTheme.toLight") : t("toggleTheme.toDark")}
      >
        {isDark ? (
          <Sun className="h-7 text-brand-pink-dark dark:text-brand-blue" />
        ) : (
          <Moon className="h-7 text-brand-pink dark:text-brand-blue" />
        )}
      </button>
    </>
  );
}
