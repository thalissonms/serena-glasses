import { NextResponse } from "next/server";
import { getActiveCategoriesWithSubs } from "@features/admin/services/categoriesList.service";

export const revalidate = 300;

export async function GET() {
  try {
    const items = await getActiveCategoriesWithSubs();
    return NextResponse.json({ items });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
