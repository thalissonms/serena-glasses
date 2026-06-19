"use client";

import { useTranslation } from "react-i18next";
import { Product } from "../types";
import clsx from "clsx";
import Y2KBadge from "@/shared/components/ui/Y2KBadge";

export default function ProductColorSelect({
  product,
  selectedColor,
  onColorChange,
}: {
  product: Product;
  selectedColor: number;
  onColorChange: (index: number) => void;
}) {
  const { t } = useTranslation("products");

  const uniqueColors = product.variants.filter(
    (v, i, arr) => arr.findIndex((x) => x.color.slug === v.color.slug) === i,
  );

  const activeColor = uniqueColors[selectedColor] ?? uniqueColors[0];
  return (
    <div className="-mt-3 md:mt-3">
      <p className="text-sm font-semibold text-brand-black/60 dark:text-brand-blue hidden md:block md:mb-3">
        {t("page.colorLabel")}{" "}
        <span className="text-brand-black dark:text-brand-white font-bold">
          {activeColor?.color.name}{" "}
        </span>
      </p>
      <div className="flex flex-col gap-1">

        <Y2KBadge text={t("page.colorLabel").slice(0, -1)} size={"mobile"} />
        <div className="flex relative gap-2 md:gap-3">
          {uniqueColors.map(
            (variant, i) =>
              variant.inStock && (
                <div key={variant.color.slug} className="relative">
                  <button
                    onClick={() => onColorChange(i)}
                    title={variant.color.name}
                    style={{ backgroundColor: variant.color.hex }}
                    className={clsx(
                      "w-7 h-7 md:w-6 md:h-6 md:rounded-full relative transition-all rounded-md",
                      variant.color.hex === "#FFFFFF" && "border border-brand-black/20",
                      selectedColor === i
                        ? "border-2 border-brand-yellow shadow-[2px_2px_0] shadow-brand-black scale-110"
                        : "border-2 border-brand-black hover:scale-110",
                    )}
                  >
                    <div className="w-6 h-6 md:w-5 md:h-5 absolute top-px left-px rounded-sm bg-linear-0 from-brand-white/20 via-white/5 to-transparent" />
                  </button>
                </div>
              ),
          )}
        </div>
      </div>
    </div>
  );
}
