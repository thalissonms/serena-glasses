"use client";
import { useTranslation } from "react-i18next";
import { SectionHeader } from "../SectionHeader";
import CouponInput from "../CouponInput";
import { MobileStepButton } from "./MobileStepButton";

interface CouponModuleMobileProps {
  nextStep: () => void;
}

export function CouponModuleMobile({ nextStep }: CouponModuleMobileProps) {
  const { t } = useTranslation("checkout");

  return (
    <div className="p-6 transition-colors">
      <SectionHeader
        step={4}
        title={t("coupon.title", { defaultValue: "Cupom" })}
      />
      <div className="flex flex-col gap-4">
        <CouponInput />
        <p className="font-poppins text-[11px] text-gray-500 dark:text-gray-400 text-center">
          {t("coupon.optionalHint", {
            defaultValue: "Cupom é opcional. Você pode continuar sem aplicar.",
          })}
        </p>
        <MobileStepButton onClick={nextStep}>
          {t("cart.continue", { defaultValue: "Continuar" })}
        </MobileStepButton>
      </div>
    </div>
  );
}
