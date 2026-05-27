"use client";
/**
 * Component: Topbar — barra superior 60px do /admin.
 *
 * Esquerda: Breadcrumbs baseados em pathname. Direita: search stub (⌘K) + avatar + dropdown logout.
 *
 * Usado em: AdminV2Shell.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, LogOut, User } from "lucide-react";
import { supabase } from "@shared/lib/supabase/client";
import { Breadcrumbs } from "./Breadcrumbs";

export default function Topbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    setMenuOpen(false);
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  return (
    <header className="h-15 shrink-0 flex items-center justify-between px-6 bg-[#141414] border-b border-white/5">
      <Breadcrumbs />

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex items-center gap-2 px-3 py-1.5 bg-[#0f0f0f] border border-white/6 font-mono text-[9px] uppercase tracking-widest text-white/20 hover:border-brand-pink/20 hover:text-white/35 transition-all duration-150"
          aria-label="Busca global"
        >
          <Search size={10} />
          <span>Buscar</span>
          <kbd className="ml-1.5 px-1 border border-white/8 text-[7px] text-white/15 font-mono">
            ⌘K
          </kbd>
        </button>

        <div className="relative">
          {/* <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="w-8 h-8 flex items-center justify-center bg-brand-pink/8 border border-brand-pink/25 hover:border-brand-pink/50 hover:bg-brand-pink/15 transition-all duration-150"
            aria-label="Menu do usuário"
            aria-expanded={menuOpen}
          >
            <User size={13} className="text-brand-pink" />
          </button> */}

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setMenuOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 top-full mt-1 z-40 w-44 bg-[#1a1a1a] border border-brand-pink/25 shadow-[4px_4px_0_#FF00B6]">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 font-mono text-[9px] uppercase tracking-widest text-white/35 hover:text-red-400 hover:bg-white/3 transition-colors"
                >
                  <LogOut size={10} />
                  Sair
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
