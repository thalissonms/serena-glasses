import { useMutation } from "@tanstack/react-query";
import { deleteVideo, saveVideoUrl } from "../../services/product/productVideo.service";

export function useSaveVideoUrl(productId: string) {
  return useMutation({
    mutationFn: async (url: string) => {
      return saveVideoUrl(productId, url);
    },
  });
}

export function useDeleteVideo(productId: string) {
  return useMutation({
    mutationFn: async () => {
      return deleteVideo(productId);
    },
  });
}
