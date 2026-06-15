"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { TFunction } from "i18next";
import { Sparkles, Clock, TrendingUp, TrendingDown, Star } from "lucide-react";

import type {
  CategoryRef,
  Product,
} from "@features/products/types/product.types";
import type { SubcategoryRow } from "@features/categories/types/category.types";
import { useCategories } from "@features/categories/hooks/useCategories";
import { pickLocale } from "@shared/utils/pickLocale";
import PageTitle from "@shared/components/ui/PageTitle";
import Y2KBadge from "@shared/components/ui/Y2KBadge";
import { Pill, PillY2K } from "@shared/components/ui/Pills";
import useFilterProducts from "../hooks/useFilterProducts";
import { ListingParams } from "../types/productsFindParams.type";
import ProductCardY2K from "./ProductCardY2K";
import ProductModal from "./modal/ProductModal";
import { useProductModal } from "../hooks/useProductModal";

function getTitle(
  params: ListingParams,
  categories: CategoryRef[] | undefined,
  language: string,
  t: TFunction,
): string {
  if (params.category) {
    const current = categories?.find((c) => c.slug === params.category);
    if (current) return pickLocale(current, language);
  }
  if (params.outlet === "true") return t("listing.titleOutlet");
  if (params.sale === "true") return t("listing.titleSale");
  return t("listing.title");
}

function pickSubLabel(sub: SubcategoryRow, lang: string): string {
  if (lang.startsWith("en") && sub.name_en) return sub.name_en;
  if (lang.startsWith("es") && sub.name_es) return sub.name_es;
  return sub.name_pt;
}

interface ProductsPageContentProps {
  products: Product[];
  params: ListingParams;
}

const SORT_OPTIONS = [
  { value: "", labelKey: "listing.sortFeatured", Icon: Sparkles },
  { value: "newest", labelKey: "listing.sortNewest", Icon: Clock },
  { value: "price-asc", labelKey: "listing.sortPriceAsc", Icon: TrendingUp },
  {
    value: "price-desc",
    labelKey: "listing.sortPriceDesc",
    Icon: TrendingDown,
  },
  { value: "rating", labelKey: "listing.sortRating", Icon: Star },
] as const;

export function ProductsPageContent({
  products,
  params,
}: ProductsPageContentProps) {
  const { t, i18n } = useTranslation("products");
  const router = useRouter();
  const { data: categories } = useCategories();
  const { buildUrl } = useFilterProducts();
  const { selectedProduct, isOpen } = useProductModal();

  function setFilter(updates: Partial<ListingParams>) {
    const next = { ...params, ...updates };
    router.push(buildUrl(next));
  }

  const title = useMemo(
    () => getTitle(params, categories, i18n.language, t),
    [params, categories, i18n.language, t],
  );

  const subcategories = useMemo<SubcategoryRow[]>(() => {
    if (!params.category) return [];
    const cat = categories?.find((c) => c.slug === params.category);
    return cat?.subcategories ?? [];
  }, [categories, params.category]);

  const hasFilters = subcategories.length > 0;

  return (
    <main
      className="min-h-screen w-full bg-brand-light-surface-0 py-12 pb-20 text-brand-black transition-colors dark:bg-brand-dark-surface-0 dark:text-brand-white"
      style={{
        backgroundImage: "url('/backgrounds/bg-grid.svg')",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-20">
        <div className="mb-8 flex w-full items-center justify-between">
          <PageTitle title={title} />
          {hasFilters && (
            <div className="flex flex-col items-center">
              <Y2KBadge text={"Coleção"} />
              <div className="z-3 flex gap-3 p-3">
                <PillY2K
                  active={!params.subcategory}
                  onClick={() => setFilter({ subcategory: undefined })}
                >
                  {t("listing.filterAll")}
                </PillY2K>
                {subcategories.map((sub) => (
                  <PillY2K
                    key={sub.id}
                    active={params.subcategory === sub.slug}
                    onClick={() => setFilter({ subcategory: sub.slug })}
                  >
                    {pickSubLabel(sub, i18n.language)}
                  </PillY2K>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-20 mb-4 flex flex-col gap-2">
          <div className="flex justify-center gap-2">
            {SORT_OPTIONS.map(({ value, labelKey, Icon }) => {
              const active = (params.sort ?? "") === value;
              return (
                <Pill
                  key={value}
                  active={active}
                  onClick={() => setFilter({ sort: value || undefined })}
                >
                  <Icon size={12} strokeWidth={2.5} />
                  {t(labelKey)}
                </Pill>
              );
            })}
          </div>
          <div className="flex justify-center">
            <p className="font-poppins text-sm text-brand-black/60 dark:text-brand-white/40">
              {t("listing.resultCount", { count: products.length })}
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="border-4 border-black bg-white p-16 text-center shadow-[6px_6px_0_#000] dark:border-brand-pink dark:bg-[#1a1a1a] dark:shadow-[6px_6px_0] dark:shadow-brand-pink">
            <p className="font-poppins mb-2 text-xl font-bold">
              {t("listing.noResults")}
            </p>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              {t("listing.noResultsDesc")}
            </p>
            <button
              onClick={() => router.push("/products")}
              className="font-poppins inline-block border-2 border-black px-6 py-3 text-sm font-bold tracking-wider text-black uppercase shadow-[4px_4px_0] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0] dark:border-brand-pink dark:text-white dark:shadow-brand-pink hover:dark:shadow-brand-pink"
            >
              {t("listing.filterAll")} →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,400px))] justify-center gap-6">
            {products.map((product, i) => (
              <ProductCardY2K key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
        {isOpen && selectedProduct && (
          <ProductModal />
        )}
      </div>
    </main>
  );
}
