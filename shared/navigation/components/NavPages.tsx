"use client";
import { Suspense } from "react";
import Link from "next/link";
import clsx from "clsx";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { isActive, isNavActive } from "../utils/isActive";
import { useCategories } from "@features/categories/hooks/useCategories";
import type { CategoryWithSubs } from "@features/categories/types/category.types";
import { pickLocale } from "@shared/utils/pickLocale";

function categoryToPage(
  c: CategoryWithSubs,
  lang: string,
): { href: string; label: string } {
  const href =
    c.kind === "flag" && c.href_override
      ? c.href_override
      : `/products?category=${c.slug}`;
  return { href, label: pickLocale(c, lang) };
}

type Page = { href: string; label: string };

export const NavPages = ({
  categories,
}: {
  categories: CategoryWithSubs[];
}) => {
  const { i18n, t } = useTranslation("nav");
  const pages: Page[] = (categories ?? []).map((c) =>
    categoryToPage(c, i18n.language),
  );

  return (
    <Suspense fallback={<NavPagesFallback pages={pages} t={t} />}>
      <NavPagesInner pages={pages} t={t} />
    </Suspense>
  );
};

function NavPagesFallback({
  pages,
  t,
}: {
  pages: Page[];
  t: (k: string) => string;
}) {
  const pathname = usePathname();
  return (
    <nav aria-label={t("mainNavigation")} className="hidden lg:block">
      <ul className="flex items-center gap-6">
        {pages.map((item) => {
          const active = isActive(pathname, item.href.split("?")[0]);
          return <NavItem key={item.href} item={item} active={active} />;
        })}
      </ul>
    </nav>
  );
}

function NavPagesInner({
  pages,
  t,
}: {
  pages: Page[];
  t: (k: string) => string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (
    <nav aria-label={t("mainNavigation")} className="hidden lg:block">
      <ul className="flex items-center gap-6">
        <NavItem
          key="/"
          item={{ href: "/", label: t("home") }}
          active={isActive(pathname, "/")}
        />
        {pages.map((item) => {
          const active = isNavActive(pathname, searchParams, item.href);
          return <NavItem key={item.href} item={item} active={active} />;
        })}
      </ul>
    </nav>
  );
}

function NavItem({ item, active }: { item: Page; active: boolean }) {
  return (
    <li
      className={clsx(
        "relative group list-none rounded-sm",
        active
          ? "bg-brand-light-surface-2/90 dark:bg-brand-dark-surface-1"
          : "bg-brand-light-surface-2 dark:bg-brand-dark-surface-1/80",
      )}
    >
      <div
        className={clsx(
          "w-full h-6 absolute bottom-0 left-0 pointer-events-none",
          "bg-linear-0 from-brand-black/20 via-brand-black/10 dark:from-brand-black/50 dark:via-brand-black/25 to-transparent",
        )}
      />

      <div
        className={clsx(
          "absolute inset-0 border-2 transition-all duration-300",
          "border-brand-black dark:border-brand-dark-surface-0",
          "shadow-brand-black dark:shadow-brand-dark-surface-0",
          active
            ? "rotate-2 shadow-[5px_5px_0px]"
            : "rotate-1 shadow-[3px_3px_0px] group-hover:rotate-2 group-hover:shadow-[5px_5px_0px]",
        )}
      />

      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        prefetch
        className={clsx(
          "relative font-black block px-4 py-2 font-inter uppercase text-sm tracking-wider",
          "border-2 border-brand-black truncate transition-all duration-300",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-500",
          active
            ? "-rotate-1 text-brand-pink dark:text-brand-pink dark:border-brand-pink"
            : [
                "-rotate-1 group-hover:rotate-0",
                "text-brand-black dark:text-brand-pink-light dark:border-brand-pink-light",
                "group-hover:text-brand-pink dark:group-hover:text-brand-pink-light",
                "text-shadow-[1px_1px_0px] text-shadow-brand-black/20 dark:text-shadow-brand-white/10",
              ],
        )}
      >
        {item.label}
      </Link>
    </li>
  );
}