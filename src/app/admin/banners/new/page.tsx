import { requireAdmin } from "@shared/lib/auth/admin";
import BannerCreateForm from "@features/admin/components/BannerCreateForm";

export default async function AdminBannerNewPage() {
  await requireAdmin();
  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-poppins font-black text-2xl text-white uppercase tracking-widest mb-8">
          Novo Banner
        </h1>
        <BannerCreateForm />
      </div>
    </div>
  );
}
