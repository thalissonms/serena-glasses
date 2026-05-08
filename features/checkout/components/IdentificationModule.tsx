"use client";
import { useTranslation } from "react-i18next";
import { SectionHeader } from "./SectionHeader";
import { RHFTextInput, RHFCPFInput, RHFPhoneInput } from "@shared/components/forms";

export function IdentificationModule() {
  const { t } = useTranslation("checkout");

  return (
    <div className="bg-white dark:bg-[#1a1a1a] border-2 border-black dark:border-brand-pink shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#FF00B6] p-6 transition-colors">
      <SectionHeader step={1} title={t("identification.title")} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <RHFTextInput
          name="identification.fullName"
          label={t("identification.fullName")}
          placeholder={t("identification.fullNamePlaceholder")}
          required
          className="sm:col-span-2"
        />
        <RHFCPFInput name="identification.cpf" label={t("identification.cpf")} required />
        <RHFTextInput
          name="identification.email"
          label={t("identification.email")}
          type="email"
          placeholder={t("identification.emailPlaceholder")}
          required
        />
        <RHFPhoneInput name="identification.phone" label={t("identification.phone")} required />
      </div>
    </div>
  );
}
