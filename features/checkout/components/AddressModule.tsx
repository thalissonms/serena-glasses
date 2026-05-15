"use client";
import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BrazilianState } from "@shared/location/location.enum";
import { SectionHeader } from "./SectionHeader";
import {
  RHFTextInput,
  RHFCEPInput,
  RHFSelectInput,
} from "@shared/components/forms";
import { ShippingOptions } from "./ShippingOptions";
import { useCartStore } from "@features/cart/store/cart.store";
import { useCheckoutForm } from "../providers/checkout.rhf";
import { useCepAutofill } from "../hooks/useCepAutofill";
import type { ShippingQuoteOption } from "@shared/lib/melhor-envio/types";
import { Locate, MapPin, Search } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";
import { motion } from "framer-motion";

const STATE_OPTIONS = Object.values(BrazilianState).map((s) => ({
  value: s,
  label: s,
}));

export function AddressModule({nextStep}: {nextStep?:() => void}) {
  const { t } = useTranslation("checkout");
  const { control } = useCheckoutForm();
  const cep = useWatch({ control, name: "address.cep" }) as string;
  const number = useWatch({ control, name: "address.number" }) as string;
  const { getValues: add } = useFormContext();
  const isNumberOk = (number ?? "").trim().length > 0;
  const handleNextStep = () => {
    if (isNumberOk) nextStep?.();
  };
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

    // 400ms debounce — prevents a burst of requests while the user types/corrects the CEP
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
            if (opts.length === 1) {
              setSelectedShipping(opts[0]);
            } else {
              setSelectedShipping(null);
            }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cep, itemsKey]);

  const cleanCep = (cep ?? "").replace(/\D/g, "");
  const canSearch = cleanCep.length === 8 && !cepLoading;

  return (
    <div className="md:bg-white dark:md:bg-brand-pink-dark md:border-2 md:border-black dark:md:border-brand-pink md:shadow-[4px_4px_0_#000] dark:md:shadow-[4px_4px_0_#FF00B6] p-6 transition-colors">
      <SectionHeader step={2} title={t("address.title")} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-end justify-center gap-2">
          <RHFCEPInput
            name="address.cep"
            label={t("address.cep")}
            required
            className="w-full"
          />
          <div className="items-end hidden md:flex">
            <button
              type="button"
              onClick={handleFetch}
              disabled={!canSearch}
              className="h-12 dark:border-brand-pink bg-brand-black dark:bg-brand-pink shadow-[1px_1px_0] shadow-brand-black border-2 border-brand-black text-white font-poppins text-xs font-black uppercase tracking-wider px-4 py-2 hover:bg-brand-pink hover:shadow-[4px_4px_0] dark:hover:bg-white dark:hover:text-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer transition-all duration-300"
            >
              {cepLoading ? t("address.searching") : t("address.searchCep")}
            </button>
          </div>
          <div className="h-full items-end flex md:hidden">
            <button
              type="button"
              onClick={handleFetch}
              disabled={!canSearch}
              className={clsx(
                "mb-0.5 flex items-center justify-center bg-brand-pink dark:bg-brand-pink-bg-dark shadow-[4px_4px_0px] shadow-brand-black dark:shadow-brand-blue border-2 border-brand-black dark:border-brand-pink-light text-white dark:text-brand-pink-light active:shadow-[0.5px_0.5px_0] transition-all duration-300 cursor-pointer mr-2",
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

        {resolved && (
          <>
            {cepError && (
              <p className="sm:col-span-2 text-sm text-red-500">{cepError}</p>
            )}
            <div
              className={clsx(
                "flex justify-center items-center gap-3 pl-1 font-semibold",
                "bg-white shadow-[4px_4px_0px] shadow-brand-black border-2 border-black p-2",
              )}
            >
              <MapPin size={30} strokeWidth={2} className="text-brand-pink" />
              <span className="tracking-tight">
                {`${add("address.street")}, ${add("address.neighborhood")},
              `}
                {`${add("address.city")}, ${add("address.state")}`}.
              </span>
            </div>
            <RHFTextInput
              name="address.street"
              label={t("address.street")}
              placeholder={t("address.streetPlaceholder")}
              required
              className="sm:col-span-2 hidden md:block"
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
              className="hidden md:block"
              name="address.neighborhood"
              label={t("address.neighborhood")}
              placeholder={t("address.neighborhoodPlaceholder")}
              required
              disabled={lockedFields.has("neighborhood")}
            />
            <RHFTextInput
              className="hidden md:block"
              name="address.city"
              label={t("address.city")}
              placeholder={t("address.cityPlaceholder")}
              required
              disabled={lockedFields.has("city")}
            />
            <RHFSelectInput
              className="hidden md:block"
              name="address.state"
              label={t("address.state")}
              options={[
                { value: "", label: t("address.statePlaceholder") },
                ...STATE_OPTIONS,
              ]}
              required
              disabled={lockedFields.has("state")}
            />
            <div className="hidden md:block">
              <ShippingOptions
                options={quoteOptions}
                loading={quoteLoading}
                error={quoteError}
              />
            </div>
            <div
              onClick={handleNextStep}
              aria-disabled={!isNumberOk}
              className={clsx(
                "md:hidden",
                !isNumberOk && "opacity-50 pointer-events-none",
              )}
            >
              <ShippingOptions
                options={quoteOptions}
                loading={quoteLoading}
                error={quoteError}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
