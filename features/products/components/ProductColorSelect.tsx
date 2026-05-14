"use client";

import { useTranslation } from "react-i18next";
import { Product } from "../types";
import clsx from "clsx";

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
      <p className="text-sm font-semibold text-gray-600 dark:text-brand-blue hidden md:block md:mb-3">
        {t("page.colorLabel")}{" "}
        <span className="text-black dark:text-white font-bold">
          {activeColor?.color.name}{" "}
        </span>
      </p>
      <span className="text-black text-sm dark:text-white font-bold mb-0.5">
        {" "}{t("page.colorLabel").slice(0, -1)}
      </span>
      <div className="flex gap-2 md:gap-3">
        {uniqueColors.map(
          (variant, i) =>
            variant.inStock && (
              <button
                key={variant.color.slug}
                onClick={() => onColorChange(i)}
                title={variant.color.name}
                style={{ backgroundColor: variant.color.hex }}
                className={clsx(
                  "w-7 h-7 md:w-6 md:h-6 md:rounded-full transition-all",
                  variant.color.hex === "#FFFFFF" && "border border-gray-200",
                  selectedColor === i
                    ? "border-2 border-brand-yellow shadow-[2px_2px_0] shadow-black scale-110"
                    : "border border-black hover:scale-110",
                )}
              />
            ),
        )}
      </div>
    </div>
  );
}
