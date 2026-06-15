"use client";
import { Sun, Moon } from "lucide-react";
import clsx from "clsx";
import { useTheme } from "@shared/providers/ThemeProvider";
import { useMounted } from "@shared/hooks/useMounted";
import { useTranslation } from "react-i18next";
import ButtonIconY2K from "@/shared/components/ui/ButtonIconY2K";

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const mounted = useMounted();
  const { t } = useTranslation("nav");
  const isDark = resolvedTheme === "dark";

  return (
    <>
      <div className="hidden md:flex items-center">
        <ButtonIconY2K
          icon={isDark ? Moon : Sun}
          label={isDark ? t("toggleTheme.toLight") : t("toggleTheme.toDark")}
          onClick={toggleTheme}
        />
      </div>

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
