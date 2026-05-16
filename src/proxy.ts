import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { checkoutLimiter, couponLimiter, trackLimiter, shippingQuoteLimiter, searchLimiter } from "@shared/lib/ratelimit";
import type { Ratelimit } from "@upstash/ratelimit";

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login"]);

const STATIC_EXT = /\.(ico|png|jpg|jpeg|gif|webp|svg|css|js|woff2?|ttf|eot|map)$/i;

const isProd = process.env.NODE_ENV === "production";

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
}

function tooManyRequests(reset: number): NextResponse {
  const retryAfter = Math.ceil((reset - Date.now()) / 1000);
  return NextResponse.json(
    { error: "Too many requests. Try again later." },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function buildCsp(nonce: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

  if (!isProd) {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://sdk.mercadopago.com https://http2.mlstatic.com https://connect.facebook.net https://www.googletagmanager.com https://analytics.tiktok.com",
      "style-src 'self' 'unsafe-inline'",
      `img-src 'self' data: blob: https://images.unsplash.com https://*.mercadopago.com https://*.mercadolibre.com https://*.mercadolivre.com ${supabaseUrl}`,
      `connect-src 'self' ws: wss: https://api.mercadopago.com https://*.mercadopago.com https://http2.mlstatic.com https://*.mercadolibre.com https://api.mercadolibre.com ${supabaseUrl} https://viacep.com.br`,
      `media-src 'self' ${supabaseUrl}`,
      "frame-src 'self' https://*.mercadopago.com https://*.mercadolibre.com https://*.mercadolivre.com",
      "font-src 'self' data:",
      "object-src 'none'",
      "base-uri 'self'",
    ].join("; ");
  }

  return [
    "default-src 'self'",
    // 'unsafe-inline' ignored by browsers that support strict-dynamic (modern); fallback for legacy
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline' https://sdk.mercadopago.com https://http2.mlstatic.com https://connect.facebook.net https://www.googletagmanager.com https://analytics.tiktok.com`,
    "style-src 'self' 'unsafe-inline' https://sdk.mercadopago.com https://http2.mlstatic.com",
    `img-src 'self' data: blob: https://images.unsplash.com https://*.mercadopago.com https://*.mercadolibre.com https://*.mercadolivre.com ${supabaseUrl} https://www.facebook.com https://www.google-analytics.com`,
    "font-src 'self' data: https://http2.mlstatic.com",
    `connect-src 'self' https://api.mercadopago.com https://*.mercadopago.com https://http2.mlstatic.com https://*.mercadolibre.com https://api.mercadolibre.com ${supabaseUrl} https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://viacep.com.br`,
    `media-src 'self' ${supabaseUrl}`,
    "frame-src 'self' https://*.mercadopago.com https://*.mercadolibre.com https://*.mercadolivre.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
}

async function isMaintenanceEnabled(): Promise<boolean> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return false;

    const res = await fetch(
      `${url}/rest/v1/site_settings?key=eq.maintenance&select=value`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } },
    );
    if (!res.ok) return false;
    const data = await res.json() as Array<{ value: { enabled?: boolean } }>;
    return !!data[0]?.value?.enabled;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const verb = request.method;

  const nonce = btoa(crypto.randomUUID());
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  requestHeaders.set("x-nonce", nonce);

  // Rate limiting
  let limiter: Ratelimit | null = null;
  if (pathname === "/api/checkout" && verb === "POST") limiter = checkoutLimiter;
  else if (pathname === "/api/checkout/coupon/validate" && verb === "POST") limiter = couponLimiter;
  else if (pathname === "/api/checkout/shipping/quote" && verb === "POST") limiter = shippingQuoteLimiter;
  else if (pathname === "/order/track") limiter = trackLimiter;
  else if ((pathname === "/api/search" || pathname === "/api/search/facets") && verb === "GET") limiter = searchLimiter;

  if (limiter) {
    const ip = getIp(request);
    try {
      const { success, reset } = await limiter.limit(ip);
      if (!success) return tooManyRequests(reset);
    } catch {
      console.error("[ratelimit] Redis error, failing open");
    }
  }

  const csp = buildCsp(nonce);
  function withCsp(res: NextResponse): NextResponse {
    res.headers.set("Content-Security-Policy", csp);
    return res;
  }

  const isAdminPath = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  // Admin auth guard
  if (isAdminPath || isAdminApi) {
    if (PUBLIC_ADMIN_PATHS.has(pathname))
      return withCsp(NextResponse.next({ request: { headers: requestHeaders } }));

    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const { data: { user } } = await supabase.auth.getUser();
    const adminEmails = getAdminEmails();
    const isAuthorized = !!user?.email && adminEmails.includes(user.email.toLowerCase());

    if (!isAuthorized) {
      if (isAdminApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }

    return withCsp(response);
  }

  // Maintenance mode — only for public page routes (not API, not static assets)
  const isPublicPage =
    !pathname.startsWith("/api/") &&
    pathname !== "/manutencao" &&
    !STATIC_EXT.test(pathname);

  if (isPublicPage) {
    const maintenance = await isMaintenanceEnabled();
    if (maintenance) {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() { return request.cookies.getAll(); },
            setAll() {},
          },
        },
      );
      const { data: { user } } = await supabase.auth.getUser();
      const isAdmin = !!user?.email && getAdminEmails().includes(user.email.toLowerCase());
      if (!isAdmin) {
        return withCsp(NextResponse.rewrite(new URL("/manutencao", request.url)));
      }
    }
  }

  return withCsp(NextResponse.next({ request: { headers: requestHeaders } }));
}

export const config = {
  matcher: [
    // Admin and rate-limited API routes
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/checkout",
    "/api/checkout/coupon/validate",
    "/api/checkout/shipping/quote",
    "/order/track",
    // Public pages — for maintenance mode (excludes Next.js internals and static files)
    "/((?!_next/static|_next/image|favicon\\.ico).*)",
  ],
};
