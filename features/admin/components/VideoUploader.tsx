"use client";
import { useRef, useState } from "react";
import { Loader2, Trash2, Upload, Video } from "lucide-react";
import { toast } from "sonner";

interface Props {
  productId: string;
  initialVideoUrl: string | null;
}

export default function VideoUploader({ productId, initialVideoUrl }: Props) {
  const [videoUrl, setVideoUrl] = useState<string | null>(initialVideoUrl);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
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
        const body = JSON.parse(xhr.responseText || "{}");
        if (xhr.status === 201) {
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
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleRemove() {
    if (!confirm("Remover o vídeo deste produto?")) return;
    setRemoving(true);

    const res = await fetch(`/api/admin/products/${productId}/video`, { method: "DELETE" });
    if (res.ok) {
      setVideoUrl(null);
      toast.success("Vídeo removido");
    } else {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error ?? "Falha ao remover vídeo");
    }
    setRemoving(false);
  }

  return (
    <div className="flex flex-col gap-4">
      {videoUrl ? (
        <div className="flex flex-col gap-3">
          <video
            src={videoUrl}
            controls
            className="w-full max-w-sm border-2 border-white/10 bg-black"
          />
          <button
            type="button"
            onClick={handleRemove}
            disabled={removing}
            className="self-start flex items-center gap-1.5 font-poppins text-[10px] font-bold uppercase tracking-wider border border-red-500/40 text-red-400 px-3 py-1.5 hover:bg-red-500/10 transition-colors disabled:opacity-40"
          >
            {removing ? <Loader2 size={10} className="animate-spin" /> : <Trash2 size={10} />}
            Remover vídeo
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-white/20 p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-brand-pink/60 transition-colors"
        >
          {uploading ? (
            <>
              <Loader2 size={20} className="animate-spin text-brand-pink" />
              {progress !== null && (
                <div className="w-full max-w-[180px] bg-white/10 h-1">
                  <div
                    className="bg-brand-pink h-1 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
              <p className="font-poppins text-[10px] uppercase tracking-widest text-gray-500">
                {progress !== null ? `${progress}%` : "Enviando..."}
              </p>
            </>
          ) : (
            <>
              <Video size={20} className="text-gray-500" />
              <p className="font-poppins text-[10px] uppercase tracking-widest text-gray-500">
                Clique para adicionar vídeo (MP4 ou WebM — máx 50 MB)
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />

      {!videoUrl && !uploading && (
        <div className="flex items-center gap-2 text-gray-600">
          <Upload size={14} />
          <span className="font-inter text-xs">Nenhum vídeo cadastrado</span>
        </div>
      )}
    </div>
  );
}
