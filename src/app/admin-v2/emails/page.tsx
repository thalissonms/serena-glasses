/**
 * Page: /admin-v2/emails — SCAFFOLD de templates de e-mail transacional.
 *
 * Server Component: sem query DB. Delega 100% ao EmailsClient com lista hardcoded.
 * Templates em features/emails/templates/orderTemplates.ts são funções TypeScript —
 * não há filesystem glob disponível no App Router, portanto a lista é estática.
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import { EmailsClient } from "@features/admin-v2/components/emails/EmailsClient";

export const dynamic = "force-dynamic";

export default async function AdminV2EmailsPage() {
  await requireAdmin("/admin-v2/login");
  return <EmailsClient />;
}
