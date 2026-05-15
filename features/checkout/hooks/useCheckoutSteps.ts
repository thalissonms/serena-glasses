"use client";
import { useCallback, useMemo, useState } from "react";
import { useCheckoutForm } from "../providers/checkout.rhf";
import { PaymentMethod } from "../enums/checkout.enum";

export const STEP_KEYS = [
  "address",
  "identification",
  "payment",
  "coupon",
  "installments",
  "review",
] as const;

export type CheckoutStep = (typeof STEP_KEYS)[number];

interface UseCheckoutStepsArgs {
  maxInstallments: number;
  initialStep?: CheckoutStep;
}

function shouldSkip(
  step: CheckoutStep,
  paymentMethod: PaymentMethod | undefined,
  maxInstallments: number,
): boolean {
  if (step === "installments") {
    return paymentMethod !== PaymentMethod.Card || maxInstallments <= 1;
  }
  return false;
}

export type StepDirection = 1 | -1;

export function useCheckoutSteps({
  maxInstallments,
  initialStep = "address",
}: UseCheckoutStepsArgs) {
  const { watch } = useCheckoutForm();
  const paymentMethod = watch("payment.method") as PaymentMethod | undefined;
  const [step, setStep] = useState<CheckoutStep>(initialStep);
  const [direction, setDirection] = useState<StepDirection>(1);

  const activeSteps = useMemo(
    () =>
      STEP_KEYS.filter(
        (s) => !shouldSkip(s, paymentMethod, maxInstallments),
      ),
    [paymentMethod, maxInstallments],
  );

  const currentIndex = activeSteps.indexOf(step);
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex === activeSteps.length - 1;

  const goNext = useCallback(() => {
    setDirection(1);
    setStep((curr) => {
      const list = STEP_KEYS.filter(
        (s) => !shouldSkip(s, paymentMethod, maxInstallments),
      );
      const i = list.indexOf(curr);
      return i < list.length - 1 ? list[i + 1] : curr;
    });
  }, [paymentMethod, maxInstallments]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setStep((curr) => {
      const list = STEP_KEYS.filter(
        (s) => !shouldSkip(s, paymentMethod, maxInstallments),
      );
      const i = list.indexOf(curr);
      return i > 0 ? list[i - 1] : curr;
    });
  }, [paymentMethod, maxInstallments]);

  const goTo = useCallback(
    (target: CheckoutStep) => {
      setDirection((curr) => {
        const fromIdx = activeSteps.indexOf(step);
        const toIdx = activeSteps.indexOf(target);
        if (fromIdx === -1 || toIdx === -1) return curr;
        return toIdx >= fromIdx ? 1 : -1;
      });
      setStep(target);
    },
    [activeSteps, step],
  );

  return {
    step,
    direction,
    activeSteps,
    currentIndex,
    totalSteps: activeSteps.length,
    isFirst,
    isLast,
    goNext,
    goPrev,
    goTo,
  };
}
