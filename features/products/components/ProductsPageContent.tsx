"use client";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import type { Product } from "@features/products/types/product.types";
import { ProductCard } from "./ProductCard";
import type { ListingParams } from "../utils/filterProducts";
import { useCategories } from "@features/categories/hooks/useCategories";
import { pickLocale } from "@shared/utils/pickLocale";

interface ProductsPageContentProps {
  products: Product[];
  params: ListingParams;
}

export function ProductsPageContent({ products, params }: ProductsPageContentProps) {
  const { t, i18n } = useTranslation("products");
  const router = useRouter();
  const { data: categories } = useCategories();

  function buildUrl(next: ListingParams): string {
    const sp = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => {
      if (v) sp.set(k, v);
    });
    const q = sp.toString();
    return `/products${q ? `?${q}` : ""}`;
  }

  function setFilter(updates: Partial<ListingParams>) {
    const next: ListingParams = { ...params };
    Object.assign(next, updates);
    Object.keys(updates).forEach((k) => {
      if (updates[k as keyof ListingParams] === undefined) delete next[k as keyof ListingParams];
    });
    router.push(buildUrl(next));
  }

  const isOutlet = params.outlet === "true";
  const isSale = params.sale === "true";
  const isNew = params.new === "true";

  function getTitle(): string {
    if (params.category) {
      const current = categories?.find((c) => c.slug === params.category);
      if (current) return pickLocale(current, i18n.language);
    }
    if (isOutlet) return t("listing.titleOutlet");
    if (isSale) return t("listing.titleSale");
    return t("listing.title");
  }

  const sortPills = [
    { value: "", label: t("listing.sortFeatured") },
    { value: "newest", label: t("listing.sortNewest") },
    { value: "price-asc", label: t("listing.sortPriceAsc") },
    { value: "price-desc", label: t("listing.sortPriceDesc") },
    { value: "rating", label: t("listing.sortRating") },
  ];

  return (
    <main className="w-full min-h-screen bg-brand-pink-light/40 dark:bg-brand-pink-bg-dark text-black dark:text-white py-12 px-4 sm:px-8 lg:px-20 transition-colors">
      <div className="max-w-7xl mx-auto mb-8">
        <span className="font-jocham text-5xl sm:text-6xl text-brand-pink leading-none block">
          {getTitle()}
        </span>
        <div className="flex items-center gap-2 mt-3 mb-1">
          <div className="w-8 h-0.5 bg-brand-pink-light dark:bg-brand-pink/50" />
          <span className="text-brand-pink-light dark:text-brand-pink/70 text-lg">✦</span>
          <div className="w-8 h-0.5 bg-brand-pink-light dark:bg-brand-pink/50" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-poppins text-sm mt-2">
          {t("listing.resultCount", { count: products.length })}
        </p>
      </div>

      <div className="max-w-7xl mx-auto mb-8 flex flex-wrap gap-2">
        {sortPills.map((opt) => {
          const active = (params.sort ?? "") === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setFilter({ sort: opt.value || undefined })}
              className={clsx(
                "font-poppins font-bold text-xs uppercase tracking-wider px-4 py-2 border-2 border-black dark:border-brand-pink transition-all cursor-pointer",
                active
                  ? "bg-brand-pink text-white shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#000] -translate-y-0.5"
                  : "bg-white dark:bg-[#1a1a1a] text-black dark:text-white hover:bg-brand-pink hover:text-white dark:hover:bg-brand-pink shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#FF00B6] hover:shadow-[3px_3px_0_#000] hover:-translate-y-0.5",
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto">
        {products.length === 0 ? (
          <div className="border-4 border-black dark:border-brand-pink shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#FF00B6] bg-white dark:bg-[#1a1a1a] p-16 text-center">
            <p className="font-poppins font-bold text-xl mb-2">{t("listing.noResults")}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{t("listing.noResultsDesc")}</p>
            <button
              onClick={() => router.push("/products")}
              className="inline-block font-poppins font-bold text-sm uppercase tracking-wider text-black dark:text-white border-2 border-black dark:border-brand-pink px-6 py-3 shadow-[4px_4px_0_#FF00B6] hover:shadow-[6px_6px_0_#FF00B6] hover:-translate-y-0.5 transition-all"
            >
              {t("listing.filterAll")} →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
