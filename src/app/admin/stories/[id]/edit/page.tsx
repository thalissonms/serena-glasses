import { requireAdmin } from "@shared/lib/auth/admin";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { notFound } from "next/navigation";
import StoryEditForm from "@features/admin/components/StoryEditForm";
import type { HomeStoryRow } from "@features/home/types/homeStory.types";

export default async function AdminStoryEditPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const { data } = await getSupabaseServer()
    .from("home_stories")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-poppins font-black text-2xl text-white uppercase tracking-widest mb-8">
          Editar Story
        </h1>
        <StoryEditForm story={data as HomeStoryRow} />
      </div>
    </div>
  );
}
