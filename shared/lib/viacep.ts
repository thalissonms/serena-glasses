interface ViaCepResult {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

const cache = new Map<string, { value: ViaCepResult | null; expiresAt: number }>();
const TTL = 60 * 60 * 1000;

export async function lookupCep(cep: string): Promise<ViaCepResult | null> {
  const clean = cep.replace(/\D/g, "");
  if (clean.length !== 8) return null;

  const hit = cache.get(clean);
  if (hit && Date.now() < hit.expiresAt) return hit.value;

  try {
    const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
    if (!res.ok) {
      cache.set(clean, { value: null, expiresAt: Date.now() + TTL });
      return null;
    }
    const data = await res.json();
    if (data.erro) {
      cache.set(clean, { value: null, expiresAt: Date.now() + TTL });
      return null;
    }
    const result: ViaCepResult = {
      street: (data.logradouro as string) ?? "",
      neighborhood: (data.bairro as string) ?? "",
      city: (data.localidade as string) ?? "",
      state: (data.uf as string) ?? "",
    };
    cache.set(clean, { value: result, expiresAt: Date.now() + TTL });
    return result;
  } catch {
    cache.set(clean, { value: null, expiresAt: Date.now() + TTL });
    return null;
  }
}
