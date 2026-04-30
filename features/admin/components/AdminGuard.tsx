"use client";
import { useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@shared/lib/supabase/client";

/**
 * Defesa em profundidade:
 * - Middleware Next.js (src/middleware.ts) já valida session via cookie + admin allowlist
 * - Server Components chamam requireAdmin() (redirect se não autorizado)
 * - Este guard apenas escuta SIGNED_OUT pra redirecionar imediatamente em logout
 */
export default function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/admin/login") return;

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") router.replace("/admin/login");
    });

    return () => listener.subscription.unsubscribe();
  }, [pathname, router]);

  return <>{children}</>;
}
