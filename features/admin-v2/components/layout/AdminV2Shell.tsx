"use client";
/**
 * Component: AdminV2Shell — wrapper de layout para /admin-v2.
 *
 * Renderiza sidebar (240px) + topbar (60px) + área de conteúdo scrollável.
 * Detecta /admin-v2/login via pathname e renderiza apenas os children sem o chrome.
 *
 * Usado em: src/app/admin-v2/layout.tsx.
 */
import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface Props {
  children: ReactNode;
}

export default function AdminV2Shell({ children }: Props) {
  const pathname = usePathname();

  if (pathname === "/admin-v2/login") {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f0f0f]">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 scrollbar-admin">
          {children}
        </main>
      </div>
    </div>
  );
}
