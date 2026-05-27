"use client";

import { useTranslation } from "react-i18next";
import Image from "next/image";
import clsx from "clsx";
import { MapPin, Search } from "lucide-react";
import { BrazilianState } from "@shared/location/location.enum";
import {
  RHFTextInput,
  RHFCEPInput,
  RHFSelectInput,
} from "@shared/components/forms";
import { useCheckoutForm } from "../../providers/checkout.rhf";
import { ShippingOptions } from "../ShippingOptions";
import { SectionHeaderMobile } from "./SectionHeaderMobile";
import { y2kToast } from "@shared/lib/y2kToast";
import { useAddressLogic } from "../../hooks/useAddressLogic";

const STATE_OPTIONS = Object.values(BrazilianState).map((s) => ({
  value: s,
  label: s,
}));

interface AddressModuleMobileProps {
  nextStep: () => void;
}

export function AddressModuleMobile({ nextStep }: AddressModuleMobileProps) {
  const { t } = useTranslation("checkout");
  const {
    street,
    neighborhood,
    city,
    state,
    number,

    cepLoading,
    cepError,
    handleFetch,

    quoteOptions,
    quoteLoading,
    quoteError,

    canSearch,

    showAddressBody,
    showStreetInput,
    showNeighborhoodInput,
    showCityInput,
    showStateInput,
  } = useAddressLogic();

  const { trigger } = useCheckoutForm();

  const handleShippingSelected = async () => {
    const valid = await trigger("address");
    if (valid) {
      nextStep();
    } else {
      y2kToast.error(
        t("address.fillRequired", {
          defaultValue:
            "Preencha todos os campos do endereço antes de continuar.",
        }),
      );
    }
  };

  return (
    <div className="p-6 transition-colors">
      <SectionHeaderMobile step={1} title={t("address.title")} />
      <div className="flex flex-col gap-4">
        <div className="relative flex items-start gap-2 h-32">
          <RHFCEPInput
            name="address.cep"
            label={t("address.cep")}
            required
            className="w-full"
          />
          <div className="h-full items-center pb-9 flex">
            <button
              type="button"
              onClick={handleFetch}
              disabled={!canSearch}
              aria-label={t("address.searchCep")}
              className={clsx(
                "mb-1 flex items-center justify-center bg-brand-pink dark:bg-brand-pink-bg-dark shadow-[4px_4px_0px] shadow-brand-black dark:shadow-brand-blue border-2 border-brand-black dark:border-brand-pink-light text-white dark:text-brand-pink-light active:shadow-[0.5px_0.5px_0] transition-all duration-300 cursor-pointer mr-2 disabled:opacity-50",
              )}
            >
              {cepLoading ? (
                <Image
                  src="/loaders/sparkles-loader.gif"
                  width={48}
                  height={48}
                  alt=""
                />
              ) : (
                <div className="p-2">
                  <Search size={24} strokeWidth={3} className="text-white" />
                </div>
              )}
            </button>
            <a
              href="https://buscacepinter.correios.com.br/app/endereco/index.php"
              target="_blank"
              className="text-sm font-bold absolute top-18 right-16 text-brand-pink/80 hover:to-brand-pink"
            >
              Não sei meu CEP
            </a>
          </div>
        </div>

        {cepError && <p className="text-sm text-red-500">{cepError}</p>}

        {showAddressBody && (
          <>
            <div className="flex items-center gap-3 pl-2 pr-1 font-semibold bg-white shadow-[4px_4px_0px] -mt-8 mb-2 shadow-brand-black border-2 border-black py-3">
              <MapPin
                size={30}
                strokeWidth={2}
                className="text-brand-pink shrink-0"
              />
              <span className="tracking-tight text-sm">
                {[street, neighborhood, city, state].filter(Boolean).join(", ")}
              </span>
            </div>

            {showStreetInput && (
              <RHFTextInput
                name="address.street"
                label={t("address.street")}
                placeholder={t("address.streetPlaceholder")}
                required
              />
            )}
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
            {showNeighborhoodInput && (
              <RHFTextInput
                name="address.neighborhood"
                label={t("address.neighborhood")}
                placeholder={t("address.neighborhoodPlaceholder")}
                required
              />
            )}
            {showCityInput && (
              <RHFTextInput
                name="address.city"
                label={t("address.city")}
                placeholder={t("address.cityPlaceholder")}
                required
              />
            )}
            {showStateInput && (
              <RHFSelectInput
                name="address.state"
                label={t("address.state")}
                options={[
                  { value: "", label: t("address.statePlaceholder") },
                  ...STATE_OPTIONS,
                ]}
                required
              />
            )}

            <div
              aria-disabled={!(number ?? "").trim()}
              className={clsx(
                !(number ?? "").trim() && "opacity-50 pointer-events-none",
              )}
            >
              <ShippingOptions
                options={quoteOptions}
                loading={quoteLoading}
                error={quoteError}
                onSelect={handleShippingSelected}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
