import { ProductPatchInput } from "../../schemas/product/payload/productEdit.schema";
import { ApiError } from "../../types/error/apiError.interface";

export async function updateProduct(
  productId: string,
  payload: ProductPatchInput,
) {
  const res = await fetch(`/api/admin/products/${productId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw {
      status: res.status,
      message: data.error ?? "Erro ao atualizar produto",
    } satisfies ApiError;
  }

  return data;
}
