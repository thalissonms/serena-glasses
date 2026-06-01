/**
 * Service: productSeo — atualização dos dados de SEO do produto (client-side).
 *
 * updateSeo → PATCH /api/admin/products/:id com campos seo_*.
 * Lança ApiError se !res.ok.
 *
 * Usado em: useProductSeo.hook.ts.
 */
import type { ApiError } from "../../types/error/apiError.interface";

export interface SeoPayload {
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string[] | null;
}

export async function updateSeo(productId: string, payload: SeoPayload) {
  const res = await fetch(`/api/admin/products/${productId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw {
      status: res.status,
      message: json.error ?? "Erro ao salvar SEO",
    } satisfies ApiError;
  }

  return json;
}
