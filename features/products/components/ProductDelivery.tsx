"use client";
import { PackageCheck, RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ProductDelivery() {
  const { t } = useTranslation("products");

  return (
    <div className="border-4 border-black dark:border-brand-pink shadow-[6px_6px_0_#FF00B6] overflow-hidden mt-4">
      <div className="bg-black dark:bg-brand-pink px-4 py-2.5 flex items-center gap-2">
        <Truck size={14} className="text-brand-pink dark:text-black" strokeWidth={2.5} />
        <span className="text-xs font-black uppercase tracking-[0.2em] text-white dark:text-black">
          {t("page.delivery.sectionTitle")}
        </span>
      </div>
      <div className="bg-white dark:bg-[#1a1a1a] divide-y-2 divide-black dark:divide-brand-pink/30">
        <div className="flex items-start gap-4 px-5 py-4">
          <div className="mt-1 w-9 h-9 rounded-full bg-[#FFF0FA] dark:bg-[#0a0a0a] border-2 border-black dark:border-brand-pink flex items-center justify-center shrink-0">
            <PackageCheck size={16} className="text-brand-pink" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-black dark:text-white leading-tight">
              {t("page.delivery.daily.title")}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t("page.delivery.daily.desc")}</p>
          </div>
        </div>
        <div className="flex items-start gap-4 px-5 py-4">
          <div className="mt-1 w-9 h-9 rounded-full bg-[#FFF0FA] dark:bg-[#0a0a0a] border-2 border-black dark:border-brand-pink flex items-center justify-center shrink-0">
            <RefreshCcw size={16} className="text-brand-pink" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-black dark:text-white leading-tight">
              {t("page.delivery.exchange.title")}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t("page.delivery.exchange.desc")}</p>
          </div>
        </div>
        <div className="flex items-start gap-4 px-5 py-4">
          <div className="mt-1 w-9 h-9 rounded-full bg-[#FFF0FA] dark:bg-[#0a0a0a] border-2 border-black dark:border-brand-pink flex items-center justify-center shrink-0">
            <ShieldCheck size={16} className="text-brand-pink" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-black dark:text-white leading-tight">
              {t("page.delivery.uv.title")}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t("page.delivery.uv.desc")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
