import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client com persistência via cookies (compartilhado com server/middleware)
export const supabase = createBrowserClient(url, key);
