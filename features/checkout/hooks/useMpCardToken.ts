"use client";
import { useEffect, useRef, useState } from "react";

interface MpCardTokenParams {
  cardNumber: string;
  cardholderName: string;
  cardExpirationMonth: string;
  cardExpirationYear: string;
  securityCode: string;
  identificationType: string;
  identificationNumber: string;
}

type MpInstance = {
  createCardToken: (params: MpCardTokenParams) => Promise<{ id: string }>;
  getPaymentMethods: (params: { bin: string }) => Promise<{ results: Array<{ id: string }> }>;
};

declare global {
  interface Window {
    MercadoPago: new (publicKey: string, options?: { locale?: string }) => MpInstance;
  }
}

export function useMpCardToken() {
  const [isReady, setIsReady] = useState(false);
  const mpRef = useRef<MpInstance | null>(null);

  useEffect(() => {
    function tryInit() {
      if (typeof window !== "undefined" && window.MercadoPago && !mpRef.current) {
        mpRef.current = new window.MercadoPago(
          process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!,
          { locale: "pt-BR" },
        );
        setIsReady(true);
      }
    }

    if (typeof window !== "undefined" && window.MercadoPago) {
      tryInit();
    } else {
      const interval = setInterval(() => {
        if (typeof window !== "undefined" && window.MercadoPago) {
          tryInit();
          clearInterval(interval);
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, []);

  async function createCardToken(params: MpCardTokenParams): Promise<{ token: string; paymentMethodId: string }> {
    if (!mpRef.current) throw new Error("Serviço de pagamento não disponível. Recarregue a página.");

    const bin = params.cardNumber.replace(/\s/g, "").slice(0, 6);
    const methodsRes = await mpRef.current.getPaymentMethods({ bin });
    const paymentMethodId = methodsRes?.results?.[0]?.id;
    if (!paymentMethodId) throw new Error("Bandeira do cartão não reconhecida.");

    const result = await mpRef.current.createCardToken(params);
    if (!result?.id) throw new Error("Não foi possível tokenizar o cartão.");

    return { token: result.id, paymentMethodId };
  }

  return { isReady, createCardToken };
}
