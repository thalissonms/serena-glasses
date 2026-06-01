import type { ApiError } from "../../types/error/apiError.interface";

export async function saveVideoUrl(productId: string, url: string) {
  const res = await fetch(`/api/admin/products/${productId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ video_url: url }),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw {
      status: res.status,
      message: json.error ?? "URL inválida ou erro ao salvar",
    } satisfies ApiError;
  }

  return json;
}

export async function deleteVideo(productId: string) {
  const res = await fetch(`/api/admin/products/${productId}/video`, {
    method: "DELETE",
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw {
      status: res.status,
      message: json.error ?? "Erro ao remover vídeo",
    } satisfies ApiError;
  }

  return json;
}
