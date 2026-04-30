import { NextRequest, NextResponse } from "next/server";
import { getAdminFromCookies, type AdminUser } from "./admin";

type AdminHandler<T extends Record<string, string> = Record<string, string>> = (
  req: NextRequest,
  context: { params: Promise<T>; admin: AdminUser },
) => Promise<NextResponse>;

export function withAdmin<T extends Record<string, string> = Record<string, string>>(
  handler: AdminHandler<T>,
) {
  return async (req: NextRequest, context: { params: Promise<T> }) => {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return handler(req, { ...context, admin });
  };
}
