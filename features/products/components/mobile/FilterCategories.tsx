"use client";
import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  Glasses,
  Sparkles,
  Stars,
  Gem,
  Tag,
  Percent,
  Heart,
  ShoppingBag,
  Search,
  Eye,
  Sun,
  Moon,
  CloudSun,
  Aperture,
  Focus,
  Disc3,
  Music,
  Headphones,
  Camera,
  Wand2,
  Flame,
  Zap,
  Award,
  Crown,
  Gift,
  Package,
  Boxes,
  Layers,
  Palette,
  Flower2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { isNavActive } from "@features/navigation/utils/isActive";
import { CategoryChip } from "@features/navigation/components";
import { useCategories } from "@features/categories/hooks/useCategories";
import type { CategoryWithSubs } from "@features/categories/types/category.types";

const ICON_MAP: Record<string, LucideIcon> = {
  Glasses, Sparkles, Stars, Gem, Tag, Percent, Heart, ShoppingBag, Search, Eye,
  Sun, Moon, CloudSun, Aperture, Focus, Disc3, Music, Headphones, Camera, Wand2,
  Flame, Zap, Award, Crown, Gift, Package, Boxes, Layers, Palette, Flower2,
};

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
        item={{ href: "/products", label: "Todos" }}
        active={!anyActive}
        allChip
      />
      {categories.map((c) => {
        const page = categoryToPage(c, lang);
        const Icon = ICON_MAP[c.icon_name] ?? Glasses;
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
        const Icon = ICON_MAP[c.icon_name] ?? Glasses;
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
    <nav className="mt-16">
      <Suspense fallback={<FilterChipsFallback categories={categories} lang={i18n.language} />}>
        <FilterChips categories={categories} lang={i18n.language} />
      </Suspense>
    </nav>
  );
};

export default FilterProducts;
