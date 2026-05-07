import { requireAdmin } from "@shared/lib/auth/admin";
import { supabaseServer } from "@shared/lib/supabase/server";
import { notFound } from "next/navigation";
import BannerEditForm from "@features/admin/components/BannerEditForm";
import type { SiteBannerRow } from "@features/home/types/siteBanner.types";

export default async function AdminBannerEditPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const { data } = await supabaseServer
    .from("site_banners")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-poppins font-black text-2xl text-white uppercase tracking-widest mb-8">
          Editar Banner
        </h1>
        <BannerEditForm banner={data as SiteBannerRow} />
      </div>
    </div>
  );
}
