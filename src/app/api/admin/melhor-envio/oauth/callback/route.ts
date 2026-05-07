import { NextRequest, NextResponse } from "next/server";
import { getAdminFromCookies } from "@shared/lib/auth/admin";
import { supabaseServer } from "@shared/lib/supabase/server";
import { getMeBaseUrl } from "@shared/lib/melhor-envio/client";

export async function GET(request: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/admin?me_error=${encodeURIComponent(error)}`,
    );
  }

  if (!code || !state) {
    return NextResponse.json({ error: "Missing code or state" }, { status: 400 });
  }

  // CSRF: validate state against cookie
  const cookieState = request.cookies.get("me_oauth_state")?.value;
  if (!cookieState || cookieState !== state) {
    return NextResponse.json({ error: "Invalid state parameter" }, { status: 400 });
  }

  const clientId = process.env.MELHOR_ENVIO_CLIENT_ID;
  const clientSecret = process.env.MELHOR_ENVIO_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "ME credentials not configured" }, { status: 500 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/admin/melhor-envio/oauth/callback`;

  // Exchange code for tokens
  let tokenData: { access_token: string; refresh_token: string; expires_in: number };
  try {
    const res = await fetch(`${getMeBaseUrl()}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": process.env.MELHOR_ENVIO_USER_AGENT ?? "Serena Glasses",
        Accept: "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[me/oauth/callback] token exchange failed:", res.status, text);
      return NextResponse.json({ error: "Token exchange failed" }, { status: 502 });
    }

    tokenData = await res.json();
  } catch (err) {
    console.error("[me/oauth/callback] fetch error:", (err as Error)?.message);
    return NextResponse.json({ error: "Network error during token exchange" }, { status: 502 });
  }

  if (!tokenData.refresh_token) {
    return NextResponse.json({ error: "No refresh_token in response" }, { status: 502 });
  }

  // Persist refresh_token in app_secrets (upsert)
  const { error: dbError } = await supabaseServer.from("app_secrets").upsert(
    { key: "me_refresh_token", value: tokenData.refresh_token, updated_at: new Date().toISOString() },
    { onConflict: "key" },
  );

  if (dbError) {
    console.error("[me/oauth/callback] db error:", dbError.message);
    return NextResponse.json({ error: "Failed to persist token" }, { status: 500 });
  }

  // Clear CSRF cookie and redirect to admin dashboard with success flag
  const adminUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/admin?me_connected=1`;
  const response = NextResponse.redirect(adminUrl);
  response.cookies.delete("me_oauth_state");

  return response;
}
