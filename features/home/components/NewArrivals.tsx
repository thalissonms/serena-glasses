"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { Product } from "@features/products/types/product.types";
import Link from "next/link";
import StartsBackgroud from "@shared/components/layout/Backgrounds/StartsBackground";
import ProductCardY2K from "@features/products/components/ProductCardY2K";

export function NewArrivals({ products }: { products: Product[] }) {
  const { t } = useTranslation("home");

  return (
    <section className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 bg-brand-light-surface-0 dark:bg-brand-dark-surface-0">
      <StartsBackgroud>
        <div className="absolute md:-top-4 lg:-top-8 left-0 z-30 w-full h-2 md:h-4 lg:h-6 xl:h-8 bg-linear-to-t from-brand-light-surface-0 dark:from-brand-dark-surface-0 via-brand-light-surface-0/40 dark:via-brand-dark-surface-0/40 to-transparent" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-poppins text-base uppercase tracking-[0.3em] text-gray-500 dark:text-brand-pink-light font-semibold">
                {t("newArrivals.subtitle")}
              </p>

              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="w-8 h-0.5 pt-px bg-brand-pink" />
                <span className="text-brand-pink text-2xl sm:text-3xl">✦</span>
                <div className="w-8 h-0.5 pt-px bg-brand-pink" />
              </div>
            </motion.div>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.map((product, i) => (
              <ProductCardY2K key={product.id} product={product} index={i} />
            ))}
          </div>
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
      </StartsBackgroud>
    </section>
  );
}
