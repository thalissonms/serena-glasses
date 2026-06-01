import { ApiError } from "../../types/error/apiError.interface";

export async function updateProductVariantStock(
  variantId: string,
  qty: number,
) {
  const res = await fetch(`/api/admin/variants/${variantId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ stock_quantity: qty }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw {
      status: res.status,
      message: data.error ?? "Erro alterar o estoque!",
    } satisfies ApiError;
  }

  return data;
}
export async function toggleProductVariantInStock(
  variantId: string,
  next: boolean,
) {
  const res = await fetch(`/api/admin/variants/${variantId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ in_stock: next }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw {
      status: res.status,
      message: data.error ?? "Erro ao atualizar disponibilidade",
    } satisfies ApiError;
  }

  return data;
}
