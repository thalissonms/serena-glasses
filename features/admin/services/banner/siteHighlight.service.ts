/**
 * Service: siteHighlight — CRUD do highlight promocional (admin).
 *
 * Client-side. Faz fetch/put em /api/admin/site-highlight + upload via XHR com progress.
 *
 * Usado em: SiteHightlight (admin/banners).
 */
import type { ApiError } from "../../types/error/apiError.interface";

export interface SiteHighlightData {
  id: number;
  image_url_light: string;
  image_url_dark: string;
  position: number;
  updated_at: string;
}

export async function getSiteHighlight(): Promise<SiteHighlightData | null> {
  const res = await fetch("/api/admin/site-highlight");
  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw {
      status: res.status,
      message: json?.error ?? "Erro ao buscar destaque",
    } satisfies ApiError;
  }

  return json;
}

export async function updateSiteHighlight(data: {
  image_url_light: string;
  image_url_dark: string;
  position: number;
}): Promise<SiteHighlightData> {
  const res = await fetch("/api/admin/site-highlight", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw {
      status: res.status,
      message: json?.error ?? "Erro ao salvar destaque",
    } satisfies ApiError;
  }

  return json;
}

export function uploadSiteHighlightImage(
  file: File,
  onProgress?: (percent: number) => void
): Promise<{ url: string; path: string }> {
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    fd.append("file", file);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      const body = JSON.parse(xhr.responseText || "{}") as { url?: string; path?: string; error?: string };
      if (xhr.status === 201 && body.url && body.path) {
        resolve({ url: body.url, path: body.path });
      } else {
        reject({
          status: xhr.status,
          message: body.error ?? "Falha no upload da imagem",
        } satisfies ApiError);
      }
    });

    xhr.addEventListener("error", () => {
      reject({
        status: 0,
        message: "Erro de rede no upload da imagem",
      } satisfies ApiError);
    });

    xhr.open("POST", "/api/admin/site-highlight/upload");
    xhr.send(fd);
  });
}
