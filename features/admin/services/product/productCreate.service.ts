import type { ApiError } from "../../types/error/apiError.interface";
import type { MappedCreatePayload } from "../../mappers/productCreate.mapper";

export interface CreateProductResponse {
  id: string;
  code: string;
}

export async function createProduct({
  postPayload,
  patchPayload,
}: MappedCreatePayload): Promise<CreateProductResponse> {
  const res = await fetch("/api/admin/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postPayload),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw {
      status: res.status,
      message: json.error ?? "Erro ao criar produto",
    } satisfies ApiError;
  }

  const { id, code } = json;

  if (Object.keys(patchPayload).length > 0) {
    const patchRes = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patchPayload),
    });

    if (!patchRes.ok) {
      // Optamos por não falhar a promise principal se o PATCH falhar, mas logamos
      console.warn("Falha ao salvar dados adicionais do produto no PATCH", await patchRes.text());
    }
  }

  return { id, code };
}
