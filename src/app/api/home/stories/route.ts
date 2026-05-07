import { NextResponse } from "next/server";
import { getPublicHomeStories } from "@features/home/services/homeStoriesPublic.service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const lang = new URL(request.url).searchParams.get("lang") ?? "pt";
  try {
    const stories = await getPublicHomeStories(lang);
    return NextResponse.json(stories);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
