"use client";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useCheckoutForm } from "../../providers/checkout.rhf";
import { formatPrice } from "@features/products/utils/formatPrice";
import { SectionHeader } from "../SectionHeader";
import { RHFSelectInput } from "@shared/components/forms";
import { MobileStepButton } from "./MobileStepButton";

interface InstallmentsModuleMobileProps {
  nextStep: () => void;
  subtotal: number;
  maxInstallments: number;
}

export function InstallmentsModuleMobile({
  nextStep,
  subtotal,
  maxInstallments,
}: InstallmentsModuleMobileProps) {
  const { t } = useTranslation("checkout");
  const { setValue } = useCheckoutForm();

  useEffect(() => {
    if (maxInstallments <= 1) {
      setValue("payment.installments", "1");
    }
  }, [maxInstallments, setValue]);

  const installmentsOptions = Array.from(
    { length: maxInstallments },
    (_, i) => i + 1,
  ).map((n) => ({
    value: String(n),
    label: t("payment.installmentOption", {
      count: n,
      price: formatPrice(subtotal / n),
    }),
  }));

  return (
    <div className="p-6 transition-colors">
      <SectionHeader
        step={5}
        title={t("payment.installments", { defaultValue: "Parcelas" })}
      />
      <div className="flex flex-col gap-4">
        <RHFSelectInput
          name="payment.installments"
          label={t("payment.installments")}
          options={installmentsOptions}
          required
        />
        <MobileStepButton onClick={nextStep}>
          {t("cart.continue", { defaultValue: "Continuar" })}
        </MobileStepButton>
      </div>
    </div>
  );
}
