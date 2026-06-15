"use client";

import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { clsx } from "clsx";
import { Trash2, Save, Link2, Video } from "lucide-react";

import { isApiError } from "../../utils/isApiError";
import { useDeleteVideo, useSaveVideoUrl } from "../../hooks/product/useProductVideo.hook";
import { Button } from "../primitives/Button";
import { AdminUploadBox } from "../primitives/AdminUploadBox";

export function VideoTab({
  productId,
  initialVideoUrl,
}: {
  productId: string;
  initialVideoUrl: string | null;
}) {
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl ?? "");
  const [savedUrl, setSavedUrl] = useState(initialVideoUrl);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveMutation = useSaveVideoUrl(productId);
  const deleteMutation = useDeleteVideo(productId);

  async function handleSave() {
    const trimmed = videoUrl.trim();
    if (!trimmed) return;

    try {
      await saveMutation.mutateAsync(trimmed);
      setSavedUrl(trimmed);
      toast.success("URL de vídeo salva");
    } catch (err: unknown) {
      if (isApiError(err)) {
        toast.error(err.message);
      }
    }
  }

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync();
      setVideoUrl("");
      setSavedUrl(null);
      toast.success("Vídeo removido");
    } catch (err: unknown) {
      if (isApiError(err)) {
        toast.error(err.message);
      }
    }
  }

  async function handleFileUpload(file: File) {
    if (!["video/mp4", "video/webm"].includes(file.type)) {
      toast.error("Tipo inválido. Use MP4 ou WebM.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo 50 MB.");
      return;
    }

    setUploading(true);
    setProgress(0);
    const fd = new FormData();
    fd.append("file", file);

    await new Promise<void>((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
      });
      xhr.addEventListener("load", () => {
        const body = JSON.parse(xhr.responseText || "{}") as { url?: string; error?: string };
        if (xhr.status === 201 && body.url) {
          setSavedUrl(body.url);
          setVideoUrl(body.url);
          toast.success("Vídeo enviado");
        } else {
          toast.error(body.error ?? "Falha no upload");
        }
        resolve();
      });
      xhr.addEventListener("error", () => {
        toast.error("Erro de rede no upload");
        resolve();
      });
      xhr.open("POST", `/api/admin/products/${productId}/video`);
      xhr.send(fd);
    });

    setUploading(false);
    setProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function getYouTubeId(url: string): string | null {
    const m =
      url.match(/[?&]v=([^&]+)/) ??
      url.match(/youtu\.be\/([^?]+)/) ??
      url.match(/embed\/([^?]+)/);
    return m?.[1] ?? null;
  }

  const ytId = savedUrl ? getYouTubeId(savedUrl) : null;

  return (
    <div className="max-w-xl space-y-6">
      {/* Upload de arquivo */}
      <div className="flex flex-col gap-1.5">
        <label className="font-mono text-[11px] tracking-[0.2em] text-white/40 uppercase">{"// "}Upload de Arquivo
        </label>
        <AdminUploadBox
          onFilesSelect={(files) => {
            if (files[0]) handleFileUpload(files[0]);
          }}
          accept="video/mp4,video/webm"
          isUploading={uploading}
          progress={progress}
          title="Clique para enviar MP4 ou WebM"
          subtitle="máx. 50 MB"
          icon={<Video size={18} />}
          themeColor="pink"
        />
      </div>

      {/* Divisor */}
      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-white/10" />
        <span className="font-mono text-[11px] tracking-widest text-white/20 uppercase">{"// "}ou URL externa</span>
        <div className="flex-1 border-t border-white/10" />
      </div>

      {/* URL externa (YouTube, CDN) */}
      <div className="flex flex-col gap-1.5">
        <label className="font-mono text-[11px] tracking-[0.2em] text-white/40 uppercase">{"// "}URL do Vídeo
        </label>
        <div className="flex gap-2">
          <div
            className={clsx(
              "flex flex-1 items-center border-2 border-brand-pink/20 bg-[#0a0a0a]",
              "focus-within:border-brand-pink focus-within:shadow-[0_0_8px_rgba(255,0,182,0.2)]",
              "transition-all duration-150",
            )}
          >
            <Link2 size={15} className="ml-3 shrink-0 text-white/25" />
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="flex-1 bg-transparent px-3 py-2.5 font-mono text-[14px] text-white outline-none placeholder:text-white/20"
            />
          </div>
          <Button
            type="button"
            variant="primary"
            size="md"
            loading={saveMutation.isPending}
            disabled={!videoUrl.trim()}
            onClick={handleSave}
          >
            <Save size={15} />
            Salvar
          </Button>
        </div>
      </div>

      {/* Preview */}
      {savedUrl && (
        <div className="space-y-3">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
            <p className="font-mono text-[11px] tracking-widest text-white/30 uppercase">{"// "}Preview
            </p>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="flex items-center gap-1 font-mono text-[10px] tracking-widest text-red-500/40 uppercase transition-colors hover:text-red-400 disabled:opacity-50"
            >
              <Trash2 size={12} />
              {deleteMutation.isPending ? "Removendo..." : "Remover"}
            </button>
          </div>
          {ytId ? (
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <iframe
                className="absolute inset-0 h-full w-full border border-white/8"
                src={`https://www.youtube.com/embed/${ytId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video preview"
              />
            </div>
          ) : (
            <video
              src={savedUrl}
              controls
              className="w-full border border-white/8 bg-black"
            />
          )}
        </div>
      )}
    </div>
  );
}
