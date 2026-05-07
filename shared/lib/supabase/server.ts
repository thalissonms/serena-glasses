import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Usar apenas em API Routes e Server Components — nunca expor ao client
// Proxy lazy: o cliente real só é criado no primeiro acesso (não durante o build)
let _instance: SupabaseClient | null = null;

function getInstance(): SupabaseClient {
  if (!_instance) {
    _instance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }
  return _instance;
}

export const supabaseServer = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const client = getInstance();
    const value = client[prop as keyof SupabaseClient];
    return typeof value === "function" ? (value as Function).bind(client) : value;
  },
});
