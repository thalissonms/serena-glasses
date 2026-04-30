"use client";
import { type ReactNode } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { buildCheckoutSchema } from "../schemas/checkout.schemas";
import type { CheckoutFormData } from "../types/checkout.types";
import { PaymentMethod } from "../enums/checkout.enum";

const DEFAULT_VALUES: CheckoutFormData = {
  identification: {
    fullName: "",
    cpf: "",
    birthDate: "",
    email: "",
    phone: "",
  },
  address: {
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "" as any,
  },
  payment: {
    method: PaymentMethod.Card,
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
    installments: "1",
  },
};

export function useCheckoutForm() {
  return useFormContext<CheckoutFormData>();
}

interface CheckoutFormProviderProps {
  children: ReactNode;
}

export function CheckoutFormProvider({ children }: CheckoutFormProviderProps) {
  const { t } = useTranslation("checkout");

  const methods = useForm<CheckoutFormData>({
    resolver: zodResolver(buildCheckoutSchema(t)),
    defaultValues: DEFAULT_VALUES,
    mode: "onBlur",
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}
