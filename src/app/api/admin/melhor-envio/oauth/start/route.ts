import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getAdminFromCookies } from "@shared/lib/auth/admin";
import { getMeBaseUrl } from "@shared/lib/melhor-envio/client";

const ME_SCOPES = [
  "shipping-calculate",
  "cart-write",
  "shipping-checkout",
  "shipping-generate",
  "shipping-print",
  "shipping-tracking",
  "shipping-cancel",
  "orders-read",
  "users-read",
].join(" ");

export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientId = process.env.MELHOR_ENVIO_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "MELHOR_ENVIO_CLIENT_ID not configured" }, { status: 500 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/admin/melhor-envio/oauth/callback`;

  const state = randomBytes(16).toString("hex");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: ME_SCOPES,
    state,
  });

  const authorizeUrl = `${getMeBaseUrl()}/oauth/authorize?${params.toString()}`;

  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set("me_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 600, // 10 minutes
    path: "/",
  });

  return response;
}
