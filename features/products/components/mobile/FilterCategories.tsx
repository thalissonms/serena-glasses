"use client";
import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { isNavActive } from "@features/navigation/utils/isActive";
import { CategoryChip } from "@features/navigation/components";
import { useCategories } from "@features/categories/hooks/useCategories";
import type { CategoryWithSubs } from "@features/categories/types/category.types";
import { pickLocale } from "@shared/utils/pickLocale";
import { getCategoryIcon } from "@features/products/utils/getCategoryIcon";

type Page = { href: string; label: string };

function categoryToPage(c: CategoryWithSubs, lang: string): Page {
  const href =
    c.kind === "flag" && c.href_override
      ? c.href_override
      : `/products?category=${c.slug}`;
  return { href, label: pickLocale(c, lang) };
}

function FilterChips({
  categories,
  lang,
}: {
  categories: CategoryWithSubs[];
  lang: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const anyActive = categories.some((c) =>
    isNavActive(pathname, searchParams, categoryToPage(c, lang).href),
  );

  return (
    <div className="flex flex-row gap-3 overflow-x-auto px-4 py-3 scrollbar-hide">
      <CategoryChip
        item={{ label: "Home", href: "/" }}
        allChip
        active={!anyActive}
      />
      {categories.map((c) => {
        const page = categoryToPage(c, lang);
        const Icon = getCategoryIcon(c.icon_name);
        return (
          <CategoryChip
            key={c.id}
            item={page}
            icon={Icon}
            active={isNavActive(pathname, searchParams, page.href)}
          />
        );
      })}
    </div>
  );
}

function FilterChipsFallback({
  categories,
  lang,
}: {
  categories: CategoryWithSubs[];
  lang: string;
}) {
  const pathname = usePathname();
  const anyActive = categories.some((c) => {
    const href = categoryToPage(c, lang).href;
    return pathname === href.split("?")[0] && href.includes("?");
  });

  return (
    <div className="flex flex-row gap-3 overflow-x-auto px-4 py-3 scrollbar-hide">
      <CategoryChip
        item={{ href: "/products", label: "Todos" }}
        active={!anyActive}
        allChip
      />
      {categories.map((c) => {
        const page = categoryToPage(c, lang);
        const Icon = getCategoryIcon(c.icon_name);
        return (
          <CategoryChip
            key={c.id}
            item={page}
            icon={Icon}
            active={pathname === page.href.split("?")[0]}
          />
        );
      })}
    </div>
  );
}

const FilterProducts = () => {
  const { i18n } = useTranslation("nav");
  const { data: categories = [] } = useCategories();

  return (
    <nav className="">
      <Suspense
        fallback={
          <FilterChipsFallback categories={categories} lang={i18n.language} />
        }
      >
        <FilterChips categories={categories} lang={i18n.language} />
      </Suspense>
    </nav>
  );
};

export default FilterProducts;
