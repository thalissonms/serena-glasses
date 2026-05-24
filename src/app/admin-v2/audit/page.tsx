/**
 * Page: /admin-v2/audit — SCAFFOLD de log de auditoria de ações admin.
 *
 * Server Component: sem query DB (tabela audit_logs inexistente).
 * Delega 100% ao AuditClient com dados mock estáticos.
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import { AuditClient } from "@features/admin-v2/components/audit/AuditClient";

export const dynamic = "force-dynamic";

export default async function AdminV2AuditPage() {
  await requireAdmin("/admin-v2/login");
  return <AuditClient />;
}
