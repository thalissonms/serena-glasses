import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { checkoutLimiter, couponLimiter, trackLimiter, shippingQuoteLimiter } from "@shared/lib/ratelimit";
import type { Ratelimit } from "@upstash/ratelimit";

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login"]);

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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const verb = request.method;

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
      // Redis unavailable — fail open
      console.error("[ratelimit] Redis error, failing open");
    }
  }

  // Admin auth guard
  const isAdminPath = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminPath && !isAdminApi) {
    return NextResponse.next();
  }

  if (PUBLIC_ADMIN_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const response = NextResponse.next({ request });

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

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/checkout",
    "/api/checkout/coupon/validate",
    "/api/checkout/shipping/quote",
    "/order/track",
  ],
};
