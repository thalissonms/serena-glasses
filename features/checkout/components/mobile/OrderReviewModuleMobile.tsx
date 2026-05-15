"use client";
import Image from "next/image";
import { Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatPrice } from "@features/products/utils/formatPrice";
import { useCartStore } from "@features/cart/store/cart.store";
import { useCheckoutForm } from "../../providers/checkout.rhf";
import { PaymentMethod } from "../../enums/checkout.enum";
import { SectionHeader } from "../SectionHeader";
import { MobileStepButton } from "./MobileStepButton";

interface OrderReviewModuleMobileProps {
  subtotal: number;
  discount: number;
  shippingPrice: number;
  total: number;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const METHOD_LABEL_KEY: Record<PaymentMethod, string> = {
  [PaymentMethod.Card]: "payment.card",
  [PaymentMethod.PIX]: "payment.pix",
  [PaymentMethod.Boleto]: "payment.boleto",
};

export function OrderReviewModuleMobile({
  subtotal,
  discount,
  shippingPrice,
  total,
  onSubmit,
  isSubmitting,
}: OrderReviewModuleMobileProps) {
  const { t } = useTranslation("checkout");
  const { watch } = useCheckoutForm();
  const items = useCartStore((s) => s.items);
  const appliedCoupon = useCartStore((s) => s.appliedCoupon);
  const selectedShipping = useCartStore((s) => s.selectedShipping);

  const paymentMethod = watch("payment.method");
  const installments = watch("payment.installments");
  const identification = watch("identification");
  const address = watch("address");

  return (
    <div className="p-6 transition-colors flex flex-col gap-6">
      <SectionHeader
        step={6}
        title={t("review.title", { defaultValue: "Revisar pedido" })}
      />

      <section className="flex flex-col gap-3">
        <h3 className="font-poppins font-black text-xs uppercase tracking-widest text-brand-pink">
          {t("sidebar.items", { defaultValue: "Itens" })}
        </h3>
        {items.map((item) => (
          <div key={item.variantId} className="flex gap-3 items-center">
            <div className="relative w-14 h-14 border-2 border-black dark:border-brand-pink shrink-0 overflow-hidden bg-pink-50 dark:bg-[#0a0a0a]">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="56px"
                className="object-contain p-1"
              />
              <span className="absolute top-0 right-0 w-4 h-4 bg-brand-pink text-white text-[9px] font-black flex items-center justify-center border border-black">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-poppins font-bold text-xs truncate">{item.name}</p>
              <p className="font-inter text-[10px] text-gray-500 dark:text-gray-400">
                {item.color?.name}
              </p>
            </div>
            <p className="font-poppins font-black text-xs shrink-0">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-1 text-xs font-poppins">
        <h3 className="font-black uppercase tracking-widest text-brand-pink mb-1">
          {t("identification.title")}
        </h3>
        <p>{identification?.fullName}</p>
        <p className="text-gray-500 dark:text-gray-400">
          {identification?.email} · {identification?.phone}
        </p>
      </section>

      <section className="flex flex-col gap-1 text-xs font-poppins">
        <h3 className="font-black uppercase tracking-widest text-brand-pink mb-1">
          {t("address.title")}
        </h3>
        <p>
          {address?.street}, {address?.number}
          {address?.complement ? ` — ${address.complement}` : ""}
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          {address?.neighborhood} · {address?.city}/{address?.state} · CEP {address?.cep}
        </p>
      </section>

      <section className="flex flex-col gap-1 text-xs font-poppins">
        <h3 className="font-black uppercase tracking-widest text-brand-pink mb-1">
          {t("payment.title")}
        </h3>
        <p>
          {t(METHOD_LABEL_KEY[paymentMethod as PaymentMethod] ?? "payment.card")}
          {paymentMethod === PaymentMethod.Card &&
            installments &&
            Number(installments) > 1 &&
            ` · ${installments}x`}
        </p>
        {selectedShipping && (
          <p className="text-gray-500 dark:text-gray-400">
            {t("sidebar.shipping", { defaultValue: "Frete" })}: {selectedShipping.name} ·{" "}
            {selectedShipping.price === 0
              ? t("sidebar.free", { defaultValue: "Grátis" })
              : formatPrice(selectedShipping.price)}
          </p>
        )}
      </section>

      <section className="flex flex-col gap-1 border-t-2 border-dashed border-brand-pink pt-3 text-sm font-poppins">
        <div className="flex justify-between">
          <span>{t("sidebar.subtotal", { defaultValue: "Subtotal" })}</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <span>
              {t("sidebar.discount", { defaultValue: "Desconto" })}
              {appliedCoupon?.code ? ` (${appliedCoupon.code})` : ""}
            </span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>{t("sidebar.shipping", { defaultValue: "Frete" })}</span>
          <span>
            {shippingPrice === 0
              ? t("sidebar.free", { defaultValue: "Grátis" })
              : formatPrice(shippingPrice)}
          </span>
        </div>
        <div className="flex justify-between font-black text-base mt-2">
          <span>{t("sidebar.total", { defaultValue: "Total" })}</span>
          <span>{formatPrice(total)}</span>
        </div>
      </section>

      <MobileStepButton onClick={onSubmit} loading={isSubmitting}>
        <Lock size={14} strokeWidth={3} />
        {t("review.confirm", { defaultValue: "Confirmar pedido" })}
      </MobileStepButton>
    </div>
  );
}
