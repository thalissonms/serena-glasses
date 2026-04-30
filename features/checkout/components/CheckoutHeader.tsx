"use client";
import { useTranslation } from "react-i18next";
import { BreadcrumbProps } from "@features/navigation/types/breadcrumb.types";
import Breadcrumb from "@features/navigation/components/Breadcrumb";
import { ShoppingBag } from "lucide-react";

const CheckoutHeader = ({
  itemsAmount,
  finishingOrder = false,
  breadcrumb = { isActive: false, items: [] },
}: {
  itemsAmount?: number;
  finishingOrder?: boolean;
  breadcrumb?: BreadcrumbProps;
}) => {
  const { t } = useTranslation("checkout");

  function headingText() {
    if (itemsAmount && itemsAmount > 0) {
      return `${itemsAmount} ${t(itemsAmount > 1 ? "header.itemsPlural" : "header.item")}`;
    }
    return finishingOrder ? t("header.finishing") : t("header.empty");
  }

  return (
    <div className="max-w-7xl mx-auto mb-10">
      {breadcrumb?.isActive ? (
        <Breadcrumb items={breadcrumb.items} />
      ) : (
        <div className="flex items-center gap-3 mb-1">
          <ShoppingBag size={18} strokeWidth={2.5} className="text-gray-500 dark:text-gray-400" />
          <p className="font-poppins text-xs uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400 font-semibold">
            {t("header.myCart")}
          </p>
        </div>
      )}
      <div className="pt-4 flex flex-col items-center-safe">
        <span className="font-jocham text-6xl text-brand-pink leading-none">{headingText()}</span>
        <div className="flex items-center gap-2 mt-3">
          <div className="w-8 h-0.5 bg-brand-pink-light dark:bg-brand-pink/50" />
          <span className="text-brand-pink-light dark:text-brand-pink/70 text-lg">✦</span>
          <div className="w-8 h-0.5 bg-brand-pink-light dark:bg-brand-pink/50" />
        </div>
      </div>
    </div>
  );
};

export default CheckoutHeader;
