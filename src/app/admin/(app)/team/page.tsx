/**
 * Page: /admin/team — SCAFFOLD de gerenciamento de equipe admin.
 *
 * Server Component: busca profiles WHERE role='admin'. Read-only.
 * Tenta enriquecer com email via tabela users (join por id).
 * RBAC granular e convites em desenvolvimento.
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { TeamClient } from "@features/admin/components/team/TeamClient";
import type { AdminProfile } from "@features/admin/components/team/TeamClient";

export const dynamic = "force-dynamic";

export default async function AdminV2TeamPage() {
  await requireAdmin("/admin/login");

  const supabase = getSupabaseServer();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, role, full_name, created_at")
    .eq("role", "admin")
    .order("created_at", { ascending: false })
    .limit(50);

  const ids = (profiles ?? []).map((p) => p.id);
  const { data: users } =
    ids.length > 0
      ? await supabase
          .from("users")
          .select("id, email")
          .in("id", ids)
      : { data: [] };

  const emailById: Record<string, string> = {};
  for (const u of users ?? []) {
    if (u.id && u.email) emailById[u.id] = u.email;
  }

  const admins: AdminProfile[] = (profiles ?? []).map((p) => ({
    id: p.id,
    email: emailById[p.id] ?? null,
    full_name: p.full_name ?? null,
    role: p.role ?? "admin",
    created_at: p.created_at ?? null,
  }));

  return <TeamClient admins={admins} />;
}
