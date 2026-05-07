import { NextResponse } from "next/server";
import { meRequest } from "@shared/lib/melhor-envio/client";
import { withAdmin } from "@shared/lib/auth/withAdmin";

export const GET = withAdmin(async () => {
  try {
    const me = await meRequest<{ email: string; name: string }>("GET", "/api/v2/me");
    return NextResponse.json({ connected: true, account_email: me.email });
  } catch {
    return NextResponse.json({ connected: false, account_email: null });
  }
});
