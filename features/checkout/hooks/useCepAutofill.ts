"use client";
import { useCallback, useEffect, useState } from "react";
import { useWatch, useFormContext } from "react-hook-form";

type LockedField = "street" | "neighborhood" | "city" | "state";

interface CepAutofillResult {
  lockedFields: Set<LockedField>;
  loading: boolean;
  error: string | null;
  resolved: boolean;
  handleFetch: () => void;
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
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    setResolved(false);
    setLockedFields(new Set());
    setError(null);
  }, [cep]);

  const handleFetch = useCallback(() => {
    const clean = (cep ?? "").replace(/\D/g, "");
    if (clean.length !== 8) return;

    setLoading(true);
    setError(null);
    setLockedFields(new Set());

    fetch(`https://viacep.com.br/ws/${clean}/json/`)
      .then((r) => r.json())
      .then((data: ViaCepResponse) => {
        if (data.erro) {
          setError("CEP não encontrado. Preencha o endereço manualmente.");
          setResolved(true);
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
        setResolved(true);
      })
      .catch(() => {
        setError("Não foi possível buscar o CEP. Preencha o endereço manualmente.");
        setResolved(true);
      })
      .finally(() => setLoading(false));
  }, [cep, setValue]);

  return { lockedFields, loading, error, resolved, handleFetch };
}
