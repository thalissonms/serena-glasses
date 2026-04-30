import { NextResponse } from "next/server";

interface UploadConfig {
  allowedTypes: string[];
  maxBytes: number;
  label?: string;
}

export function validateUpload(
  file: File | null,
  config: UploadConfig,
): NextResponse | null {
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  if (!config.allowedTypes.includes(file.type)) {
    const types = config.allowedTypes.join(", ");
    return NextResponse.json(
      { error: `Tipo inválido. Use: ${types}.` },
      { status: 400 },
    );
  }

  const maxMB = Math.round(config.maxBytes / (1024 * 1024));
  if (file.size > config.maxBytes) {
    return NextResponse.json(
      { error: `Arquivo muito grande. Máximo ${maxMB} MB.` },
      { status: 400 },
    );
  }

  return null;
}
