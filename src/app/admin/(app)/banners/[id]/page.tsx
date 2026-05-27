/**
 * Page: /admin/banners/[id] — formulário de edição de banner existente.
 *
 * Carrega banner pelo id. notFound() se não existir.
 *
 * Usado em: BannersListClient → ação "Editar".
 */
import { notFound } from "next/navigation";
import { requireAdmin } from "@shared/lib/auth/admin";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import BannerFormClient from "@features/admin/components/banners/BannerFormClient";
import type { SiteBannerRow } from "@features/home/types/siteBanner.types";

export default async function BannerEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin("/admin/login");
  const { id } = await params;
  const supabase = getSupabaseServer();

  const { data } = await supabase
    .from("site_banners")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  return (
    <div className="p-8">
      <BannerFormClient banner={data as SiteBannerRow} />
    </div>
  );
}
