"use client";
/**
 * Component: AdminV2Shell — wrapper de layout para /admin.
 *
 * Renderiza sidebar (240px) + topbar (60px) + área de conteúdo scrollável.
 * Detecta /admin/login via pathname e renderiza apenas os children sem o chrome.
 *
 * Usado em: src/app/admin/layout.tsx.
 */
import { type ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface Props {
  children: ReactNode;
}

export default function AdminV2Shell({ children }: Props) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (pathname === "/admin/login") {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505]">
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-admin">
          {children}
        </main>
      </div>
    </div>
  );
}
