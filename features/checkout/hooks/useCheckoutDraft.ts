"use client";

import { useEffect, useRef } from "react";
import { useCheckoutForm } from "../providers/checkout.rhf";
import type { CheckoutFormData } from "../types/checkout.types";
import { STEP_KEYS, type CheckoutStep } from "./useCheckoutSteps";

const DRAFT_KEY = "serena.checkout-draft";

type DraftPayload = {
  identification?: Partial<CheckoutFormData["identification"]>;
  address?: Partial<CheckoutFormData["address"]>;
  paymentMethod?: CheckoutFormData["payment"]["method"];
  step?: CheckoutStep;
};

function readDraft(): DraftPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as DraftPayload) : null;
  } catch {
    return null;
  }
}

interface UseCheckoutDraftArgs {
  step?: CheckoutStep;
  onRestoreStep?: (s: CheckoutStep) => void;
}

/**
 * Persiste identificação, endereço, método de pagamento e step do checkout em sessionStorage.
 *
 * - Restaura o rascunho ao montar (apenas campos presentes — não sobrescreve com vazio).
 * - Salva automaticamente em toda mudança de RHF + sempre que `step` muda.
 * - O rascunho some quando a aba fecha (sessionStorage). Não persiste dados de cartão.
 *
 * @requires Estar dentro de `<CheckoutFormProvider>`.
 */
export function useCheckoutDraft({ step, onRestoreStep }: UseCheckoutDraftArgs = {}) {
  const { watch, setValue } = useCheckoutForm();
  const restoredRef = useRef(false);
  const onRestoreStepRef = useRef(onRestoreStep);
  onRestoreStepRef.current = onRestoreStep;

  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;

    const draft = readDraft();
    if (!draft) return;

    if (draft.identification) {
      const id = draft.identification;
      if (id.fullName) setValue("identification.fullName", id.fullName);
      if (id.cpf)      setValue("identification.cpf", id.cpf);
      if (id.email)    setValue("identification.email", id.email);
      if (id.phone)    setValue("identification.phone", id.phone);
    }
    if (draft.address) {
      const a = draft.address;
      if (a.cep)          setValue("address.cep", a.cep);
      if (a.street)       setValue("address.street", a.street);
      if (a.number)       setValue("address.number", a.number);
      if (a.complement)   setValue("address.complement", a.complement);
      if (a.neighborhood) setValue("address.neighborhood", a.neighborhood);
      if (a.city)         setValue("address.city", a.city);
      if (a.state)        setValue("address.state", a.state);
    }
    if (draft.paymentMethod) {
      setValue("payment.method", draft.paymentMethod);
    }
    if (draft.step && STEP_KEYS.includes(draft.step)) {
      onRestoreStepRef.current?.(draft.step);
    }
  }, [setValue]);

  useEffect(() => {
    const { unsubscribe } = watch((values) => {
      if (!values.identification && !values.address && !values.payment) return;
      const existing = readDraft() ?? {};
      sessionStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          ...existing,
          identification: values.identification,
          address: values.address,
          paymentMethod: values.payment?.method,
        }),
      );
    });
    return () => unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (!step) return;
    const existing = readDraft() ?? {};
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ ...existing, step }));
  }, [step]);

  return {
    clearDraft: () => sessionStorage.removeItem(DRAFT_KEY),
  };
}
