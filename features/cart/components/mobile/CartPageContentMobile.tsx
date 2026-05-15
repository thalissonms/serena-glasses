"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { formatPrice } from "@features/products/utils/formatPrice";
import { useSmartBack } from "@features/navigation/hooks/useBackIntercept";
import PageInterceptTransition from "@features/navigation/components/mobile/modals/PageInterceptTransition";
import { CartItem } from "../../types/cart.types";
import ModalNavHeader from "@features/navigation/components/mobile/modals/ModalNavHeader";

function CartModalContent({
  items,
  removeItem,
  changeQty,
}: {
  items: CartItem[];
  removeItem: (variantId: string) => void;
  changeQty: (variantId: string, delta: number) => void;
}) {
  const { t } = useTranslation("checkout");
  const handleBack = useSmartBack("/products");
  const router = useRouter();

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div
      className="min-h-screen text-black dark:text-white"
      role="dialog"
      aria-modal="true"
      aria-label={t("cart.title")}
    >
      <ModalNavHeader
        pageToBack={"/products"}
        display={t("cart.title")}
        buttons={{ labelBack: t("cart.back") }}
      />
      <div className="flex flex-col gap-3 p-3 pb-36">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <ShoppingBag
              size={48}
              strokeWidth={1.5}
              className="text-brand-pink/30"
              aria-hidden="true"
            />
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
          <ul
            className="flex flex-col gap-3 list-none p-0 m-0"
            aria-label={t("cart.title")}
          >
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.li
                  key={item.variantId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -24, transition: { duration: 0.18 } }}
                  className="grid grid-cols-[80px_1fr] gap-3 bg-white dark:bg-[#1a1a1a] border-2 border-black dark:border-brand-pink shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#FF00B6] p-3"
                >
                  <a href={`/products/${item.slug}`} className="flex items-center">
                    <div className="w-full relative aspect-square border-2 border-black dark:border-brand-pink/50 overflow-hidden bg-pink-50 dark:bg-[#0a0a0a]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-contain p-2"
                      />
                    </div>
                  </a>

                  <div className="flex flex-col justify-between gap-2">
                    <div className="flex items-start justify-between gap-1">
                      <div className="min-w-0">
                        <a href={`/products/${item.slug}`}>
                          <span className="font-poppins font-bold text-xl truncate hover:text-brand-pink transition-colors">
                            {item.name}
                          </span>
                        </a>
                        <div className="flex items-center gap-1">
                          <span
                            className="w-3.5 h-3.5 rounded-full "
                            style={{ backgroundColor: item.color.hex }}
                            aria-hidden="true"
                          />
                          <span className="text-[12px] text-gray-500 dark:text-gray-400 font-inter">
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
                        <Trash2 size={16} aria-hidden="true" />
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
                          <Minus size={12} aria-hidden="true" />
                        </button>
                        <span
                          className="px-3 py-1 font-poppins font-bold text-xs min-w-8 text-center"
                          aria-live="polite"
                        >
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => changeQty(item.variantId, 1)}
                          aria-label={t("cart.increaseQty")}
                          className="px-2 py-1 hover:bg-brand-pink hover:text-white transition-colors border-l border-black dark:border-brand-pink cursor-pointer"
                        >
                          <Plus size={12} aria-hidden="true" />
                        </button>
                      </div>
                      <div className="text-right">
                        {item.compareAtPrice && (
                          <p className="text-[10px] text-gray-400 font-inter line-through leading-none mb-0.5">
                            {formatPrice(item.compareAtPrice * item.quantity)}
                          </p>
                        )}
                        <span className="font-family-jocham text-xl text-brand-pink leading-none">
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
        <footer className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-brand-pink-bg-dark/40 backdrop-blur-lg border-t-2 border-black dark:border-brand-pink shadow-[-4px_-4px_6px] shadow-black/20 px-3 py-3 z-50">
          <div className="flex items-center justify-between mb-3">
            <span className="font-poppins text-xl text-gray-600 dark:text-gray-400 font-semibold">
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
  );
}

export default function CartModal({
  items,
  removeItem,
  changeQty,
}: {
  items: CartItem[];
  removeItem: (variantId: string) => void;
  changeQty: (variantId: string, delta: number) => void;
}) {
  return (
    <PageInterceptTransition>
      <CartModalContent
        items={items}
        removeItem={removeItem}
        changeQty={changeQty}
      />
    </PageInterceptTransition>
  );
}
