import { useMutation } from "@tanstack/react-query";
import { deleteSiteBanner, createSiteBanner, updateSiteBanner } from "../../services/banner/siteBanner.service";
import type { ApiError } from "../../types/error/apiError.interface";
import type { SiteBannerCreateInput, SiteBannerPatchInput } from "../../schemas/siteBanner.schema";

export function useDeleteSiteBanner() {
  return useMutation<void, ApiError, string>({
    mutationFn: deleteSiteBanner,
  });
}

export function useCreateSiteBanner() {
  return useMutation<void, ApiError, SiteBannerCreateInput>({
    mutationFn: createSiteBanner,
  });
}

export function useUpdateSiteBanner() {
  return useMutation<void, ApiError, { id: string; payload: SiteBannerPatchInput }>({
    mutationFn: ({ id, payload }) => updateSiteBanner(id, payload),
  });
}
