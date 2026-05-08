"use client";
/**
 * Component: PaymentModule — seção de pagamento no checkout (cartão, PIX, Boleto).
 *
 * Exibe abas de método de pagamento e campos de cartão via MP Bricks.
 * Em modo retry (retryCount !== null), exibe banner com tentativa atual e botão
 * "Tentar novamente" que limpa os campos de cartão/CVV.
 *
 * Usado em: src/app/checkout/page.tsx.
 */
import { CreditCard, QrCode, FileText, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatPrice } from "@features/products/utils/formatPrice";
import { useCheckoutForm } from "../providers/checkout.rhf";
import { PaymentMethod } from "../enums/checkout.enum";
import { SectionHeader } from "./SectionHeader";
import { RHFTextInput, RHFSelectInput, RHFMaskedInput } from "@shared/components/forms";
import { MAX_ATTEMPTS } from "@features/checkout/services/paymentRetry";

interface PaymentModuleProps {
  subtotal: number;
  retryCount: number | null;
  onRetry: () => void;
}

export function PaymentModule({ subtotal, retryCount, onRetry }: PaymentModuleProps) {
  const { watch, setValue } = useCheckoutForm();
  const { t } = useTranslation("checkout");
  const paymentMethod = watch("payment.method");

  const paymentTabs = [
    { key: PaymentMethod.Card, icon: CreditCard, label: t("payment.card") },
    { key: PaymentMethod.PIX, icon: QrCode, label: t("payment.pix") },
    { key: PaymentMethod.Boleto, icon: FileText, label: t("payment.boleto") },
  ];

  const installmentsOptions = [
    { value: "1", label: t("payment.installmentOption", { count: 1, price: formatPrice(subtotal) }) },
    { value: "2", label: t("payment.installmentOption", { count: 2, price: formatPrice(subtotal / 2) }) },
    { value: "3", label: t("payment.installmentOption", { count: 3, price: formatPrice(subtotal / 3) }) },
  ];

  const isRetryMode = retryCount !== null && paymentMethod === PaymentMethod.Card;

  return (
    <div className="bg-white dark:bg-[#1a1a1a] border-2 border-black dark:border-brand-pink shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#FF00B6] p-6 transition-colors">
      <SectionHeader step={3} title={t("payment.title")} />

      {/* Method tabs */}
      <div className="flex border-2 border-black dark:border-brand-pink mb-6">
        {paymentTabs.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setValue("payment.method", key)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 font-poppins font-bold text-xs uppercase tracking-wider border-r last:border-r-0 border-black dark:border-brand-pink transition-colors cursor-pointer ${
              paymentMethod === key
                ? "bg-brand-pink text-white"
                : "bg-white dark:bg-[#1a1a1a] text-black dark:text-white hover:bg-pink-50 dark:hover:bg-[#252525]"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Card — UI custom Y2K */}
      {paymentMethod === PaymentMethod.Card && (
        <div className="flex flex-col gap-4">
          {isRetryMode && (
            <div className="flex items-center justify-between gap-4 border-2 border-yellow-400 dark:border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30 px-4 py-3">
              <p className="font-poppins text-xs font-bold text-yellow-800 dark:text-yellow-300">
                Tentativa {retryCount} de {MAX_ATTEMPTS} — revise os dados do cartão e tente novamente.
              </p>
              <button
                type="button"
                onClick={onRetry}
                className="flex items-center gap-1.5 shrink-0 font-poppins font-black text-xs uppercase tracking-wider border-2 border-black dark:border-brand-pink bg-white dark:bg-[#1a1a1a] text-black dark:text-white px-3 py-1.5 shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#FF00B6] hover:translate-y-0.5 hover:shadow-[1px_1px_0_#000] dark:hover:shadow-[1px_1px_0_#FF00B6] transition-all cursor-pointer"
              >
                <RefreshCw size={11} />
                Tentar novamente
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <RHFMaskedInput
              name="payment.cardNumber"
              label={t("payment.cardNumber")}
              placeholder={t("payment.cardNumberPlaceholder")}
              pattern="#### #### #### ####"
              required
              className="sm:col-span-2"
            />
            <RHFTextInput
              name="payment.cardName"
              label={t("payment.cardName")}
              placeholder={t("payment.cardNamePlaceholder")}
              required
              className="sm:col-span-2"
            />
            <RHFMaskedInput
              name="payment.cardExpiry"
              label={t("payment.cardExpiry")}
              placeholder={t("payment.cardExpiryPlaceholder")}
              pattern="##/##"
              required
            />
            <RHFTextInput
              name="payment.cardCvv"
              label={t("payment.cardCvv")}
              placeholder="000"
              required
            />
            <RHFSelectInput
              name="payment.installments"
              label={t("payment.installments")}
              options={installmentsOptions}
              required
              className="sm:col-span-2"
            />
          </div>
        </div>
      )}

      {/* PIX */}
      {paymentMethod === PaymentMethod.PIX && (
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="w-40 h-40 border-4 border-black dark:border-brand-pink shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#FF00B6] bg-gray-100 dark:bg-[#0a0a0a] flex items-center justify-center">
            <QrCode size={80} className="text-gray-400 dark:text-gray-600" />
          </div>
          <p className="font-poppins text-sm text-gray-600 dark:text-gray-400 text-center max-w-xs">
            {t("payment.pixDescription")}
          </p>
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="font-poppins font-bold text-xs uppercase tracking-wider">
              {t("payment.pixDiscount")}
            </span>
          </div>
        </div>
      )}

      {/* Boleto */}
      {paymentMethod === PaymentMethod.Boleto && (
        <div className="flex flex-col gap-3 py-4">
          <p className="font-poppins text-sm text-gray-600 dark:text-gray-400">
            {t("payment.boletoLeadIn")}{" "}
            <strong>{t("payment.boletoDueDays")}</strong>.{" "}
            {t("payment.boletoTrail")}
          </p>
          <div className="border-l-4 border-brand-pink pl-3">
            <p className="font-poppins text-xs text-gray-500 dark:text-gray-400">
              {t("payment.boletoNote")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
