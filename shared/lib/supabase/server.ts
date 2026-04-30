import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Usar apenas em API Routes e Server Components — nunca expor ao client
export const supabaseServer = createClient(url, key);
