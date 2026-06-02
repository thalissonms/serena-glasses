import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createHomeSection,
  updateHomeSection,
  deleteHomeSection,
  reorderHomeSections,
} from "../../services/homeSection.service";
import { HomeSectionUpdateInput } from "../../types/homeSection/homeSection.types";

export function useCreateHomeSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createHomeSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "home-sections"] });
    },
  });
}

export function useUpdateHomeSection(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: HomeSectionUpdateInput) => updateHomeSection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "home-sections"] });
    },
  });
}

export function useDeleteHomeSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteHomeSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "home-sections"] });
    },
  });
}

export function useReorderHomeSections() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reorderHomeSections,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "home-sections"] });
    },
  });
}

export function useToggleHomeSectionActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      updateHomeSection(id, { active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "home-sections"] });
    },
  });
}
