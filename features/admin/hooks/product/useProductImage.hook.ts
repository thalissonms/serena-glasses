import { useMutation } from "@tanstack/react-query";
import {
  deleteImage,
  patchImageAlt,
  reorderImages,
  uploadImage,
} from "../../services/product/productImage.service";

export function useUploadImage(productId: string) {
  return useMutation({
    mutationFn: async (file: File) => {
      return uploadImage(productId, file);
    },
  });
}

export function useDeleteImage(productId: string) {
  return useMutation({
    mutationFn: async (imageId: string) => {
      return deleteImage(productId, imageId);
    },
  });
}

export function usePatchImageAlt(productId: string) {
  return useMutation({
    mutationFn: async ({ imageId, alt }: { imageId: string; alt: string | null }) => {
      return patchImageAlt(productId, imageId, alt);
    },
  });
}

export function useReorderImages(productId: string) {
  return useMutation({
    mutationFn: async (images: { id: string; position: number }[]) => {
      return reorderImages(productId, images);
    },
  });
}
