import { NextResponse } from "next/server";
import { getActiveSiteBanners } from "@features/admin/services/siteBannersList.service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const lang = new URL(request.url).searchParams.get("lang") ?? "pt";
  try {
    const banners = await getActiveSiteBanners(lang);
    return NextResponse.json(banners);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
