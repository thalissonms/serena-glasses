"use client";
import { useTranslation } from "react-i18next";
import { useCheckoutForm } from "../../providers/checkout.rhf";
import { SectionHeader } from "../SectionHeader";
import {
  RHFTextInput,
  RHFCPFInput,
  RHFPhoneInput,
} from "@shared/components/forms";
import { MobileStepButton } from "./MobileStepButton";

interface IdentificationModuleMobileProps {
  nextStep: () => void;
}

export function IdentificationModuleMobile({
  nextStep,
}: IdentificationModuleMobileProps) {
  const { t } = useTranslation("checkout");
  const { trigger } = useCheckoutForm();

  const handleContinue = async () => {
    const valid = await trigger("identification");
    if (valid) nextStep();
  };

  return (
    <div className="p-6 transition-colors">
      <SectionHeader step={2} title={t("identification.title")} />
      <div className="grid grid-cols-1 gap-4">
        <RHFTextInput
          name="identification.fullName"
          label={t("identification.fullName")}
          placeholder={t("identification.fullNamePlaceholder")}
          required
        />
        <RHFCPFInput
          name="identification.cpf"
          label={t("identification.cpf")}
          required
        />
        <RHFTextInput
          name="identification.email"
          label={t("identification.email")}
          type="email"
          placeholder={t("identification.emailPlaceholder")}
          required
        />
        <RHFPhoneInput
          name="identification.phone"
          label={t("identification.phone")}
          required
        />
        <div className="mt-2">
          <MobileStepButton onClick={handleContinue}>
            {t("cart.continue", { defaultValue: "Continuar" })}
          </MobileStepButton>
        </div>
      </div>
    </div>
  );
}
