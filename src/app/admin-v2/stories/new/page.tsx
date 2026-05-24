/**
 * Page: /admin-v2/stories/new — formulário de criação de story.
 *
 * Renderiza StoryFormClient sem story inicial (modo create).
 * Usuário escolhe kind (product/manual) antes de preencher o formulário.
 *
 * Usado em: StoriesListClient → botão "Novo Story".
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import StoryFormClient from "@features/admin-v2/components/stories/StoryFormClient";

export default async function StoryNewPage() {
  await requireAdmin("/admin-v2/login");

  return (
    <div className="p-8">
      <StoryFormClient />
    </div>
  );
}
