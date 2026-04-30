"use client";
import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import AdminGuard from "./AdminGuard";
import AdminSidebar from "./AdminSidebar";

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <AdminGuard>{children}</AdminGuard>;
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#1a1a1a]">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </AdminGuard>
  );
}
