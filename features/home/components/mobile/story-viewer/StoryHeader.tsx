"use client";

import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Product } from "@features/products/types";
import { CategoryChip } from "@features/navigation/components";
import { getCategoryIcon } from "@features/products/utils/getCategoryIcon";
import { getProductTags } from "@features/products/utils/getProductTags";
import { CATEGORY_LABELS } from "@features/products/config/product.config";

interface StoryHeaderProps {
  product: Product;
  onClose: () => void;
}

const TAG_STYLES: Record<"pink" | "blue" | "black", string> = {
  pink: "bg-brand-pink text-white border border-black shadow-[1px_1px_0] shadow-brand-blue",
  blue: "bg-brand-blue text-black border border-black shadow-[1px_1px_0] shadow-brand-pink",
  black:
    "bg-black text-white border border-brand-pink shadow-[1px_1px_0] shadow-brand-pink",
};

export function StoryHeader({ product, onClose }: StoryHeaderProps) {
  const { t } = useTranslation("home");
  const tags = getProductTags(product);
  const categoryLabel = CATEGORY_LABELS[product.category];
  const icon = getCategoryIcon(product.category);

  return (
    <div className="relative flex flex-col gap-0.5 px-3 pb-2 shrink-0 mt-2">
      <div className="absolute -top-10 left-0 w-full h-24 bg-linear-to-b from-brand-pink-bg-dark/80 to-brand-pink-bg-dark/0" />
      <div className="relative flex items-center gap-2">
        <CategoryChip
          item={{ label: categoryLabel }}
          active
          icon={icon}
          width="w-12"
          height="h-12"
          iconSize={22}
          showLabel={false}
        />
        <div className="flex flex-col gap-1 ml-0.5 mt-1">
          <span className="text-white font-poppins text-lg font-bold italic leading-4 text-shadow-[2px_2px_0px] text-shadow-brand-pink">
            {product.name}
          </span>
          {product.shortDescription && (
            <span className="text-white/60 text-xs font-family-inter italic truncate">
              {product.shortDescription}
            </span>
          )}
        </div>

        {/* <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
          {tags.map((tag) => (
            <span
              key={tag.label}
              className={`text-[10px] font-bold font-poppins uppercase px-1.5 py-0.5 ${TAG_STYLES[tag.color]}`}
            >
              {tag.label}
            </span>
          ))}
        </div>
*/}
        <div className="absolute -top-1 right-1">
          <button
            onClick={onClose}
            aria-label={t("storyViewer.close")}
            className="p-2 text-white/70 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* {product.shortDescription && (
        <p className="text-white/60 text-xs font-aisha italic pl-1 truncate">
          {product.shortDescription}
        </p>
      )} */}
    </div>
  );
}
