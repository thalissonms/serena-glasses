"use client";
import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
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
import { useCartStore } from "@features/cart/store/cart.store";
import { useCheckoutForm } from "../../providers/checkout.rhf";
import { useCepAutofill } from "../../hooks/useCepAutofill";
import type { ShippingQuoteOption } from "@shared/lib/melhor-envio/types";
import { ShippingOptions } from "../ShippingOptions";
import { SectionHeader } from "../SectionHeader";
import { y2kToast } from "@shared/lib/y2kToast";

const STATE_OPTIONS = Object.values(BrazilianState).map((s) => ({
  value: s,
  label: s,
}));

interface AddressModuleMobileProps {
  nextStep: () => void;
}

export function AddressModuleMobile({ nextStep }: AddressModuleMobileProps) {
  const { t } = useTranslation("checkout");
  const { control, trigger } = useCheckoutForm();
  const cep = useWatch({ control, name: "address.cep" }) as string;
  const street = useWatch({ control, name: "address.street" }) as string;
  const neighborhood = useWatch({ control, name: "address.neighborhood" }) as string;
  const city = useWatch({ control, name: "address.city" }) as string;
  const state = useWatch({ control, name: "address.state" }) as string;
  const number = useWatch({ control, name: "address.number" }) as string;

  const items = useCartStore((s) => s.items);
  const setSelectedShipping = useCartStore((s) => s.setSelectedShipping);
  const {
    lockedFields,
    loading: cepLoading,
    error: cepError,
    resolved,
    handleFetch,
  } = useCepAutofill();

  const [quoteOptions, setQuoteOptions] = useState<ShippingQuoteOption[]>([]);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const itemsKey = JSON.stringify(
    items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
  );

  useEffect(() => {
    const cleanCep = (cep ?? "").replace(/\D/g, "");
    if (cleanCep.length !== 8 || items.length === 0) {
      setQuoteOptions([]);
      setQuoteError(null);
      setSelectedShipping(null);
      return;
    }

    let cancelled = false;
    setQuoteError(null);

    const timerId = setTimeout(() => {
      setQuoteLoading(true);
      fetch("/api/checkout/shipping/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cep: cleanCep,
          items: items.map((i) => ({
            variantId: i.variantId,
            quantity: i.quantity,
          })),
        }),
      })
        .then((r) => r.json())
        .then((data: { options?: ShippingQuoteOption[]; error?: string }) => {
          if (cancelled) return;
          if (data.error) {
            setQuoteError(data.error);
            setQuoteOptions([]);
            setSelectedShipping(null);
          } else {
            const opts = data.options ?? [];
            setQuoteOptions(opts);
            if (opts.length === 1) setSelectedShipping(opts[0]);
            else setSelectedShipping(null);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setQuoteError("Erro ao calcular frete. Tente novamente.");
            setQuoteOptions([]);
          }
        })
        .finally(() => {
          if (!cancelled) setQuoteLoading(false);
        });
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timerId);
    };
  }, [cep, itemsKey, items.length, setSelectedShipping]);

  const cleanCep = (cep ?? "").replace(/\D/g, "");
  const canSearch = cleanCep.length === 8 && !cepLoading;
  const showAddressBody = resolved || Boolean(street);

  const handleShippingSelected = async () => {
    const valid = await trigger("address");
    if (valid) {
      nextStep();
    } else {
      y2kToast.error(
        t("address.fillRequired", {
          defaultValue: "Preencha todos os campos do endereço antes de continuar.",
        }),
      );
    }
  };

  const showStreetInput = showAddressBody && !lockedFields.has("street") && !street;
  const showNeighborhoodInput =
    showAddressBody && !lockedFields.has("neighborhood") && !neighborhood;
  const showCityInput = showAddressBody && !lockedFields.has("city") && !city;
  const showStateInput = showAddressBody && !lockedFields.has("state") && !state;

  return (
    <div className="p-6 transition-colors">
      <SectionHeader step={1} title={t("address.title")} />
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-end gap-2">
          <RHFCEPInput
            name="address.cep"
            label={t("address.cep")}
            required
            className="w-full"
          />
          <div className="h-full items-end flex">
            <button
              type="button"
              onClick={handleFetch}
              disabled={!canSearch}
              aria-label={t("address.searchCep")}
              className={clsx(
                "mb-0.5 flex items-center justify-center bg-brand-pink dark:bg-brand-pink-bg-dark shadow-[4px_4px_0px] shadow-brand-black dark:shadow-brand-blue border-2 border-brand-black dark:border-brand-pink-light text-white dark:text-brand-pink-light active:shadow-[0.5px_0.5px_0] transition-all duration-300 cursor-pointer mr-2 disabled:opacity-50",
              )}
            >
              {cepLoading ? (
                <Image
                  src="/loaders/sparkles-loader.gif"
                  width={50}
                  height={50}
                  alt=""
                />
              ) : (
                <div className="p-2">
                  <Search size={26} strokeWidth={3} className="text-white" />
                </div>
              )}
            </button>
          </div>
        </div>

        {cepError && <p className="text-sm text-red-500">{cepError}</p>}

        {showAddressBody && (
          <>
            <div className="flex items-center gap-3 pl-1 font-semibold bg-white shadow-[4px_4px_0px] shadow-brand-black border-2 border-black p-2">
              <MapPin size={30} strokeWidth={2} className="text-brand-pink shrink-0" />
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
