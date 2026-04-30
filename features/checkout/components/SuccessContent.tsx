"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SuccessContentProps {
  orderNumber?: string;
}

export function SuccessContent({ orderNumber }: SuccessContentProps) {
  const { t } = useTranslation("checkout");

  return (
    <main className="w-full min-h-screen bg-[#FFF0FA] dark:bg-[#0a0a0a] text-black dark:text-white flex items-center justify-center py-20 px-4 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-lg"
      >
        <div className="bg-white dark:bg-[#1a1a1a] border-4 border-black dark:border-brand-pink shadow-[8px_8px_0_#FF00B6] p-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 12 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-brand-pink rounded-full transform rotate-3 scale-110 opacity-20" />
              <CheckCircle size={72} strokeWidth={1.5} className="text-brand-pink relative" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <span className="font-jocham text-5xl text-brand-pink leading-none block mb-2">
              {t("success.title")}
            </span>
            <p className="font-poppins font-semibold text-gray-600 dark:text-gray-400 text-sm uppercase tracking-widest mb-6">
              {t("success.subtitle")}
            </p>

            <div className="flex items-center gap-2 justify-center mb-6">
              <div className="w-12 h-0.5 bg-brand-pink-light dark:bg-brand-pink/50" />
              <span className="text-brand-pink-light dark:text-brand-pink/70 text-lg">✦</span>
              <div className="w-12 h-0.5 bg-brand-pink-light dark:bg-brand-pink/50" />
            </div>

            {orderNumber && (
              <div className="bg-[#FFF0FA] dark:bg-[#0a0a0a] border-2 border-black dark:border-brand-pink shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#FF00B6] px-6 py-4 mb-6 inline-block">
                <p className="font-poppins text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1">
                  {t("success.orderLabel")}
                </p>
                <p className="font-poppins font-black text-lg tracking-wider text-black dark:text-white">
                  #{orderNumber}
                </p>
              </div>
            )}

            <p className="font-inter text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
              {t("success.message")}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-6 py-4 font-poppins text-sm font-black uppercase tracking-widest border-4 border-black dark:border-brand-pink bg-brand-pink text-white shadow-[6px_6px_0_#000] hover:translate-y-0.5 hover:shadow-[4px_4px_0_#000] transition-all"
              >
                <ShoppingBag size={14} />
                {t("success.continueShopping")}
              </Link>
              {orderNumber && (
                <Link
                  href={`/order/track?order=${orderNumber}`}
                  className="flex items-center justify-center gap-2 px-6 py-4 font-poppins text-sm font-black uppercase tracking-widest border-4 border-black dark:border-brand-pink bg-white dark:bg-[#1a1a1a] text-black dark:text-white shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#FF00B6] hover:translate-y-0.5 hover:shadow-[4px_4px_0_#000] transition-all"
                >
                  {t("success.trackOrder")}
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
