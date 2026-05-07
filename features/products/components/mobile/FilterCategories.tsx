"use client";
import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Glasses,
  Sparkles,
  Gem,
  Tag,
  Percent,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNavPages } from "@features/navigation/hooks/useNavPages";
import { isNavActive } from "@features/navigation/utils/isActive";
import { CategoryChip } from "@features/navigation/components";

type Page = ReturnType<typeof useNavPages>[number];

function getIconForHref(href: string): LucideIcon {
  if (href.includes("category=sunglasses")) return Glasses;
  if (href.includes("category=miniDrop")) return Sparkles;
  if (href.includes("category=accessories")) return Gem;
  if (href.includes("outlet=true")) return Tag;
  if (href.includes("sale=true")) return Percent;
  return Glasses;
}

function FilterChips({ pages }: { pages: Page[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filtered = pages.filter((p) => p.href !== "/");
  const anyActive = filtered.some((p) => isNavActive(pathname, searchParams, p.href));

  return (
    <div className="flex flex-row gap-3 overflow-x-auto px-4 py-3 scrollbar-hide">
      <CategoryChip
        item={{ href: "/products", label: "Todos" }}
        active={!anyActive}
        allChip
      />
      {filtered.map((item) => (
        <CategoryChip
          key={item.href}
          item={item}
          icon={getIconForHref(item.href)}
          active={isNavActive(pathname, searchParams, item.href)}
        />
      ))}
    </div>
  );
}

function FilterChipsFallback({ pages }: { pages: Page[] }) {
  const pathname = usePathname();
  const filtered = pages.filter((p) => p.href !== "/");
  const anyActive = filtered.some((p) => pathname === p.href.split("?")[0] && p.href.includes("?"));

  return (
    <div className="flex flex-row gap-3 overflow-x-auto px-4 py-3 scrollbar-hide">
      <CategoryChip
        item={{ href: "/products", label: "Todos" }}
        active={!anyActive}
        allChip
      />
      {filtered.map((item) => (
        <CategoryChip
          key={item.href}
          item={item}
          icon={getIconForHref(item.href)}
          active={pathname === item.href.split("?")[0]}
        />
      ))}
    </div>
  );
}

const FilterProducts = () => {
  const pages = useNavPages();

  return (
    <nav className="mt-16">
      <Suspense fallback={<FilterChipsFallback pages={pages} />}>
        <FilterChips pages={pages} />
      </Suspense>
    </nav>
  );
};

export default FilterProducts;