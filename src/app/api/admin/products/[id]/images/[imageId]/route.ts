import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@shared/lib/supabase/server";
import { withAdmin } from "@shared/lib/auth/withAdmin";

const imagePatchSchema = z.object({
  position: z.number().int().nonnegative().optional(),
  alt: z.string().max(200).nullable().optional(),
});

function storagePathFromUrl(url: string): string {
  const marker = "/object/public/product-images/";
  const idx = url.indexOf(marker);
  return idx >= 0 ? url.slice(idx + marker.length) : "";
}

export const PATCH = withAdmin<{ id: string; imageId: string }>(async (req, { params }) => {
  const { imageId } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const parsed = imagePatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { error } = await supabaseServer
    .from("product_images")
    .update(parsed.data)
    .eq("id", imageId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
});

export const DELETE = withAdmin<{ id: string; imageId: string }>(async (_req, { params }) => {
  const { id, imageId } = await params;

  const { data: image } = await supabaseServer
    .from("product_images")
    .select("url")
    .eq("id", imageId)
    .eq("product_id", id)
    .single();

  if (!image) return NextResponse.json({ error: "Image not found" }, { status: 404 });

  const storagePath = storagePathFromUrl(image.url);
  if (storagePath) {
    await supabaseServer.storage.from("product-images").remove([storagePath]);
  }

  const { error } = await supabaseServer.from("product_images").delete().eq("id", imageId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
});
