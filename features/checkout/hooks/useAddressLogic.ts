"use client";

import { useEffect, useMemo, useState } from "react";
import { useWatch } from "react-hook-form";

import { useCheckoutForm } from "../providers/checkout.rhf";
import { useCartStore } from "@features/cart/store/cart.store";
import { useCepAutofill } from "./useCepAutofill";

import type { ShippingQuoteOption } from "@shared/lib/melhor-envio/types";

export function useAddressLogic() {
  const { control } = useCheckoutForm();

  const cep = useWatch({
    control,
    name: "address.cep",
  }) as string;

  const street = useWatch({
    control,
    name: "address.street",
  }) as string;

  const neighborhood = useWatch({
    control,
    name: "address.neighborhood",
  }) as string;

  const city = useWatch({
    control,
    name: "address.city",
  }) as string;

  const state = useWatch({
    control,
    name: "address.state",
  }) as string;

  const number = useWatch({
    control,
    name: "address.number",
  }) as string;



  const items = useCartStore((s) => s.items);

  const setSelectedShipping = useCartStore(
    (s) => s.setSelectedShipping,
  );



  const {
    lockedFields,
    loading: cepLoading,
    error: cepError,
    resolved,
    handleFetch,
  } = useCepAutofill();



  const [quoteOptions, setQuoteOptions] = useState<
    ShippingQuoteOption[]
  >([]);

  const [quoteLoading, setQuoteLoading] = useState(false);

  const [quoteError, setQuoteError] = useState<string | null>(
    null,
  );



  const cleanCep = useMemo(() => {
    return (cep ?? "").replace(/\D/g, "");
  }, [cep]);

  const itemsKey = useMemo(() => {
    return JSON.stringify(
      items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    );
  }, [items]);



  const canSearch =
    cleanCep.length === 8 && !cepLoading;

  const showAddressBody =
    resolved || Boolean(street);

  const showStreetInput =
    showAddressBody &&
    !lockedFields.has("street") &&
    !street;

  const showNeighborhoodInput =
    showAddressBody &&
    !lockedFields.has("neighborhood") &&
    !neighborhood;

  const showCityInput =
    showAddressBody &&
    !lockedFields.has("city") &&
    !city;

  const showStateInput =
    showAddressBody &&
    !lockedFields.has("state") &&
    !state;


  useEffect(() => {
    if (cleanCep.length !== 8 || items.length === 0) {
      setQuoteOptions([]);
      setQuoteError(null);
      setSelectedShipping(null);

      return;
    }

    let cancelled = false;

    setQuoteError(null);

    const timerId = setTimeout(async () => {
      try {
        setQuoteLoading(true);

        const response = await fetch(
          "/api/checkout/shipping/quote",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              cep: cleanCep,
              items: items.map((item) => ({
                variantId: item.variantId,
                quantity: item.quantity,
              })),
            }),
          },
        );

        const data: {
          options?: ShippingQuoteOption[];
          error?: string;
        } = await response.json();

        if (cancelled) return;

        if (data.error) {
          setQuoteError(data.error);
          setQuoteOptions([]);
          setSelectedShipping(null);

          return;
        }

        const options = data.options ?? [];

        setQuoteOptions(options);

        if (options.length === 1) {
          setSelectedShipping(options[0]);
        } else {
          setSelectedShipping(null);
        }
      } catch {
        if (!cancelled) {
          setQuoteError(
            "Erro ao calcular frete. Tente novamente.",
          );

          setQuoteOptions([]);
          setSelectedShipping(null);
        }
      } finally {
        if (!cancelled) {
          setQuoteLoading(false);
        }
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timerId);
    };
  }, [
    cleanCep,
    items,
    itemsKey,
    setSelectedShipping,
  ]);

  return {
    cep,
    street,
    neighborhood,
    city,
    state,
    number,
    cepLoading,
    cepError,
    resolved,
    handleFetch,
    lockedFields,
    quoteOptions,
    quoteLoading,
    quoteError,
    cleanCep,
    canSearch,
    showAddressBody,
    showStreetInput,
    showNeighborhoodInput,
    showCityInput,
    showStateInput,
  };
}