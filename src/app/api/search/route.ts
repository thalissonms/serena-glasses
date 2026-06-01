import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@features/search/services/searchService";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q") ?? "";

  if (q.length < 2) {
    return NextResponse.json({ error: "query_too_short" }, { status: 400 });
  }

  try {
    const results = await searchProducts({
      q,
      subcategory: searchParams.get("subcategory"),
      shape: searchParams.get("shape"),
      color: searchParams.get("color"),
    });
    return NextResponse.json(results);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
