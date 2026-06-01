"use client";

import { useQuery } from "@tanstack/react-query";
import type { SearchResult, SearchFilters, SearchFacets } from "../types/search.types";

async function fetchSearch(q: string, filters: SearchFilters): Promise<SearchResult[]> {
  const params = new URLSearchParams({ q });
  if (filters.subcategory) params.set("subcategory", filters.subcategory);
  if (filters.shape) params.set("shape", filters.shape);
  if (filters.color) params.set("color", filters.color);
  const res = await fetch(`/api/search?${params.toString()}`);
  if (!res.ok) return [];
  return res.json();
}

async function fetchFacets(): Promise<SearchFacets> {
  const res = await fetch("/api/search/facets");
  if (!res.ok) return { subcategories: [], shapes: [], colors: [] };
  return res.json();
}

export function useSearch(q: string, filters: SearchFilters = {}) {
  return useQuery({
    queryKey: ["search", q, filters],
    queryFn: () => fetchSearch(q, filters),
    enabled: q.length >= 2,
    staleTime: 30_000,
    placeholderData: [],
  });
}

export function useSearchFacets() {
  return useQuery({
    queryKey: ["search-facets"],
    queryFn: fetchFacets,
    staleTime: 5 * 60_000,
  });
}
