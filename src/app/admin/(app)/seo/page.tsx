/**
 * Page: /admin/seo — SCAFFOLD de ferramentas SEO/sitemap/robots/redirects.
 *
 * Server Component: sem query DB. Sitemap e robots gerados via App Router.
 * Delega 100% ao SeoClient.
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import { SeoClient } from "@features/admin/components/seo/SeoClient";

export const dynamic = "force-dynamic";

export default async function AdminV2SeoPage() {
  await requireAdmin("/admin/login");
  return <SeoClient />;
}
