"use client";
import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BrazilianState } from "@shared/location/location.enum";
import { SectionHeader } from "./SectionHeader";
import { RHFTextInput, RHFCEPInput, RHFSelectInput } from "@shared/components/forms";
import { ShippingOptions } from "./ShippingOptions";
import { useCartStore } from "@features/cart/store/cart.store";
import { useCheckoutForm } from "../providers/checkout.rhf";
import { useCepAutofill } from "../hooks/useCepAutofill";
import type { ShippingQuoteOption } from "@shared/lib/melhor-envio/types";

const STATE_OPTIONS = Object.values(BrazilianState).map((s) => ({ value: s, label: s }));

export function AddressModule() {
  const { t } = useTranslation("checkout");
  const { control } = useCheckoutForm();
  const cep = useWatch({ control, name: "address.cep" }) as string;
  const items = useCartStore((s) => s.items);
  const setSelectedShipping = useCartStore((s) => s.setSelectedShipping);
  const { lockedFields, loading: cepLoading, error: cepError, resolved, handleFetch } = useCepAutofill();

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
          items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
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
    <div className="bg-white dark:bg-[#1a1a1a] border-2 border-black dark:border-brand-pink shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#FF00B6] p-6 transition-colors">
      <SectionHeader step={2} title={t("address.title")} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <RHFCEPInput name="address.cep" label={t("address.cep")} required />
        <div className="flex items-end">
          <button
            type="button"
            onClick={handleFetch}
            disabled={!canSearch}
            className="w-full h-[42px] border-2 border-black dark:border-brand-pink bg-black dark:bg-brand-pink text-white dark:text-black font-bold text-sm shadow-[2px_2px_0_#FF00B6] dark:shadow-[2px_2px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[2px_2px_0_#FF00B6] dark:disabled:hover:shadow-[2px_2px_0_#000]"
          >
            {cepLoading ? t("address.searching") : t("address.searchCep")}
          </button>
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
              className="sm:col-span-2"
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
              options={[{ value: "", label: t("address.statePlaceholder") }, ...STATE_OPTIONS]}
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
