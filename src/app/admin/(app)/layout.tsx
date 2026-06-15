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
