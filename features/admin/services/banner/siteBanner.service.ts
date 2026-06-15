import type { ApiError } from "../../types/error/apiError.interface";
import type { SiteBannerCreateInput, SiteBannerPatchInput } from "../../schemas/siteBanner.schema";

export async function deleteSiteBanner(id: string): Promise<void> {
  const res = await fetch(`/api/admin/site-banners/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw {
      status: res.status,
      message: json.error ?? "Erro ao deletar banner",
    } satisfies ApiError;
  }
}

export async function createSiteBanner(payload: SiteBannerCreateInput): Promise<void> {
  const res = await fetch("/api/admin/site-banners", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw {
      status: res.status,
      message: json.error ?? "Erro ao criar banner",
    } satisfies ApiError;
  }
}

export async function updateSiteBanner(id: string, payload: SiteBannerPatchInput): Promise<void> {
  const res = await fetch(`/api/admin/site-banners/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw {
      status: res.status,
      message: json.error ?? "Erro ao atualizar banner",
    } satisfies ApiError;
  }
}
