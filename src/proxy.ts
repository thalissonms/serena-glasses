import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { checkoutLimiter, couponLimiter, trackLimiter, shippingQuoteLimiter } from "@shared/lib/ratelimit";
import type { Ratelimit } from "@upstash/ratelimit";

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login"]);

const STATIC_EXT = /\.(ico|png|jpg|jpeg|gif|webp|svg|css|js|woff2?|ttf|eot|map)$/i;

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

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  // Rate limiting
  let limiter: Ratelimit | null = null;
  if (pathname === "/api/checkout" && verb === "POST") limiter = checkoutLimiter;
  else if (pathname === "/api/checkout/coupon/validate" && verb === "POST") limiter = couponLimiter;
  else if (pathname === "/api/checkout/shipping/quote" && verb === "POST") limiter = shippingQuoteLimiter;
  else if (pathname === "/order/track") limiter = trackLimiter;

  if (limiter) {
    const ip = getIp(request);
    try {
      const { success, reset } = await limiter.limit(ip);
      if (!success) return tooManyRequests(reset);
    } catch {
      console.error("[ratelimit] Redis error, failing open");
    }
  }

  const isAdminPath = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  // Admin auth guard
  if (isAdminPath || isAdminApi) {
    if (PUBLIC_ADMIN_PATHS.has(pathname))
      return NextResponse.next({ request: { headers: requestHeaders } });

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

    return response;
  }

  // Maintenance mode — only for public page routes (not API, not static assets)
  const isPublicPage =
    !pathname.startsWith("/api/") &&
    pathname !== "/manutencao" &&
    !STATIC_EXT.test(pathname);

  if (isPublicPage) {
    const maintenance = await isMaintenanceEnabled();
    if (maintenance) {
      // Check if the current user is admin before rewriting
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
        return NextResponse.rewrite(new URL("/manutencao", request.url));
      }
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
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
