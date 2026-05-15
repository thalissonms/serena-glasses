"use client";
import { CreditCard, QrCode, FileText, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCheckoutForm } from "../../providers/checkout.rhf";
import { PaymentMethod } from "../../enums/checkout.enum";
import { SectionHeader } from "../SectionHeader";
import { RHFTextInput, RHFMaskedInput } from "@shared/components/forms";
import { MAX_ATTEMPTS } from "@features/checkout/services/paymentRetry";
import { MobileStepButton } from "./MobileStepButton";

interface PaymentModuleMobileProps {
  nextStep: () => void;
  retryCount: number | null;
  onRetry: () => void;
}

export function PaymentModuleMobile({
  nextStep,
  retryCount,
  onRetry,
}: PaymentModuleMobileProps) {
  const { watch, setValue, trigger } = useCheckoutForm();
  const { t } = useTranslation("checkout");
  const paymentMethod = watch("payment.method");

  const paymentTabs = [
    { key: PaymentMethod.Card, icon: CreditCard, label: t("payment.card") },
    { key: PaymentMethod.PIX, icon: QrCode, label: t("payment.pix") },
    { key: PaymentMethod.Boleto, icon: FileText, label: t("payment.boleto") },
  ];

  const isRetryMode = retryCount !== null && paymentMethod === PaymentMethod.Card;

  const handleContinue = async () => {
    if (paymentMethod === PaymentMethod.Card) {
      const valid = await trigger([
        "payment.cardNumber",
        "payment.cardName",
        "payment.cardExpiry",
        "payment.cardCvv",
      ]);
      if (!valid) return;
    }
    nextStep();
  };

  return (
    <div className="p-6 transition-colors">
      <SectionHeader step={3} title={t("payment.title")} />

      <div className="flex border-2 border-black dark:border-brand-pink mb-6">
        {paymentTabs.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setValue("payment.method", key)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 font-poppins font-bold text-[10px] uppercase tracking-wider border-r last:border-r-0 border-black dark:border-brand-pink transition-colors cursor-pointer ${
              paymentMethod === key
                ? "bg-brand-pink text-white"
                : "bg-white dark:bg-[#1a1a1a] text-black dark:text-white"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {paymentMethod === PaymentMethod.Card && (
        <div className="flex flex-col gap-4">
          {isRetryMode && (
            <div className="flex items-center justify-between gap-3 border-2 border-yellow-400 dark:border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30 px-3 py-2">
              <p className="font-poppins text-[11px] font-bold text-yellow-800 dark:text-yellow-300">
                Tentativa {retryCount} de {MAX_ATTEMPTS}.
              </p>
              <button
                type="button"
                onClick={onRetry}
                className="flex items-center gap-1 shrink-0 font-poppins font-black text-[10px] uppercase tracking-wider border-2 border-black dark:border-brand-pink bg-white dark:bg-[#1a1a1a] text-black dark:text-white px-2 py-1 cursor-pointer"
              >
                <RefreshCw size={10} />
                Retry
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            <RHFMaskedInput
              name="payment.cardNumber"
              label={t("payment.cardNumber")}
              placeholder={t("payment.cardNumberPlaceholder")}
              pattern="#### #### #### ####"
              required
            />
            <RHFTextInput
              name="payment.cardName"
              label={t("payment.cardName")}
              placeholder={t("payment.cardNamePlaceholder")}
              required
            />
            <div className="grid grid-cols-2 gap-4">
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
            </div>
          </div>
        </div>
      )}

      {paymentMethod === PaymentMethod.PIX && (
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="w-32 h-32 border-4 border-black dark:border-brand-pink shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#FF00B6] bg-gray-100 dark:bg-[#0a0a0a] flex items-center justify-center">
            <QrCode size={60} className="text-gray-400 dark:text-gray-600" />
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

      <div className="mt-6">
        <MobileStepButton onClick={handleContinue}>
          {t("cart.continue", { defaultValue: "Continuar" })}
        </MobileStepButton>
      </div>
    </div>
  );
}
