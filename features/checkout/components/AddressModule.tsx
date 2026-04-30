"use client";
import { useTranslation } from "react-i18next";
import { BrazilianState } from "@shared/location/location.enum";
import { SectionHeader } from "./SectionHeader";
import { RHFTextInput, RHFCEPInput, RHFSelectInput } from "@shared/components/forms";

const STATE_OPTIONS = Object.values(BrazilianState).map((s) => ({ value: s, label: s }));

export function AddressModule() {
  const { t } = useTranslation("checkout");

  return (
    <div className="bg-white dark:bg-[#1a1a1a] border-2 border-black dark:border-brand-pink shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#FF00B6] p-6 transition-colors">
      <SectionHeader step={2} title={t("address.title")} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <RHFCEPInput name="address.cep" label={t("address.cep")} required />
        <div />
        <RHFTextInput
          name="address.street"
          label={t("address.street")}
          placeholder={t("address.streetPlaceholder")}
          required
          className="sm:col-span-2"
        />
        <RHFTextInput
          name="address.number"
          label={t("address.number")}
          placeholder={t("address.numberPlaceholder")}
          required
        />
        <RHFTextInput
          name="address.complement"
          label={t("address.complement")}
          placeholder={t("address.complementPlaceholder")}
        />
        <RHFTextInput
          name="address.neighborhood"
          label={t("address.neighborhood")}
          placeholder={t("address.neighborhoodPlaceholder")}
          required
        />
        <RHFTextInput
          name="address.city"
          label={t("address.city")}
          placeholder={t("address.cityPlaceholder")}
          required
        />
        <RHFSelectInput
          name="address.state"
          label={t("address.state")}
          options={[{ value: "", label: t("address.statePlaceholder") }, ...STATE_OPTIONS]}
          required
        />
      </div>
    </div>
  );
}
