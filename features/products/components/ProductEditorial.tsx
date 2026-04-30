"use client";
import { useTranslation } from "react-i18next";
import type { Product } from "@features/products/types/product.types";

interface ProductEditorialProps {
  product: Pick<Product, "name" | "description" | "uvProtection" | "weight" | "variants">;
}

export default function ProductEditorial({ product }: ProductEditorialProps) {
  const { t } = useTranslation("products");

  const uniqueColorCount = new Set(product.variants.map((v) => v.color.slug)).size;

  const stats = [
    { num: product.uvProtection ? "UV400" : "–", sub: t("description.stats.protectionLabel") },
    { num: `${uniqueColorCount}`, sub: t("description.stats.colorsLabel") },
    { num: product.weight ? `${product.weight}g` : "–", sub: t("description.stats.weightLabel") },
    { num: "7d", sub: t("description.stats.exchangeLabel") },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div className="relative">
        <span
          className="absolute -top-8 -left-4 text-[9rem] font-black text-brand-pink opacity-10 leading-none select-none"
          aria-hidden
        ></span>
        <span
          className="font-poppins font-black text-4xl md:text-5xl uppercase leading-[1.05] text-black dark:text-white"
          style={{ textShadow: "4px 3px 0 #FF00B6" }}
        >
          {product.name}
        </span>
        <p className="mt-6 text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-md">
          {product.description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((s) => (
          <div
            key={s.num + s.sub}
            className="border-4 border-black dark:border-brand-pink bg-white dark:bg-[#1a1a1a] shadow-[5px_5px_0_#FF00B6] p-5 flex flex-col gap-1"
          >
            <span className="font-poppins font-black text-3xl text-brand-pink leading-none">
              {s.num}
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
              {s.sub}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
