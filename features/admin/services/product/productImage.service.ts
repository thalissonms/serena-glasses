import type { ApiError } from "../../types/error/apiError.interface";
import type { ProductImageInterface } from "../../types/product/productImage.interface";

export async function uploadImage(
  productId: string,
  file: File,
): Promise<ProductImageInterface> {
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(`/api/admin/products/${productId}/images`, {
    method: "POST",
    body: fd,
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw {
      status: res.status,
      message: json.error ?? `Erro ao enviar ${file.name}`,
    } satisfies ApiError;
  }

  return json as ProductImageInterface;
}

export async function deleteImage(productId: string, imageId: string) {
  const res = await fetch(
    `/api/admin/products/${productId}/images/${imageId}`,
    { method: "DELETE" },
  );

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw {
      status: res.status,
      message: json.error ?? "Erro ao excluir imagem",
    } satisfies ApiError;
  }

  return json;
}

export async function patchImageAlt(
  productId: string,
  imageId: string,
  alt: string | null,
) {
  const res = await fetch(
    `/api/admin/products/${productId}/images/${imageId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alt }),
    },
  );

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw {
      status: res.status,
      message: json.error ?? "Erro ao salvar alt",
    } satisfies ApiError;
  }

  return json;
}

export async function reorderImages(
  productId: string,
  images: { id: string; position: number }[],
) {
  await Promise.all(
    images.map((img) =>
      fetch(`/api/admin/products/${productId}/images/${img.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ position: img.position }),
      }),
    ),
  );
}
