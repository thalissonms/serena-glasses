import { getSupabaseServer } from "@shared/lib/supabase/server";

export function getMeBaseUrl(): string {
  return process.env.MELHOR_ENVIO_ENV === "production"
    ? "https://melhorenvio.com.br"
    : "https://sandbox.melhorenvio.com.br";
}

function getUserAgent(): string {
  return process.env.MELHOR_ENVIO_USER_AGENT ?? "Serena Glasses";
}

// In-memory token cache (resets on cold start â€” acceptable for serverless)
let cachedToken: { access_token: string; expires_at: number } | null = null;
// Singleton in-flight refresh promise â€” prevents race condition with rotating refresh tokens (ME
// invalidates the old refresh_token on first use; a second concurrent call would use it and break)
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const clientId = process.env.MELHOR_ENVIO_CLIENT_ID;
  const clientSecret = process.env.MELHOR_ENVIO_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("MELHOR_ENVIO_CLIENT_ID or MELHOR_ENVIO_CLIENT_SECRET not configured");
  }

  const { data, error } = await getSupabaseServer()
    .from("app_secrets")
    .select("value")
    .eq("key", "me_refresh_token")
    .single();

  if (error || !data?.value) {
    throw new Error("Melhor Envio refresh_token not found â€” complete OAuth flow first");
  }

  const res = await fetch(`${getMeBaseUrl()}/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": getUserAgent(),
      Accept: "application/json",
    },
    body: JSON.stringify({
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: data.value,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ME token refresh failed (${res.status}): ${text}`);
  }

  const tokenData = (await res.json()) as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };

  // Persist new refresh_token (rotates on each refresh)
  await getSupabaseServer().from("app_secrets").upsert(
    { key: "me_refresh_token", value: tokenData.refresh_token, updated_at: new Date().toISOString() },
    { onConflict: "key" },
  );

  // Cache access_token with 60s safety margin
  cachedToken = {
    access_token: tokenData.access_token,
    expires_at: Date.now() + (tokenData.expires_in - 60) * 1000,
  };

  return tokenData.access_token;
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires_at) {
    return cachedToken.access_token;
  }
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

export async function meRequest<T = unknown>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const token = await getAccessToken();

  const doRequest = async (accessToken: string): Promise<Response> => {
    return fetch(`${getMeBaseUrl()}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": getUserAgent(),
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  };

  let res = await doRequest(token);

  // 401 â†’ token expired server-side, force refresh + retry once (reuse in-flight promise)
  if (res.status === 401) {
    cachedToken = null;
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => { refreshPromise = null; });
    }
    const newToken = await refreshPromise;
    res = await doRequest(newToken);
  }

  if (res.status === 429) {
    console.error("[melhor-envio] Rate limit hit (429) â€” ME allows 60 req/min");
    throw new Error("Melhor Envio rate limit exceeded");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ME API error (${res.status}) ${method} ${path}: ${text}`);
  }

  return res.json() as Promise<T>;
}
