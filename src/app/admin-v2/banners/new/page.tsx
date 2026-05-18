/**
 * Page: /admin-v2/banners/new — formulário de criação de banner.
 *
 * Renderiza BannerFormClient sem banner inicial (modo create).
 *
 * Usado em: BannersListClient → botão "Novo Banner".
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import BannerFormClient from "@features/admin-v2/components/banners/BannerFormClient";

export default async function BannerNewPage() {
  await requireAdmin();

  return (
    <div className="p-8">
      <BannerFormClient />
    </div>
  );
}
