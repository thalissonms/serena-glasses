"use client";
import { useTranslation } from "react-i18next";
import { BrazilianState } from "@shared/location/location.enum";
import { SectionHeader } from "./SectionHeader";
import {
  RHFTextInput,
  RHFCEPInput,
  RHFSelectInput,
} from "@shared/components/forms";
import { ShippingOptions } from "./ShippingOptions";
import { useAddressLogic } from "../hooks/useAddressLogic";

const STATE_OPTIONS = Object.values(BrazilianState).map((s) => ({
  value: s,
  label: s,
}));

export function AddressModule() {
  const { t } = useTranslation("checkout");
  const {
    lockedFields,
    resolved,

    cepLoading,
    cepError,
    handleFetch,

    quoteOptions,
    quoteLoading,
    quoteError,

    canSearch,
  } = useAddressLogic();

  return (
    <div className="bg-white dark:bg-brand-pink-dark border-2 border-black dark:border-brand-pink shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#FF00B6] p-6 transition-colors">
      <SectionHeader step={2} title={t("address.title")} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="w-full h-30 flex items-start gap-0.5">
          <RHFCEPInput
            name="address.cep"
            label={t("address.cep")}
            required
            className="w-full"
          />
          <div className="items-center pb-5 flex mt-30 h-full">
            <button
              type="button"
              onClick={handleFetch}
              disabled={!canSearch}
              className="h-12 truncate dark:border-brand-pink bg-brand-black dark:bg-brand-pink shadow-[1px_1px_0] shadow-brand-black border-2 border-brand-black text-white font-poppins text-xs font-black uppercase tracking-wider px-4 py-2 hover:bg-brand-pink hover:shadow-[4px_4px_0] dark:hover:bg-white dark:hover:text-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer transition-all duration-300"
            >
              {cepLoading ? t("address.searching") : t("address.searchCep")}
            </button>
          </div>
        </div>

        {resolved && (
          <>
            {cepError && (
              <p className="sm:col-span-2 text-sm text-red-500">{cepError}</p>
            )}
            <RHFTextInput
              name="address.street"
              label={t("address.street")}
              placeholder={t("address.streetPlaceholder")}
              required
              className="sm:col-span-2 block"
              disabled={lockedFields.has("street")}
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
              disabled={lockedFields.has("neighborhood")}
            />
            <RHFTextInput
              name="address.city"
              label={t("address.city")}
              placeholder={t("address.cityPlaceholder")}
              required
              disabled={lockedFields.has("city")}
            />
            <RHFSelectInput
              name="address.state"
              label={t("address.state")}
              options={[
                { value: "", label: t("address.statePlaceholder") },
                ...STATE_OPTIONS,
              ]}
              required
              disabled={lockedFields.has("state")}
            />
            <ShippingOptions
              options={quoteOptions}
              loading={quoteLoading}
              error={quoteError}
            />
          </>
        )}
      </div>
    </div>
  );
}
