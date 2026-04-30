import { NextResponse } from "next/server";
import { getAdminFromCookies } from "@shared/lib/auth/admin";

export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ isAdmin: false }, { status: 200 });
  }
  return NextResponse.json({ isAdmin: true, email: admin.email });
}
