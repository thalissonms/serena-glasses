"use client";
import { useEffect, useState } from "react";
import { useWatch, useFormContext } from "react-hook-form";

type LockedField = "street" | "neighborhood" | "city" | "state";

interface CepAutofillResult {
  lockedFields: Set<LockedField>;
  loading: boolean;
  error: string | null;
}

interface ViaCepResponse {
  erro?: boolean;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
}

export function useCepAutofill(): CepAutofillResult {
  const { control, setValue } = useFormContext();
  const cep = useWatch({ control, name: "address.cep" }) as string;

  const [lockedFields, setLockedFields] = useState<Set<LockedField>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const clean = (cep ?? "").replace(/\D/g, "");

    if (clean.length !== 8) {
      setLockedFields(new Set());
      setError(null);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    setError(null);
    setLockedFields(new Set());

    const timerId = setTimeout(() => {
      setLoading(true);

      fetch(`https://viacep.com.br/ws/${clean}/json/`, { signal: controller.signal })
        .then((r) => r.json())
        .then((data: ViaCepResponse) => {
          if (cancelled) return;
          if (data.erro) {
            setLockedFields(new Set());
            return;
          }

          const locked = new Set<LockedField>();
          const fields: Array<[LockedField, string | undefined]> = [
            ["street", data.logradouro],
            ["neighborhood", data.bairro],
            ["city", data.localidade],
            ["state", data.uf],
          ];

          for (const [field, value] of fields) {
            if (value) {
              setValue(`address.${field}`, value, { shouldValidate: true });
              locked.add(field);
            }
          }

          setLockedFields(locked);
        })
        .catch((err) => {
          if (cancelled || (err as Error)?.name === "AbortError") return;
          setLockedFields(new Set());
          setError("Não foi possível buscar o CEP. Preencha o endereço manualmente.");
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timerId);
      controller.abort();
    };
  }, [cep, setValue]);

  return { lockedFields, loading, error };
}
