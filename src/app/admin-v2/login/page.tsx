/**
 * Page: AdminV2LoginPage — página de login do /admin-v2.
 *
 * Rota pública (listada em PUBLIC_ADMIN_PATHS no proxy.ts).
 * Redirecionar para /admin/login pois ainda usamos o auth do legacy admin.
 *
 * Usado em: entry point de auth do /admin-v2.
 */
import { redirect } from "next/navigation";

export default function AdminV2LoginPage() {
  redirect("/admin/login");
}
