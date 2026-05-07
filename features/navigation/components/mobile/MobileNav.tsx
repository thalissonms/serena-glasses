"use client";
import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import clsx from "clsx";
import Link from "next/link";
import { isActive, isNavActive } from "../../utils/isActive";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCategories } from "@features/categories/hooks/useCategories";
import type { CategoryWithSubs } from "@features/categories/types/category.types";

type Page = { href: string; label: string };

function categoryToPage(c: CategoryWithSubs, lang: string): Page {
  const href = c.kind === "flag" && c.href_override ? c.href_override : `/products?category=${c.slug}`;
  const label =
    lang.startsWith("en") && c.name_en
      ? c.name_en
      : lang.startsWith("es") && c.name_es
        ? c.name_es
        : c.name_pt;
  return { href, label };
}

export const MobileNav = () => {
  const { data: categories } = useCategories();
  const { i18n, t } = useTranslation("nav");
  const pages: Page[] = (categories ?? []).map((c) => categoryToPage(c, i18n.language));

  return (
    <Suspense fallback={<MobileNavFallback pages={pages} t={t} />}>
      <MobileNavInner pages={pages} t={t} />
    </Suspense>
  );
};

function MobileNavFallback({ pages, t }: { pages: Page[]; t: (k: string) => string }) {
  const pathname = usePathname();
  return (
    <MobileNavUI
      pages={pages}
      isItemActive={(href) => isActive(pathname, href.split("?")[0])}
      t={t}
    />
  );
}

function MobileNavInner({ pages, t }: { pages: Page[]; t: (k: string) => string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (
    <MobileNavUI
      pages={pages}
      isItemActive={(href) => isNavActive(pathname, searchParams, href)}
      t={t}
    />
  );
}

function MobileNavUI({
  pages,
  isItemActive,
  t,
}: {
  pages: Page[];
  isItemActive: (href: string) => boolean;
  t: (key: string) => string;
}) {
  return (
    <div className="lg:hidden mt-6 pb-4">
      <div className="flex flex-col gap-3">
        {pages.map((item) => {
          const active = isItemActive(item.href);
          return (
            <div key={item.href} className="relative">
              <div
                className={clsx(
                  "absolute inset-0 transform rotate-0.2 border-2 border-brand-black-dark transition-transform duration-300",
                  "shadow-[3px_3px_0px] shadow-brand-black-dark dark:shadow-brand-pink-light",
                  active
                    ? "-rotate-1 bg-black dark:bg-brand-pink"
                    : "dark:bg-brand-pink-light bg-brand-black-dark",
                )}
              />
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "relative block px-4 py-2   font-family-poppins font-bold uppercase text-sm tracking-wider transform -rotate-1 border-2 transition-colors duration-200",
                  active
                    ? "text-brand-pink border-black bg-brand-pink-light dark:text-brand-pink dark:border-brand-pink dark:bg-brand-black-dark"
                    : "bg-white dark:bg-brand-pink-dark text-black dark:border-brand-black-dark border-brand-black-dark dark:text-brand-pink-light hover:text-brand-pink",
                )}
              >
                {item.label}
              </Link>
            </div>
          );
        })}
        <div className="relative mt-2 group">
          <div className="absolute inset-0 bg-brand-pink-light transform rotate-1 border-2 border-black shadow-[3px_3px_0px_#000]" />
          <div className="relative flex items-center bg-white dark:bg-[#1a1a1a] border-2 border-black transform -rotate-1">
            <Search
              className="ml-3 text-black dark:text-brand-pink-light group-focus-within:dark:text-brand-pink group-focus-within:text-brand-pink-dark"
              size={18}
            />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              className="w-full px-2 py-2 font-poppins uppercase text-xs text-var(--color-foreground) dark:text-var(--color-foreground) placeholder-brand-pink/60 placeholder:font-semibold dark:placeholder:text-brand-pink-light/20 bg-transparent outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
