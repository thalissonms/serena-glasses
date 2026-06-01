import { useQuery } from "@tanstack/react-query";
import type { HomeStory } from "@features/home/types/homeStory.types";

async function fetchHomeStories(lang: string): Promise<HomeStory[]> {
  const res = await fetch(`/api/home/stories?lang=${lang}`);
  if (!res.ok) throw new Error("Failed to fetch stories");
  return res.json();
}

export function useHomeStories(lang = "pt") {
  return useQuery<HomeStory[]>({
    queryKey: ["home-stories", lang],
    queryFn: () => fetchHomeStories(lang),
    staleTime: 5 * 60_000,
  });
}
