"use client";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface SpecItem {
  icon: LucideIcon;
  labelKey: string;
  value: string;
}

interface ProductSpecsProps {
  specs: SpecItem[];
}

export default function ProductSpecs({ specs }: ProductSpecsProps) {
  const { t } = useTranslation("products");

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-3 h-8 bg-brand-pink" />
        <h3 className="font-poppins font-black text-2xl uppercase tracking-wide">
          {t("description.specs.title")}
        </h3>
      </div>

      <div className="border-4 border-brand-black dark:border-brand-pink shadow-[6px_6px_0_var(--brand-black)] dark:shadow-[6px_6px_0_var(--brand-pink)] overflow-hidden">
        {specs.map((spec, i) => {
          const Icon = spec.icon;
          return (
            <div
              key={spec.labelKey}
              className={`flex items-center gap-3 md:gap-5 px-3 py-3 md:px-6 md:py-4 ${
                i % 2 === 0 ? "bg-brand-light-surface-0 dark:bg-brand-dark-surface-1" : "bg-brand-light-surface-2 dark:bg-brand-dark-surface-2"
              } ${i !== specs.length - 1 ? "border-b-2 border-brand-black dark:border-brand-pink/30" : ""}`}
            >
              <div className="w-9 h-9 rounded-full bg-brand-pink border-2 border-brand-black dark:border-brand-white flex items-center justify-center shrink-0">
                <Icon size={15} className="text-brand-white" strokeWidth={2.5} />
              </div>
              <span className="text-xs md:text-sm font-black uppercase tracking-wider text-brand-black/50 dark:text-brand-white/60 w-24 md:w-40 shrink-0">
                {t(spec.labelKey)}
              </span>
              <span className="text-sm font-bold text-brand-black dark:text-brand-white">{spec.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
