import type { ReactNode } from "react";
import { Toaster } from "sonner";
import AdminShell from "@features/admin/components/AdminShell";

export const metadata = { title: "Admin — Serena Glasses" };

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminShell>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: "font-poppins text-xs uppercase tracking-wider",
            success: "border-brand-pink",
          },
        }}
      />
    </AdminShell>
  );
}
