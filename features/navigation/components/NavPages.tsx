"use client";
import { Suspense } from "react";
import Link from "next/link";
import clsx from "clsx";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { isActive, isNavActive } from "../utils/isActive";
import { useNavPages } from "../hooks/useNavPages";

type Page = ReturnType<typeof useNavPages>[number];

export const NavPages = () => {
  const pages = useNavPages();
  return (
    <Suspense fallback={<NavPagesFallback pages={pages} />}>
      <NavPagesInner pages={pages} />
    </Suspense>
  );
};

function NavPagesFallback({ pages }: { pages: Page[] }) {
  const pathname = usePathname();
  const { t } = useTranslation("nav");
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

function NavPagesInner({ pages }: { pages: Page[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useTranslation("nav");
  return (
    <nav aria-label={t("mainNavigation")} className="hidden lg:block">
      <ul className="flex items-center gap-6">
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
    <li className="relative group list-none">
      <div
        className={clsx(
          "absolute inset-0 bg-brand-pink-light dark:bg-brand-pink-dark border-2 border-black transition-transform duration-300",
          "shadow-[3px_3px_0px_#000] rotate-1 dark:shadow-[3px_3px_0px] ",
          !active && "group-hover:rotate-2 group-hover:shadow-[5px_5px_0px_#000] dark:border-brand-pink-light dark:shadow-brand-pink-light",
          active && "rotate-2 shadow-[5px_5px_0px_#000] dark:shadow-brand-pink dark:border-brand-pink",
        )}
      />
      <Link 
        href={item.href}
        aria-current={active ? "page" : undefined}
        prefetch
        className={clsx(
          "relative font-black block px-4 py-2 font-inter uppercase text-sm tracking-wider border-2 border-black ",
          "transform -rotate-1 transition-transform duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-500",
          active ? "text-brand-pink rotate-0 dark:text-brand-pink dark:border-brand-pink" : "text-black dark:text-brand-pink-light dark:border-brand-pink-light  hover:text-brand-pink dark:hover:text-brand-pink-light group-hover:rotate-0",
        )}
      >
        {item.label}
      </Link>
    </li>
  );
}
