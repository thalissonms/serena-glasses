/**
 * Layout: AdminV2Layout — root layout do /admin.
 *
 * Envolve todas as rotas em AdminV2Shell (sidebar + topbar).
 * Auth é enforçada por página via requireAdmin(). Login é rota pública.
 *
 * Usado em: todas as rotas /admin/*.
 */
import { type ReactNode } from "react";
import AdminV2Shell from "@features/admin/components/layout/AdminV2Shell";
import { AdminV2Toaster } from "@features/admin/components/primitives/Toast";

export default function AdminV2Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <AdminV2Shell>{children}</AdminV2Shell>
      <AdminV2Toaster />
    </>
  );
}
