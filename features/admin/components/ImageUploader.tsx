"use client";
import { useRef, useState } from "react";
import { Loader2, Trash2, Upload, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import type { ProductImageInterface } from "../types/productImage.interface";

interface Props {
  productId: string;
  initialImages: ProductImageInterface[];
}

interface ImageState extends ProductImageInterface {
  saving?: boolean;
}

export default function ImageUploader({ productId, initialImages }: Props) {
  const [images, setImages] = useState<ImageState[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);

    let success = 0;
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch(`/api/admin/products/${productId}/images`, {
        method: "POST",
        body: fd,
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(body.error ?? `Falha ao enviar "${file.name}"`);
        break;
      }
      setImages((prev) => [...prev, body as ImageState]);
      success++;
    }

    if (success > 0) toast.success(`${success} imagem${success > 1 ? "s" : ""} enviada${success > 1 ? "s" : ""}`);

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleDelete(imageId: string) {
    setImages((prev) => prev.map((img) => img.id === imageId ? { ...img, saving: true } : img));

    const res = await fetch(
      `/api/admin/products/${productId}/images/${imageId}`,
      { method: "DELETE" },
    );

    if (res.ok) {
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      toast.success("Imagem removida");
    } else {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error ?? "Falha ao remover imagem");
      setImages((prev) =>
        prev.map((img) => (img.id === imageId ? { ...img, saving: false } : img)),
      );
    }
  }

  async function handleAltBlur(imageId: string, alt: string) {
    const res = await fetch(`/api/admin/products/${productId}/images/${imageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alt: alt || null }),
    });
    if (!res.ok) toast.error("Falha ao salvar alt da imagem");
  }

  async function handlePositionBlur(imageId: string, value: string) {
    const position = parseInt(value, 10);
    if (isNaN(position) || position < 0) return;

    const res = await fetch(`/api/admin/products/${productId}/images/${imageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ position }),
    });

    if (res.ok) {
      setImages((prev) =>
        [...prev.map((img) => (img.id === imageId ? { ...img, position } : img))].sort(
          (a, b) => a.position - b.position,
        ),
      );
    } else {
      toast.error("Falha ao salvar posição");
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-white/20 p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-brand-pink/60 transition-colors"
      >
        {uploading ? (
          <Loader2 size={20} className="animate-spin text-brand-pink" />
        ) : (
          <Upload size={20} className="text-gray-500" />
        )}
        <p className="font-poppins text-[10px] uppercase tracking-widest text-gray-500">
          {uploading ? "Enviando..." : "Clique ou arraste imagens (JPEG, PNG, WebP — máx 5 MB)"}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Grid de imagens */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="bg-[#0a0a0a] border-2 border-white/10 flex flex-col gap-2 p-2 relative"
            >
              {/* Preview */}
              <div className="aspect-square bg-[#111] flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt ?? ""}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>

              {/* Alt */}
              <input
                type="text"
                defaultValue={img.alt ?? ""}
                placeholder="Texto alt..."
                onBlur={(e) => handleAltBlur(img.id, e.target.value)}
                className="w-full bg-transparent border border-white/10 px-2 py-1 font-inter text-[11px] text-gray-300 placeholder:text-gray-600 outline-none focus:border-brand-pink/60"
              />

              {/* Position + delete */}
              <div className="flex items-center gap-1.5">
                <label className="font-poppins text-[9px] uppercase tracking-wider text-gray-600 shrink-0">
                  Pos.
                </label>
                <input
                  type="number"
                  min={0}
                  defaultValue={img.position}
                  onBlur={(e) => handlePositionBlur(img.id, e.target.value)}
                  className="w-12 bg-transparent border border-white/10 px-1.5 py-1 font-inter text-[11px] text-gray-300 outline-none focus:border-brand-pink/60"
                />
                <button
                  type="button"
                  onClick={() => handleDelete(img.id)}
                  disabled={img.saving}
                  className="ml-auto flex items-center justify-center w-7 h-7 border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                >
                  {img.saving ? (
                    <Loader2 size={10} className="animate-spin" />
                  ) : (
                    <Trash2 size={10} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && !uploading && (
        <div className="flex items-center gap-2 text-gray-600">
          <ImageIcon size={14} />
          <span className="font-inter text-xs">Nenhuma imagem cadastrada</span>
        </div>
      )}
    </div>
  );
}
