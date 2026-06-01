import { NextResponse } from "next/server";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { withAdmin } from "@shared/lib/auth/withAdmin";
import { validateUpload } from "@shared/utils/validateUpload";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGE = 20 * 1024 * 1024; // 20 MB

export const POST = withAdmin(async (req) => {
  const formData = await req.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

  const file = formData.get("file") as File | null;

  const uploadError = validateUpload(file, {
    allowedTypes: IMAGE_TYPES,
    maxBytes: MAX_IMAGE,
  });
  if (uploadError) return uploadError;

  const ext = file!.name.split(".").pop()?.toLowerCase() ?? "png";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: storageError } = await getSupabaseServer().storage
    .from("site-highlights")
    .upload(path, new Uint8Array(await file!.arrayBuffer()), {
      contentType: file!.type,
      upsert: false,
    });

  if (storageError) {
    return NextResponse.json({ error: storageError.message }, { status: 500 });
  }

  const { data: urlData } = getSupabaseServer().storage.from("site-highlights").getPublicUrl(path);

  return NextResponse.json({ url: urlData.publicUrl, path }, { status: 201 });
});
