import { NextResponse } from "next/server";
import { supabaseServer } from "@shared/lib/supabase/server";
import { withAdmin } from "@shared/lib/auth/withAdmin";
import { validateUpload } from "@shared/utils/validateUpload";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const MAX_IMAGE = 8 * 1024 * 1024;
const MAX_VIDEO = 80 * 1024 * 1024;

export const POST = withAdmin(async (req) => {
  const formData = await req.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

  const file = formData.get("file") as File | null;
  const kind = (formData.get("kind") as string | null) ?? "image";

  const isImage = kind === "image";
  const uploadError = validateUpload(file, {
    allowedTypes: isImage ? IMAGE_TYPES : VIDEO_TYPES,
    maxBytes: isImage ? MAX_IMAGE : MAX_VIDEO,
  });
  if (uploadError) return uploadError;

  const ext = file!.name.split(".").pop()?.toLowerCase() ?? (isImage ? "jpg" : "mp4");
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: storageError } = await supabaseServer.storage
    .from("home-stories")
    .upload(path, new Uint8Array(await file!.arrayBuffer()), {
      contentType: file!.type,
      upsert: false,
    });

  if (storageError) {
    return NextResponse.json({ error: storageError.message }, { status: 500 });
  }

  const { data: urlData } = supabaseServer.storage.from("home-stories").getPublicUrl(path);

  return NextResponse.json({ url: urlData.publicUrl, path }, { status: 201 });
});
