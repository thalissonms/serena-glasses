import { redirect } from "next/navigation";
import { creategetSupabaseServerAuthClient } from "@shared/lib/supabase/server-auth";

/**
 * Lista de e-mails admin (server-only).
 * Configurar via env: ADMIN_EMAILS=email1@x.com,email2@x.com
 */
function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = getAdminEmails();
  if (list.length === 0) return false;
  return list.includes(email.toLowerCase());
}

export type AdminUser = { id: string; email: string };

/**
 * API Routes â€” valida session via cookie e checa allowlist.
 * Retorna null se nÃ£o autorizado (route handler retorna 401).
 */
export async function getAdminFromCookies(): Promise<AdminUser | null> {
  const supabase = await creategetSupabaseServer()AuthClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email || !isAdminEmail(user.email)) return null;

  return { id: user.id, email: user.email };
}

/**
 * Server Components â€” valida cookie de session e checa allowlist.
 * Redireciona pra /admin/login se nÃ£o autorizado.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdminFromCookies();
  if (!admin) redirect("/admin/login");
  return admin;
}
