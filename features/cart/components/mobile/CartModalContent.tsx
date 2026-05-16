"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useCartStore } from "@features/cart/store/cart.store";
import { formatPrice } from "@features/products/utils/formatPrice";
import { useSmartBack } from "@features/navigation/hooks/useBackIntercept";
import PageInterceptTransition from "@features/navigation/components/mobile/modals/PageInterceptTransition";

export default function CartModalContent() {
  const { t } = useTranslation("checkout");
  const handleBack = useSmartBack("/products");
  const router = useRouter();
  const { items, removeItem, updateQuantity } = useCartStore();

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  function changeQty(variantId: string, delta: number) {
    const item = items.find((i) => i.variantId === variantId);
    if (item) updateQuantity(variantId, item.quantity + delta);
  }

  return (
    <PageInterceptTransition>
      <div
        className="min-h-screen bg-[#FFF0FA] dark:bg-[#0a0a0a] text-black dark:text-white"
        role="dialog"
        aria-modal="true"
        aria-label={t("cart.title")}
      >
        <header className="w-full h-16 flex items-center bg-brand-pink/25 backdrop-blur-3xl sticky top-0 py-2 px-0.5 border-b-2 border-brand-pink/40 border-dashed z-50">
          <button
            type="button"
            className="p-2 cursor-pointer"
            onClick={handleBack}
            aria-label={t("cart.back")}
          >
            <ArrowLeft className="w-6.5 h-6.5 text-white" strokeWidth={2.5} aria-hidden="true" />
          </button>
          <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className="text-white text-center text-shadow-[2px_2px_0px] text-shadow-brand-black text-[28px] font-family-jocham font-light tracking-wide">
              {t("cart.title")}
            </h1>
          </div>
          <div className="w-12 flex items-center justify-center">
            {items.length > 0 && (
              <span
                className="w-6 h-6 rounded-full bg-brand-pink text-white text-xs font-black flex items-center justify-center border-2 border-white/40"
                aria-label={`${items.length} ${items.length === 1 ? t("header.item") : t("header.itemsPlural")}`}
              >
                {items.length}
              </span>
            )}
          </div>
        </header>

        <div className="flex flex-col gap-3 p-3 pb-36">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <ShoppingBag size={48} strokeWidth={1.5} className="text-brand-pink/30" aria-hidden="true" />
              <p className="font-poppins font-bold text-lg dark:text-white">
                {t("cart.emptyTitle")}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {t("cart.emptyDesc")}
              </p>
              <button
                type="button"
                onClick={handleBack}
                className="mt-2 font-poppins font-bold text-sm uppercase tracking-wider text-white bg-brand-pink border-2 border-black px-6 py-3 shadow-[4px_4px_0_#000] cursor-pointer"
              >
                {t("cart.viewProducts")}
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-3 list-none p-0 m-0" aria-label={t("cart.title")}>
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.li
                    key={item.variantId}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -24, transition: { duration: 0.18 } }}
                    className="grid grid-cols-[80px_1fr] gap-3 bg-white dark:bg-[#1a1a1a] border-2 border-black dark:border-brand-pink shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#FF00B6] p-3"
                  >
                    <a href={`/products/${item.slug}`}>
                      <div className="relative aspect-square border-2 border-black dark:border-brand-pink/50 overflow-hidden bg-pink-50 dark:bg-[#0a0a0a]">
                        <Image src={item.image} alt={item.name} fill sizes="80px" className="object-contain p-2" />
                      </div>
                    </a>

                    <div className="flex flex-col justify-between gap-2">
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0">
                          <a href={`/products/${item.slug}`}>
                            <p className="font-poppins font-bold text-sm truncate hover:text-brand-pink transition-colors">
                              {item.name}
                            </p>
                          </a>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                              style={{ backgroundColor: item.color.hex }}
                              aria-hidden="true"
                            />
                            <span className="text-[11px] text-gray-500 dark:text-gray-400 font-inter">
                              {item.color.name}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.variantId)}
                          aria-label={t("cart.removeItem")}
                          className="p-1 border border-black dark:border-brand-pink hover:bg-brand-pink hover:text-white transition-colors shrink-0 cursor-pointer"
                        >
                          <Trash2 size={12} aria-hidden="true" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div
                          className="flex items-center border-2 border-black dark:border-brand-pink"
                          role="group"
                          aria-label={item.name}
                        >
                          <button
                            type="button"
                            onClick={() => changeQty(item.variantId, -1)}
                            aria-label={t("cart.decreaseQty")}
                            className="px-2 py-1 hover:bg-brand-pink hover:text-white transition-colors border-r border-black dark:border-brand-pink cursor-pointer"
                          >
                            <Minus size={10} aria-hidden="true" />
                          </button>
                          <span className="px-3 py-1 font-poppins font-bold text-xs min-w-8 text-center" aria-live="polite">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => changeQty(item.variantId, 1)}
                            aria-label={t("cart.increaseQty")}
                            className="px-2 py-1 hover:bg-brand-pink hover:text-white transition-colors border-l border-black dark:border-brand-pink cursor-pointer"
                          >
                            <Plus size={10} aria-hidden="true" />
                          </button>
                        </div>
                        <div className="text-right">
                          {item.compareAtPrice && (
                            <p className="text-[10px] text-gray-400 font-inter line-through leading-none mb-0.5">
                              {formatPrice(item.compareAtPrice * item.quantity)}
                            </p>
                          )}
                          <span className="font-yellowtail text-xl text-brand-pink leading-none">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#0a0a0a]/90 backdrop-blur-lg border-t-2 border-black dark:border-brand-pink shadow-[-4px_-4px_6px] shadow-black/20 px-3 py-3 z-50">
            <div className="flex items-center justify-between mb-3">
              <span className="font-poppins text-sm text-gray-600 dark:text-gray-400">
                {t("cart.total")}
              </span>
              <span className="font-jocham text-2xl text-brand-pink leading-none">
                {formatPrice(subtotal)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => router.push("/checkout")}
              className="w-full flex items-center justify-center gap-2 py-3.5 font-poppins text-sm font-black uppercase tracking-widest border-2 border-black dark:border-brand-pink bg-brand-pink text-white shadow-[4px_4px_0_#000] active:shadow-[2px_2px_0_#000] active:translate-y-0.5 transition-all cursor-pointer"
            >
              {t("cart.checkout")} <ArrowRight size={16} aria-hidden="true" />
            </button>
          </footer>
        )}
      </div>
    </PageInterceptTransition>
  );
}
