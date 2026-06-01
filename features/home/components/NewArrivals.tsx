"use client";

import { m } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { Product } from "@features/products/types/product.types";
import StartsBackgroud from "@shared/components/layout/Backgrounds/StartsBackground";
import ProductCardY2K from "@features/products/components/ProductCardY2K";
import { useProductModal } from "@features/products/hooks/useProductModal";
import ProductModal from "@features/products/components/modal/ProductModal";

export function NewArrivals({ products }: { products: Product[] }) {
  const { t } = useTranslation("home");
  const { isOpen, selectedProduct } = useProductModal();

  return (
    <section
      className="relative py-16 sm:py-20 md:py-24 "
      style={{
        backgroundImage: "url('/backgrounds/bg-grid-lighter.svg')",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <StartsBackgroud>
        <div className="absolute left-0 z-30 h-2 w-full bg-linear-to-t from-brand-light-surface-0 via-brand-light-surface-0/40 to-transparent md:-top-4 md:h-4 lg:-top-8 lg:h-6 xl:h-8 dark:from-brand-dark-surface-0 dark:via-brand-dark-surface-0/40" />
        <div className="mx-auto px-4 sm:px-8 lg:px-20">
          <div className="mb-10 text-center sm:mb-14">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-poppins text-base font-semibold tracking-[0.3em] text-gray-500 uppercase dark:text-brand-pink-light">
                {t("newArrivals.subtitle")}
              </p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <div className="h-0.5 w-8 bg-brand-pink pt-px" />
                <span className="text-2xl text-brand-pink sm:text-3xl">✦</span>
                <div className="h-0.5 w-8 bg-brand-pink pt-px" />
              </div>
            </m.div>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,400px))] justify-center gap-6">
            {products.map((product, i) => (
              <ProductCardY2K key={product.id} product={product} index={i} />
            ))}
          </div>
          {isOpen && selectedProduct && (
            <ProductModal />
          )}

        </div>
      </StartsBackgroud>
    </section>
  );
}
