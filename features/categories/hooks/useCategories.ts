"use client";
import { useQuery } from "@tanstack/react-query";
import type { CategoryWithSubs } from "@features/categories/types/category.types";

export function useCategories() {
  return useQuery<CategoryWithSubs[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const json = await res.json();
      return json.items as CategoryWithSubs[];
    },
    staleTime: 5 * 60_000,
  });
}
