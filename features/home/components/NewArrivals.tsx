"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { Product } from "@features/products/types/product.types";
import { ProductCard } from "@features/products/components/ProductCard";
import Link from "next/link";

export function NewArrivals({ products }: { products: Product[] }) {
  const { t } = useTranslation("home");

  return (
    <section className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section header — Y2K style */}
        <div className="text-center mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Decorative stars */}
            {/* <span className="text-brand-pink text-2xl sm:text-3xl">✦</span> */}
{/* 
            <h1 className="font-yellowtail font-light text-[4rem] text-brand-pink mt-2 mb-10 -rotate-8 tracking-wide absolute left-[15%] transform -translate-x-1/2">
              {t("newArrivals.title")}
            </h1> */}

            <p className="font-poppins text-xs sm:text-sm uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400 font-semibold">
              {t("newArrivals.subtitle")}
            </p>

            {/* Y2K decorative line */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-8 h-0.5 pt-px bg-brand-pink" />
              {/* <div className="w-2 h-2 bg-brand-pink rotate-45" /> */}
              <span className="text-brand-pink text-2xl sm:text-3xl">✦</span>
              <div className="w-8 h-0.5 pt-px bg-brand-pink" />
            </div>
          </motion.div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* "Ver todos" link — Y2K style */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-10 sm:mt-14"
        >
          <Link
            href="/products"
            className="inline-block font-poppins font-bold text-sm uppercase tracking-wider text-black dark:text-white dark:hover:text-brand-pink-light dark:bg-brand-pink-dark border-2 border-black dark:border-brand-pink-light px-6 py-3 shadow-[4px_4px_0px_#FF00B6] hover:shadow-[6px_6px_0px_#FF00B6] hover:-translate-y-0.5 transition-all duration-300"
          >
            {t("newArrivals.viewAll")} →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
