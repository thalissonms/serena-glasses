import { NextResponse } from "next/server";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { withAdmin } from "@shared/lib/auth/withAdmin";
import { validateUpload } from "@shared/utils/validateUpload";

function storagePathFromUrl(url: string): string {
  const marker = "/object/public/product-videos/";
  const idx = url.indexOf(marker);
  return idx >= 0 ? url.slice(idx + marker.length) : "";
}

export const POST = withAdmin<{ id: string }>(async (req, { params }) => {
  const { id } = await params;

  const formData = await req.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

  const file = formData.get("file") as File | null;
  const uploadError = validateUpload(file, {
    allowedTypes: ["video/mp4", "video/webm"],
    maxBytes: 50 * 1024 * 1024,
  });
  if (uploadError) return uploadError;

  const { data: product } = await getSupabaseServer()
    .from("products")
    .select("video_url")
    .eq("id", id)
    .single();

  if (product?.video_url) {
    const oldPath = storagePathFromUrl(product.video_url);
    if (oldPath) await getSupabaseServer().storage.from("product-videos").remove([oldPath]);
  }

  const ext = file!.name.split(".").pop() ?? "mp4";
  const path = `${id}/${Date.now()}.${ext}`;

  const { error: storageError } = await getSupabaseServer().storage
    .from("product-videos")
    .upload(path, new Uint8Array(await file!.arrayBuffer()), {
      contentType: file!.type,
      upsert: true,
    });

  if (storageError) return NextResponse.json({ error: storageError.message }, { status: 500 });

  const { data: urlData } = getSupabaseServer().storage.from("product-videos").getPublicUrl(path);

  const { error } = await getSupabaseServer()
    .from("products")
    .update({ video_url: urlData.publicUrl })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ url: urlData.publicUrl }, { status: 201 });
});

export const DELETE = withAdmin<{ id: string }>(async (_req, { params }) => {
  const { id } = await params;

  const { data: product } = await getSupabaseServer()
    .from("products")
    .select("video_url")
    .eq("id", id)
    .single();

  if (product?.video_url) {
    const path = storagePathFromUrl(product.video_url);
    if (path) await getSupabaseServer().storage.from("product-videos").remove([path]);
  }

  const { error } = await getSupabaseServer()
    .from("products")
    .update({ video_url: null })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
});
