/**
 * Page: /admin/banners/new — formulário de criação de banner.
 *
 * Renderiza BannerFormClient sem banner inicial (modo create).
 *
 * Usado em: BannersListClient → botão "Novo Banner".
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import BannerFormClient from "@features/admin/components/banners/BannerFormClient";

export default async function BannerNewPage() {
  await requireAdmin("/admin/login");

  return (
    <div className="p-8">
      <BannerFormClient />
    </div>
  );
}
