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
import type { ShippingQuoteOption } from "@shared/lib/melhor-envio/types";

const STATE_OPTIONS = Object.values(BrazilianState).map((s) => ({ value: s, label: s }));

export function AddressModule() {
  const { t } = useTranslation("checkout");
  const { control } = useCheckoutForm();
  const cep = useWatch({ control, name: "address.cep" }) as string;
  const items = useCartStore((s) => s.items);
  const setSelectedShipping = useCartStore((s) => s.setSelectedShipping);

  const [quoteOptions, setQuoteOptions] = useState<ShippingQuoteOption[]>([]);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  // Stable serialization of items — Zustand array ref changes on every render even with same
  // content, which would fire a new quote request on each keystroke in unrelated fields
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
            // Auto-seleciona se só houver uma opção
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

        <ShippingOptions
          options={quoteOptions}
          loading={quoteLoading}
          error={quoteError}
        />
      </div>
    </div>
  );
}
