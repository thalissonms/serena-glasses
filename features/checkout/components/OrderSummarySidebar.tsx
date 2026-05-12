"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Lock, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatPrice } from "@features/products/utils/formatPrice";
import { useCartStore } from "@features/cart/store/cart.store";
import CouponInput from "./CouponInput";

const OrderSummarySidebar = ({
  isFinished = false,
  isSubmitting = false,
}: {
  isFinished?: boolean;
  isSubmitting?: boolean;
}) => {
  const { t } = useTranslation("checkout");
  const items = useCartStore((state) => state.items);
  const appliedCoupon = useCartStore((state) => state.appliedCoupon);
  const selectedShipping = useCartStore((state) => state.selectedShipping);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = appliedCoupon?.discount_applied_cents ?? 0;
  const isFreeShippingCoupon = appliedCoupon?.discount_type === "free_shipping";
  const shippingPrice = isFreeShippingCoupon
    ? 0
    : (selectedShipping?.price ?? 0);
  const total = Math.max(0, subtotal - discount + shippingPrice);

  return (
    <div className="flex flex-col gap-4 sticky top-6">
      <div className="border-4 border-black dark:border-brand-pink shadow-[6px_6px_0_#FF00B6] bg-white dark:bg-[#1a1a1a] p-6 transition-colors">
        <h2 className="font-poppins font-black text-base uppercase tracking-wider border-b-2 border-black dark:border-brand-pink pb-3 mb-4">
          {t("sidebar.title")}
        </h2>

        {isFinished && items.length > 0 && (
          <div className="flex flex-col gap-3 mb-4">
            {items.map((item) => (
              <div key={item.variantId} className="flex gap-3 items-center">
                <div className="relative w-12 h-12 border-2 border-black dark:border-brand-pink shrink-0 overflow-hidden bg-pink-50 dark:bg-[#0a0a0a]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-1"
                  />
                  <span className="absolute top-0 right-0 w-4 h-4 bg-brand-pink text-white text-[9px] font-black flex items-center justify-center border border-black">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-poppins font-bold text-xs truncate">
                    {item.name}
                  </p>
                  <p className="font-inter text-[10px] text-gray-500 dark:text-gray-400">
                    {item.color.name}
                  </p>
                </div>
                <span className="font-poppins font-semibold text-xs shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        )}
        {isFinished && (
          <div className="mb-3">
            <CouponInput />
          </div>
        )}

        <div
          className={`flex flex-col gap-2 font-poppins text-sm pt-3 ${isFinished && items.length > 0 ? "border-t-2 border-black dark:border-brand-pink" : ""}`}
        >
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              {t("sidebar.subtotal")}
            </span>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-brand-pink">
              <span className="font-semibold">{t("sidebar.discount")}</span>
              <span className="font-semibold">-{formatPrice(discount)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              {t("sidebar.shipping")}
            </span>
            {!selectedShipping && !isFreeShippingCoupon ? (
              <span className="text-gray-400 dark:text-gray-500 text-xs font-normal">
                {isFinished
                  ? "Calcular no endereço"
                  : "-"}
              </span>
            ) : shippingPrice === 0 ? (
              <span className="flex items-center gap-1.5">
                {selectedShipping &&
                  selectedShipping.original_price > 0 &&
                  !isFreeShippingCoupon && (
                    <span className="font-inter text-xs line-through text-gray-400 dark:text-gray-500">
                      {formatPrice(selectedShipping.original_price)}
                    </span>
                  )}
                {isFreeShippingCoupon &&
                  selectedShipping &&
                  selectedShipping.price > 0 && (
                    <span className="font-inter text-xs line-through text-gray-400 dark:text-gray-500">
                      {formatPrice(selectedShipping.price)}
                    </span>
                  )}
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {t("sidebar.shippingFree")}
                </span>
              </span>
            ) : (
              <span className="font-semibold">
                {formatPrice(shippingPrice)}
              </span>
            )}
          </div>
        </div>

        <div className="border-t-2 border-black dark:border-brand-pink mt-3 pt-3 flex items-baseline justify-between mb-5">
          <span className="font-poppins font-black text-sm uppercase tracking-wide">
            {t("sidebar.total")}
          </span>
          <span className="font-jocham text-2xl text-brand-pink leading-none">
            {formatPrice(total)}
          </span>
        </div>

        {isFinished ? (
          <button
            type="submit"
            form="checkout-form"
            disabled={isSubmitting}
            className="hidden lg:flex items-center justify-center gap-2 w-full py-4 font-poppins text-sm font-black uppercase tracking-widest border-4 border-black bg-brand-pink text-white shadow-[6px_6px_0_#000] hover:translate-y-0.5 hover:shadow-[4px_4px_0_#000] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[6px_6px_0_#000]"
          >
            {isSubmitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Lock size={14} />
            )}
            {isSubmitting ? "Processando..." : t("sidebar.confirmOrder")}
          </button>
        ) : (
          <div className="flex flex-col gap-5">
            {items.length <= 0 ? (
              <div className="flex items-center justify-center gap-2 w-full py-4 font-poppins text-sm font-black uppercase tracking-widest border-3 border-gray-500 dark:border-gray-700 bg-brand-pink-light dark:bg-gray-800 text-white mt-1 cursor-not-allowed">
                {t("sidebar.finishOrder")} <ArrowRight size={16} />
              </div>
            ) : (
              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 w-full py-4 font-poppins text-sm font-black uppercase tracking-widest border-4 border-black dark:border-brand-pink bg-brand-pink text-white shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#000] hover:translate-y-0.5 hover:shadow-[4px_4px_0_#000] transition-all mt-1"
              >
                {t("sidebar.finishOrder")} <ArrowRight size={16} />
              </Link>
            )}
            <Link
              href="/"
              className="text-center text-xs font-poppins font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-brand-pink transition-colors"
            >
              {t("sidebar.continueShopping")}
            </Link>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500">
        <Lock size={12} />
        <span className="font-poppins text-xs">
          {t("sidebar.securePayment")}
        </span>
      </div>
    </div>
  );
};

export default OrderSummarySidebar;
