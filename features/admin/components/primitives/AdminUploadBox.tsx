"use client";

import React, { useRef } from "react";
import { clsx } from "clsx";
import { Loader2 } from "lucide-react";

interface AdminUploadBoxProps {
  onFilesSelect: (files: FileList) => void;
  accept: string;
  multiple?: boolean;
  isUploading: boolean;
  progress?: number | null; // Se passado e isUploading for true, exibe a barra
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  themeColor?: "cyan" | "pink";
}

export function AdminUploadBox({
  onFilesSelect,
  accept,
  multiple = false,
  isUploading,
  progress,
  title,
  subtitle,
  icon,
  themeColor = "cyan",
}: AdminUploadBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const colors = {
    cyan: {
      border: "border-[#00F0FF]/20 hover:border-[#00F0FF]/40",
      borderUploading: "border-[#00F0FF]/40",
      text: "text-[#00F0FF]/30",
      textUploading: "text-[#00F0FF]/60",
      bgProgress: "bg-[#00F0FF]",
    },
    pink: {
      border: "border-white/20 hover:border-[#FF00B6]/60",
      borderUploading: "border-[#FF00B6]/40",
      text: "text-white/20",
      textUploading: "text-[#FF00B6]/60",
      bgProgress: "bg-[#FF00B6]",
    },
  };

  const c = colors[themeColor];

  const handleBoxClick = () => {
    if (!isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelect(e.target.files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      onClick={handleBoxClick}
      className={clsx(
        "relative border-2 border-dashed p-6 flex flex-col items-center gap-3 transition-colors",
        isUploading ? clsx(c.borderUploading, "cursor-default") : clsx(c.border, "cursor-pointer")
      )}
    >
      {isUploading ? (
        progress !== undefined ? (
          <>
            <Loader2
              size={18}
              className={clsx(
                "animate-spin",
                themeColor === "cyan" ? "text-[#00F0FF]" : "text-[#FF00B6]"
              )}
            />
            <div className="w-full max-w-[200px] bg-white/10 h-0.5 mt-1">
              <div
                className={clsx(c.bgProgress, "h-0.5 transition-all")}
                style={{ width: `${progress ?? 0}%` }}
              />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">
              {progress !== null ? `${progress}%` : "Enviando..."}
            </p>
          </>
        ) : (
          <span
            className={clsx(
              "font-mono text-[9px] uppercase tracking-widest animate-neon-pulse",
              c.textUploading
            )}
          >
            Enviando...
          </span>
        )
      ) : (
        <>
          <div className={c.text}>{icon}</div>
          <p className="font-mono text-[9px] uppercase tracking-widest text-white/25 text-center">
            {title}
          </p>
          <p className="font-mono text-[8px] text-white/15 text-center">
            {subtitle}
          </p>
        </>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
}
