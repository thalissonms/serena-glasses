/**
 * Page: /admin/stories/new — formulário de criação de story.
 *
 * Renderiza StoryFormClient sem story inicial (modo create).
 * Usuário escolhe kind (product/manual) antes de preencher o formulário.
 *
 * Usado em: StoriesListClient → botão "Novo Story".
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import StoryFormClient from "@features/admin/components/stories/StoryFormClient";

export default async function StoryNewPage() {
  await requireAdmin("/admin/login");

  return (
    <div className="p-8">
      <StoryFormClient />
    </div>
  );
}
