/**
 * Page: /admin/stories/[id] — formulário de edição de story existente.
 *
 * Carrega story pelo id. notFound() se não existir.
 * Passa story para StoryFormClient que adapta o formulário ao kind (product/manual).
 *
 * Usado em: StoriesListClient → ação "Editar".
 */
import { notFound } from "next/navigation";
import { requireAdmin } from "@shared/lib/auth/admin";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import StoryFormClient from "@features/admin/components/stories/StoryFormClient";
import type { HomeStoryRow } from "@features/home/types/homeStory.types";

export default async function StoryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin("/admin/login");
  const { id } = await params;
  const supabase = getSupabaseServer();

  const { data } = await supabase
    .from("home_stories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  return (
    <div className="p-8">
      <StoryFormClient story={data as HomeStoryRow} />
    </div>
  );
}
