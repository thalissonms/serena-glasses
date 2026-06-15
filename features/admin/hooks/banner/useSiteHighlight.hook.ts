import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSiteHighlight,
  updateSiteHighlight,
  uploadSiteHighlightImage,
} from "../../services/banner/siteHighlight.service";
import { ApiError } from "../../types/error/apiError.interface";

export function useSiteHighlight() {
  return useQuery({
    queryKey: ["admin", "site-highlight"],
    queryFn: getSiteHighlight,
  });
}

export function useUpdateSiteHighlight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSiteHighlight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "site-highlight"] });
    },
  });
}

export function useUploadSiteHighlightImage() {
  return useMutation<
    { url: string; path: string },
    ApiError,
    { file: File; onProgress?: (percent: number) => void }
  >({
    mutationFn: ({ file, onProgress }) => uploadSiteHighlightImage(file, onProgress),
  });
}
