import { getSupabaseServer } from "@shared/lib/supabase/server";
import type { HomeStoryRow } from "@features/home/types/homeStory.types";

export async function getHomeStoriesList(): Promise<HomeStoryRow[]> {
  const { data, error } = await getSupabaseServer()
    .from("home_stories")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as HomeStoryRow[];
}
