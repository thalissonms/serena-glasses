"use client";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatPrice } from "@features/products/utils/formatPrice";
import CheckoutHeader from "@features/checkout/components/CheckoutHeader";
import OrderSummarySidebar from "@features/checkout/components/OrderSummarySidebar";
import { useCartStore } from "@features/cart/store/cart.store";

const bagSvg = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fce7f3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-handbag-icon lucide-handbag"><path d="M2.048 18.566A2 2 0 0 0 4 21h16a2 2 0 0 0 1.952-2.434l-2-9A2 2 0 0 0 18 8H6a2 2 0 0 0-1.952 1.566z"/><path d="M8 11V6a4 4 0 0 1 8 0v5"/></svg>`,
);

const bgPattern = `url("data:image/svg+xml,${bagSvg}")`;

export default function CartPage() {
  const { t } = useTranslation("checkout");
  const { items, removeItem, updateQuantity } = useCartStore();

  function changeQty(variantId: string, delta: number) {
    const item = items.find((i) => i.variantId === variantId);
    if (item) updateQuantity(variantId, item.quantity + delta);
  }

  return (
    <main
      className="w-full min-h-screen bg-[#FFF0FA] dark:bg-[#0a0a0a] text-black dark:text-white py-12 px-4 sm:px-8 lg:px-20 transition-colors"
      style={{
        backgroundImage: bgPattern,
        backgroundSize: "60px 50px",
        backgroundRepeat: "repeat",
      }}
    >
      <CheckoutHeader itemsAmount={items.length} />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
        <div className="flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="border-4 border-black dark:border-brand-pink shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#FF00B6] bg-white dark:bg-[#1a1a1a] p-16 text-center">
              <ShoppingBag
                size={40}
                strokeWidth={1.5}
                className="mx-auto mb-4 text-gray-300 dark:text-gray-600"
              />
              <p className="font-poppins font-bold text-xl mb-1">
                {t("cart.emptyTitle")}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
                {t("cart.emptyDesc")}
              </p>
              <Link
                href="/"
                className="inline-block font-poppins font-bold text-sm uppercase tracking-wider text-black dark:text-white border-2 border-black dark:border-brand-pink px-6 py-3 shadow-[4px_4px_0_#FF00B6] hover:shadow-[6px_6px_0_#FF00B6] hover:-translate-y-0.5 transition-all duration-300"
              >
                {t("cart.viewProducts")} →
              </Link>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {items.map((item, i) => (
                <motion.div
                  key={item.variantId}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -24, transition: { duration: 0.2 } }}
                  transition={{ delay: i * 0.05 }}
                  className="grid grid-cols-[88px_1fr] sm:grid-cols-[110px_1fr] gap-4 bg-white dark:bg-[#1a1a1a] border-2 border-black dark:border-brand-pink shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#FF00B6] p-4"
                >
                  <Link href={`/products/${item.slug}`}>
                    <div className="relative aspect-square border-2 border-black dark:border-brand-pink/50 overflow-hidden bg-pink-50 dark:bg-[#0a0a0a]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  </Link>

                  <div className="flex flex-col justify-between gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link href={`/products/${item.slug}`}>
                          <h3 className="font-poppins font-bold text-sm sm:text-base hover:text-brand-pink transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div
                            className="w-3 h-3 rounded-full border border-black/20 dark:border-white/20 shrink-0"
                            style={{ backgroundColor: item.color.hex }}
                          />
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-inter">
                            {item.color.name}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        aria-label={t("cart.removeItem")}
                        className="p-1.5 border border-black dark:border-brand-pink hover:bg-brand-pink hover:text-white hover:border-brand-pink transition-colors shrink-0 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center border-2 border-black dark:border-brand-pink">
                        <button
                          onClick={() => changeQty(item.variantId, -1)}
                          className="px-3 py-1.5 hover:bg-brand-pink hover:text-white transition-colors border-r border-black dark:border-brand-pink cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-4 py-1.5 font-poppins font-bold text-sm min-w-10 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => changeQty(item.variantId, 1)}
                          className="px-3 py-1.5 hover:bg-brand-pink hover:text-white transition-colors border-l border-black dark:border-brand-pink cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="text-right">
                        {item.compareAtPrice && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 font-inter line-through leading-none mb-0.5">
                            {formatPrice(item.compareAtPrice * item.quantity)}
                          </p>
                        )}
                        <span className="font-yellowtail text-2xl text-brand-pink leading-none">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <div className="flex flex-col gap-4 sticky top-6">
          <OrderSummarySidebar />
        </div>
      </div>
    </main>
  );
}
