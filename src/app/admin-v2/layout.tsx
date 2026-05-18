/**
 * Layout: AdminV2Layout — root layout do /admin-v2.
 *
 * Envolve todas as rotas em AdminV2Shell (sidebar + topbar).
 * Auth é enforçada por página via requireAdmin(). Login é rota pública.
 *
 * Usado em: todas as rotas /admin-v2/*.
 */
import { type ReactNode } from "react";
import AdminV2Shell from "@features/admin-v2/components/layout/AdminV2Shell";
import { AdminV2Toaster } from "@features/admin-v2/components/primitives/Toast";

export default function AdminV2Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <AdminV2Shell>{children}</AdminV2Shell>
      <AdminV2Toaster />
    </>
  );
}
