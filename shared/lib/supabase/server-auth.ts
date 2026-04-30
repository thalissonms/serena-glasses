import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Cliente Supabase server-side com leitura/escrita de cookies.
 * Usar em Server Components / Server Actions / Route Handlers
 * quando precisar do user autenticado (auth via cookie).
 *
 * Para queries que precisam ignorar RLS (catálogo público, admin com service_role),
 * continuar usando `supabaseServer` de `./server.ts`.
 */
export async function createSupabaseServerAuthClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, {
              ...options,
              httpOnly: options.httpOnly ?? true,
              secure: options.secure ?? process.env.NODE_ENV === "production",
              sameSite: options.sameSite ?? "lax",
              path: options.path ?? "/",
            }),
          );
        } catch {
          // Server Component: cookies não podem ser setados aqui.
        }
      },
    },
  });
}
