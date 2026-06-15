"use client";
import { PackageCheck, RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ProductDelivery() {
  const { t } = useTranslation("products");

  return (
    <div className="border-4 border-brand-black dark:border-brand-pink-light shadow-[6px_6px_0] shadow-brand-pink dark:shadow-brand-blue overflow-hidden md:mt-4">
      <div className="bg-brand-black dark:bg-brand-pink-light px-4 py-2.5 flex items-center gap-2">
        <Truck size={14} className="text-brand-pink dark:text-brand-black" strokeWidth={2.5} />
        <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-white dark:text-brand-black">
          {t("page.delivery.sectionTitle")}
        </span>
      </div>
      <div className="bg-brand-light-surface-0 dark:bg-brand-dark-surface-1 divide-y-2 divide-brand-black dark:divide-brand-pink-light/30">
        <div className="flex items-start gap-4 px-5 py-4">
          <div className="mt-1 w-9 h-9 rounded-full bg-brand-light-surface-2 dark:bg-brand-dark-surface-2 border-2 border-brand-black dark:border-brand-blue flex items-center justify-center shrink-0">
            <PackageCheck size={16} className="text-brand-pink dark:text-brand-blue" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-brand-black dark:text-brand-white leading-tight">
              {t("page.delivery.daily.title")}
            </p>
            <p className="text-xs text-brand-black/60 dark:text-brand-white/60">{t("page.delivery.daily.desc")}</p>
          </div>
        </div>
        <div className="flex items-start gap-4 px-5 py-4">
          <div className="mt-1 w-9 h-9 rounded-full bg-brand-light-surface-2 dark:bg-brand-dark-surface-2 border-2 border-brand-black dark:border-brand-blue flex items-center justify-center shrink-0">
            <RefreshCcw size={16} className="text-brand-pink dark:text-brand-blue" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-brand-black dark:text-brand-white leading-tight">
              {t("page.delivery.exchange.title")}
            </p>
            <p className="text-xs text-brand-black/60 dark:text-brand-white/60">{t("page.delivery.exchange.desc")}</p>
          </div>
        </div>
        <div className="flex items-start gap-4 px-5 py-4">
          <div className="mt-1 w-9 h-9 rounded-full bg-brand-light-surface-2 dark:bg-brand-dark-surface-2 border-2 border-brand-black dark:border-brand-blue flex items-center justify-center shrink-0">
            <ShieldCheck size={16} className="text-brand-pink dark:text-brand-blue" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-brand-black dark:text-brand-white leading-tight">
              {t("page.delivery.uv.title")}
            </p>
            <p className="text-xs text-brand-black/60 dark:text-brand-white/60">{t("page.delivery.uv.desc")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
