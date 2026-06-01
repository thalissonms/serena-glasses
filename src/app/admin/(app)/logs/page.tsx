/**
 * Page: /admin/logs — SCAFFOLD tabela de error_logs com filtros de tipo e data.
 *
 * Server Component: busca os últimos 200 registros de error_logs ordenados por created_at DESC.
 * Filtragem client-side via LogsClient.
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { LogsClient } from "@features/admin/components/logs/LogsClient";
import type { ErrorLog } from "@features/admin/components/logs/LogsClient";

export const dynamic = "force-dynamic";

export default async function AdminV2LogsPage() {
  await requireAdmin("/admin/login");

  const supabase = getSupabaseServer();

  const { data: raw } = await supabase
    .from("error_logs")
    .select("id, created_at, event_type, error_message, payload")
    .order("created_at", { ascending: false })
    .limit(200);

  const logs: ErrorLog[] = (raw ?? []).map((r) => ({
    id: r.id,
    created_at: r.created_at ?? "",
    event_type: r.event_type ?? "system",
    error_message: r.error_message ?? null,
    payload: (r.payload as Record<string, unknown> | null) ?? null,
  }));

  const eventTypes = Array.from(new Set(logs.map((l) => l.event_type))).sort();

  return <LogsClient logs={logs} eventTypes={eventTypes} />;
}
