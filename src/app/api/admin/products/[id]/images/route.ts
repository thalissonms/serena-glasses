import { NextResponse } from "next/server";
import { supabaseServer } from "@shared/lib/supabase/server";
import { withAdmin } from "@shared/lib/auth/withAdmin";
import { validateUpload } from "@shared/utils/validateUpload";

export const POST = withAdmin<{ id: string }>(async (req, { params }) => {
  const { id } = await params;

  const formData = await req.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

  const file = formData.get("file") as File | null;
  const uploadError = validateUpload(file, {
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
    maxBytes: 5 * 1024 * 1024,
  });
  if (uploadError) return uploadError;

  const { data: existing } = await supabaseServer
    .from("product_images")
    .select("position")
    .eq("product_id", id)
    .order("position", { ascending: false })
    .limit(1);

  const nextPosition = existing && existing.length > 0 ? (existing[0].position ?? 0) + 1 : 0;

  const ext = file!.name.split(".").pop() ?? "jpg";
  const path = `${id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: storageError } = await supabaseServer.storage
    .from("product-images")
    .upload(path, new Uint8Array(await file!.arrayBuffer()), {
      contentType: file!.type,
      upsert: false,
    });

  if (storageError) return NextResponse.json({ error: storageError.message }, { status: 500 });

  const { data: urlData } = supabaseServer.storage.from("product-images").getPublicUrl(path);

  const { data, error: dbError } = await supabaseServer
    .from("product_images")
    .insert({ product_id: id, url: urlData.publicUrl, alt: null, position: nextPosition })
    .select("id, url, alt, position")
    .single();

  if (dbError) {
    await supabaseServer.storage.from("product-images").remove([path]);
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
});
