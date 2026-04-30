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

      <div className="border-4 border-black dark:border-brand-pink shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#FF00B6] overflow-hidden">
        {specs.map((spec, i) => {
          const Icon = spec.icon;
          return (
            <div
              key={spec.labelKey}
              className={`flex items-center gap-5 px-6 py-4 ${
                i % 2 === 0 ? "bg-white dark:bg-[#1a1a1a]" : "bg-pink-50 dark:bg-[#0a0a0a]"
              } ${i !== specs.length - 1 ? "border-b-2 border-black dark:border-brand-pink/30" : ""}`}
            >
              <div className="w-9 h-9 rounded-full bg-brand-pink border-2 border-black dark:border-white flex items-center justify-center shrink-0">
                <Icon size={15} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 w-40 shrink-0">
                {t(spec.labelKey)}
              </span>
              <span className="text-sm font-bold text-black dark:text-white">{spec.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
