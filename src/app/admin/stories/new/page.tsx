import { requireAdmin } from "@shared/lib/auth/admin";
import StoryCreateForm from "@features/admin/components/StoryCreateForm";

export default async function AdminStoryNewPage() {
  await requireAdmin();
  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-poppins font-black text-2xl text-white uppercase tracking-widest mb-8">
          Nova Story
        </h1>
        <StoryCreateForm />
      </div>
    </div>
  );
}
