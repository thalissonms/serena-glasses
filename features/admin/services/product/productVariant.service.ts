/**
 * Service: productVariant — criação e exclusão de variantes de produto (client-side).
 *
 * addVariant → POST /api/admin/products/:id/variants.
 * deleteVariant → DELETE /api/admin/variants/:id.
 * Ambas lançam ApiError se !res.ok.
 *
 * Usado em: useProductVariant.hook.ts.
 */
import type { ApiError } from "../../types/error/apiError.interface";
import type { VariantAddData } from "../../types/product/productVariantAdd.type";

export interface VariantCreatedData {
  id: string;
  color_name: string;
  color_hex: string;
  in_stock: boolean;
}

export async function addVariant(
  productId: string,
  data: VariantAddData,
): Promise<VariantCreatedData> {
  const res = await fetch(`/api/admin/products/${productId}/variants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw {
      status: res.status,
      message: json.error ?? "Erro ao adicionar variante",
    } satisfies ApiError;
  }

  return json as VariantCreatedData;
}

export async function deleteVariant(variantId: string) {
  const res = await fetch(`/api/admin/variants/${variantId}`, {
    method: "DELETE",
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw {
      status: res.status,
      message: json.error ?? "Erro ao excluir variante",
    } satisfies ApiError;
  }

  return json;
}
