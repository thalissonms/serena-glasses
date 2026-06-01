import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Usar apenas em API Routes e Server Components — nunca expor ao client
let _instance: SupabaseClient | null = null;

export function getSupabaseServer(): SupabaseClient {
  if (!_instance) {
    _instance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }
  return _instance;
}
