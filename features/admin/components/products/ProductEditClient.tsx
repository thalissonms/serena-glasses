"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { clsx } from "clsx";
import Link from "next/link";
import {
  ArrowLeft,
  Trash2,
  Plus,
  GripVertical,
  X,
  Save,
  Upload,
  Link2,
  ToggleLeft,
  ToggleRight,
  Video,
  Loader2,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ProductEditData } from "@features/admin/services/productEdit.service";
import type { VariantWithStockInterface } from "@features/admin/types/product/productVariant.interface";
import type { ProductImageInterface } from "@features/admin/types/product/productImage.interface";
import type {
  CategoryWithSubs,
} from "@features/categories/types/category.types";
import { Button } from "@features/admin/components/primitives/Button";
import { Input } from "@features/admin/components/primitives/Input";
import { Modal } from "@features/admin/components/primitives/Modal";
import Textarea from "../primitives/inputs/Textarea";
import { TabId } from "../../types/product/tabId.type";
import { TABS_EDIT } from "../../consts/tabs.const";
import { DetailsTab } from "./ProductDatailTab";
import { VariantAddData } from "../../types/product/productVariantAdd.type";
import { variantAddSchema } from "../../schemas/product/form/productVariantAddForm.schema";
import VariantCard from "./ProductVariantCard";



function VariantsTab({
  productId,
  initialVariants,
}: {
  productId: string;
  initialVariants: VariantWithStockInterface[];
}) {
  const [variants, setVariants] =
    useState<VariantWithStockInterface[]>(initialVariants);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<VariantAddData>({
    resolver: zodResolver(variantAddSchema),
    defaultValues: { color_name: "", color_hex: "#000000", in_stock: true },
  });

  async function onAddVariant(data: VariantAddData) {
    const res = await fetch(`/api/admin/products/${productId}/variants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast.error(err.error ?? "Erro ao adicionar variante");
      return;
    }
    const created = await res.json();
    setVariants((prev) => [
      ...prev,
      {
        id: created.id,
        color_name: created.color_name,
        color_hex: created.color_hex,
        in_stock: created.in_stock,
        stock: { total: 0, reserved: 0, available: 0 },
      },
    ]);
    reset({ color_name: "", color_hex: "#000000", in_stock: true });
    setShowAddForm(false);
    toast.success("Variante adicionada");
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/variants/${deleteId}`, {
      method: "DELETE",
    });
    setDeleting(false);
    if (res.status === 409) {
      const err = await res.json().catch(() => ({}));
      toast.error(err.error ?? "Variante possui pedidos vinculados");
      setDeleteId(null);
      return;
    }
    if (!res.ok) {
      toast.error("Erro ao excluir variante");
      setDeleteId(null);
      return;
    }
    setVariants((prev) => prev.filter((v) => v.id !== deleteId));
    setDeleteId(null);
    toast.success("Variante excluída");
  }

  function handleUpdate(id: string, patch: Partial<VariantWithStockInterface>) {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...patch } : v)),
    );
  }

  const variantToDelete = variants.find((v) => v.id === deleteId);

  return (
    <div className="space-y-4">
      <Modal
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Excluir Variante"
        description="Esta ação é permanente e não pode ser desfeita."
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDeleteId(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={deleting}
              onClick={confirmDelete}
            >
              <Trash2 size={11} />
              Excluir
            </Button>
          </>
        }
      >
        <p className="font-mono text-[11px] text-white/60">
          Excluir a variante{" "}
          <span
            className="font-bold"
            style={{ color: variantToDelete?.color_hex }}
          >
            {variantToDelete?.color_name}
          </span>
          ?
        </p>
      </Modal>

      {variants.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border border-dashed border-white/10">
          <p className="font-mono text-[9px] uppercase tracking-widest text-white/20">
            Nenhuma variante cadastrada
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {variants.map((v) => (
            <VariantCard
              key={v.id}
              variant={v}
              onDelete={setDeleteId}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}

      {showAddForm ? (
        <form
          onSubmit={handleSubmit(onAddVariant)}
          noValidate
          className="border border-[#FF00B6]/20 bg-[#0f0f0f] p-4 space-y-4"
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#FF00B6]/60">
            Nova Variante
          </p>
          <div className="grid grid-cols-3 gap-4 items-end">
            <Input
              label="Nome da Cor *"
              placeholder="Ex: Azul Marinho"
              {...register("color_name")}
              error={errors.color_name?.message}
            />
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
                Hex da Cor *
              </label>
              <div
                className={clsx(
                  "flex items-center bg-[#1a1a1a] border-2 transition-all duration-150",
                  errors.color_hex
                    ? "border-red-500/60"
                    : "border-[#FF00B6]/20 focus-within:border-[#FF00B6]",
                )}
              >
                <Controller
                  name="color_hex"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        type="color"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-8 h-9 cursor-pointer bg-transparent border-0 outline-none p-0.5"
                      />
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="#000000"
                        className="flex-1 bg-transparent px-2 py-2.5 font-mono text-[12px] text-white outline-none placeholder:text-white/20"
                      />
                    </>
                  )}
                />
              </div>
              {errors.color_hex && (
                <p className="font-mono text-[9px] uppercase tracking-wider text-red-400">
                  {errors.color_hex.message}
                </p>
              )}
            </div>
            <Controller
              name="in_stock"
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() => field.onChange(!field.value)}
                  className={clsx(
                    "flex items-center gap-2 px-4 py-2.5 border-2 transition-all duration-150",
                    "font-mono text-[9px] uppercase tracking-widest h-10.5",
                    field.value
                      ? "border-[#00F0FF]/40 text-[#00F0FF] bg-[#00F0FF]/8"
                      : "border-white/10 text-white/30 hover:border-white/20",
                  )}
                >
                  {field.value ? (
                    <ToggleRight size={14} />
                  ) : (
                    <ToggleLeft size={14} />
                  )}
                  Em estoque
                </button>
              )}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={isSubmitting}
            >
              <Plus size={11} />
              Adicionar
            </Button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                reset();
              }}
              className="font-mono text-[9px] uppercase tracking-widest text-white/25 hover:text-white/40 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className={clsx(
            "w-full flex items-center justify-center gap-2 py-3",
            "border border-dashed border-[#FF00B6]/20",
            "font-mono text-[9px] uppercase tracking-widest text-[#FF00B6]/40",
            "hover:text-[#FF00B6]/70 hover:border-[#FF00B6]/40 transition-all duration-150",
          )}
        >
          <Plus size={11} />
          Adicionar Cor
        </button>
      )}
    </div>
  );
}

// ─── Images Tab ───────────────────────────────────────────────────────────────

function SortableImageCard({
  image,
  productId,
  onDelete,
  onAltChange,
}: {
  image: ProductImageInterface;
  productId: string;
  onDelete: (id: string) => void;
  onAltChange: (id: string, alt: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const [altValue, setAltValue] = useState(image.alt ?? "");
  const [savingAlt, setSavingAlt] = useState(false);

  async function saveAlt() {
    if (altValue === (image.alt ?? "")) return;
    setSavingAlt(true);
    await fetch(`/api/admin/products/${productId}/images/${image.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alt: altValue || null }),
    });
    setSavingAlt(false);
    onAltChange(image.id, altValue);
  }

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        "group relative border border-white/8 bg-[#141414] overflow-hidden",
        isDragging && "shadow-[0_0_20px_rgba(255,0,182,0.4)]",
      )}
    >
      <div className="relative aspect-square overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.url}
          alt={image.alt ?? ""}
          className="w-full h-full object-cover"
        />
        <div
          {...attributes}
          {...listeners}
          className="absolute inset-0 flex items-start justify-end p-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        >
          <div className="bg-black/60 p-1">
            <GripVertical size={12} className="text-white/60" />
          </div>
        </div>
        <button
          type="button"
          onClick={() => onDelete(image.id)}
          className="absolute bottom-1.5 right-1.5 bg-black/70 p-1 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-300"
        >
          <X size={10} />
        </button>
        <div className="absolute top-1.5 left-1.5 bg-black/60 px-1.5 py-0.5">
          <span className="font-mono text-[8px] text-white/40">
            #{image.position + 1}
          </span>
        </div>
      </div>
      <div className="p-2">
        <input
          type="text"
          value={altValue}
          onChange={(e) => setAltValue(e.target.value)}
          onBlur={saveAlt}
          placeholder="Texto alt..."
          disabled={savingAlt}
          className={clsx(
            "w-full bg-transparent border-b border-white/8 pb-0.5",
            "font-mono text-[9px] text-white/50 placeholder:text-white/20",
            "outline-none focus:border-[#FF00B6]/40 transition-colors",
            "disabled:opacity-50",
          )}
        />
      </div>
    </div>
  );
}

function ImagesTab({
  productId,
  initialImages,
}: {
  productId: string;
  initialImages: ProductImageInterface[];
}) {
  const [images, setImages] = useState<ProductImageInterface[]>(initialImages);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((i) => i.id === active.id);
    const newIndex = images.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(images, oldIndex, newIndex).map((img, idx) => ({
      ...img,
      position: idx,
    }));
    setImages(reordered);

    await Promise.all(
      reordered.map((img) =>
        fetch(`/api/admin/products/${productId}/images/${img.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ position: img.position }),
        }),
      ),
    );
    toast.success("Ordem atualizada");
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`/api/admin/products/${productId}/images`, {
        method: "POST",
        body: fd,
      });
      if (res.ok) {
        const created = await res.json();
        setImages((prev) => [...prev, created]);
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error ?? `Erro ao enviar ${file.name}`);
      }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const res = await fetch(
      `/api/admin/products/${productId}/images/${deleteId}`,
      { method: "DELETE" },
    );
    setDeleting(false);
    if (!res.ok) {
      toast.error("Erro ao excluir imagem");
      setDeleteId(null);
      return;
    }
    setImages((prev) => {
      const filtered = prev.filter((i) => i.id !== deleteId);
      return filtered.map((img, idx) => ({ ...img, position: idx }));
    });
    setDeleteId(null);
    toast.success("Imagem excluída");
  }

  function handleAltChange(id: string, alt: string) {
    setImages((prev) =>
      prev.map((i) => (i.id === id ? { ...i, alt: alt || null } : i)),
    );
  }

  return (
    <div className="space-y-4">
      <Modal
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Excluir Imagem"
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDeleteId(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={deleting}
              onClick={confirmDelete}
            >
              <Trash2 size={11} />
              Excluir
            </Button>
          </>
        }
      >
        <p className="font-mono text-[11px] text-white/60">
          A imagem será removida permanentemente do storage.
        </p>
      </Modal>

      <div
        className="relative border-2 border-dashed border-[#00F0FF]/20 p-6 flex flex-col items-center gap-3 cursor-pointer hover:border-[#00F0FF]/40 transition-colors"
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        {uploading ? (
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#00F0FF]/60 animate-neon-pulse">
            Enviando...
          </span>
        ) : (
          <>
            <Upload size={18} className="text-[#00F0FF]/30" />
            <p className="font-mono text-[9px] uppercase tracking-widest text-white/25 text-center">
              Clique para selecionar imagens
            </p>
            <p className="font-mono text-[8px] text-white/15">
              JPEG · PNG · WebP — máx. 5 MB por arquivo
            </p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleUpload}
          className="hidden"
          disabled={uploading}
        />
      </div>

      {images.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map((i) => i.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-4 gap-3">
              {images.map((img) => (
                <SortableImageCard
                  key={img.id}
                  image={img}
                  productId={productId}
                  onDelete={setDeleteId}
                  onAltChange={handleAltChange}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 border border-dashed border-white/8">
          <p className="font-mono text-[9px] uppercase tracking-widest text-white/20">
            Nenhuma imagem
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Video Tab ────────────────────────────────────────────────────────────────

function VideoTab({
  productId,
  initialVideoUrl,
}: {
  productId: string;
  initialVideoUrl: string | null;
}) {
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [savedUrl, setSavedUrl] = useState(initialVideoUrl);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSave() {
    const trimmed = videoUrl.trim();
    if (!trimmed) return;
    setSaving(true);
    const res = await fetch(`/api/admin/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ video_url: trimmed }),
    });
    setSaving(false);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast.error(err.error ?? "URL inválida ou erro ao salvar");
      return;
    }
    setSavedUrl(trimmed);
    toast.success("URL de vídeo salva");
  }

  async function handleDelete() {
    setDeleting(true);
    // DELETE endpoint remove o arquivo do storage E limpa video_url no DB
    const res = await fetch(`/api/admin/products/${productId}/video`, { method: "DELETE" });
    setDeleting(false);
    if (!res.ok) {
      toast.error("Erro ao remover vídeo");
      return;
    }
    setVideoUrl("");
    setSavedUrl(null);
    toast.success("Vídeo removido");
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
    <div className="space-y-6 max-w-xl">
      {/* Upload de arquivo */}
      <div className="flex flex-col gap-1.5">
        <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
          Upload de Arquivo
        </label>
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={clsx(
            "border-2 border-dashed p-6 flex flex-col items-center gap-2 transition-colors",
            uploading
              ? "border-[#FF00B6]/40 cursor-default"
              : "border-white/20 cursor-pointer hover:border-[#FF00B6]/60",
          )}
        >
          {uploading ? (
            <>
              <Loader2 size={18} className="animate-spin text-[#FF00B6]" />
              <div className="w-full max-w-[200px] bg-white/10 h-0.5">
                <div
                  className="bg-[#FF00B6] h-0.5 transition-all"
                  style={{ width: `${progress ?? 0}%` }}
                />
              </div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                {progress !== null ? `${progress}%` : "Enviando..."}
              </p>
            </>
          ) : (
            <>
              <Video size={18} className="text-white/20" />
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                Clique para enviar MP4 ou WebM — máx 50 MB
              </p>
            </>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFileUpload(f);
          }}
        />
      </div>

      {/* Divisor */}
      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-white/10" />
        <span className="font-mono text-[9px] uppercase tracking-widest text-white/20">ou URL externa</span>
        <div className="flex-1 border-t border-white/10" />
      </div>

      {/* URL externa (YouTube, CDN) */}
      <div className="flex flex-col gap-1.5">
        <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
          URL do Vídeo
        </label>
        <div className="flex gap-2">
          <div
            className={clsx(
              "flex-1 flex items-center bg-[#1a1a1a] border-2 border-[#FF00B6]/20",
              "focus-within:border-[#FF00B6] focus-within:shadow-[0_0_8px_rgba(255,0,182,0.2)]",
              "transition-all duration-150",
            )}
          >
            <Link2 size={12} className="ml-3 text-white/25 shrink-0" />
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="flex-1 bg-transparent px-3 py-2.5 font-mono text-[12px] text-white placeholder:text-white/20 outline-none"
            />
          </div>
          <Button
            type="button"
            variant="primary"
            size="md"
            loading={saving}
            disabled={!videoUrl.trim()}
            onClick={handleSave}
          >
            <Save size={12} />
            Salvar
          </Button>
        </div>
      </div>

      {/* Preview */}
      {savedUrl && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[9px] uppercase tracking-widest text-white/30">
              Preview
            </p>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-widest text-red-500/40 hover:text-red-400 transition-colors disabled:opacity-50"
            >
              <Trash2 size={9} />
              {deleting ? "Removendo..." : "Remover"}
            </button>
          </div>
          {ytId ? (
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full border border-white/8"
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

// ─── SEO Tab ──────────────────────────────────────────────────────────────────

const seoSchema = z.object({
  seo_title: z.string().max(200, "Máximo 200 caracteres").optional(),
  seo_description: z.string().max(500, "Máximo 500 caracteres").optional(),
});
type SeoFormData = z.infer<typeof seoSchema>;

function SeoTab({
  productId,
  initialData,
}: {
  productId: string;
  initialData: {
    seo_title: string | null;
    seo_description: string | null;
    seo_keywords: string[] | null;
  };
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SeoFormData>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      seo_title: initialData.seo_title ?? "",
      seo_description: initialData.seo_description ?? "",
    },
  });

  const [keywords, setKeywords] = useState<string[]>(
    initialData.seo_keywords ?? [],
  );
  const [kwInput, setKwInput] = useState("");

  function addKeyword(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "Enter" || e.key === ",") && kwInput.trim()) {
      e.preventDefault();
      const kw = kwInput.trim().replace(/,$/, "");
      if (kw && !keywords.includes(kw) && keywords.length < 30) {
        setKeywords((prev) => [...prev, kw]);
      }
      setKwInput("");
    }
  }

  function removeKeyword(kw: string) {
    setKeywords((prev) => prev.filter((k) => k !== kw));
  }

  async function onSubmit(data: SeoFormData) {
    const res = await fetch(`/api/admin/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        seo_title: data.seo_title || null,
        seo_description: data.seo_description || null,
        seo_keywords: keywords.length > 0 ? keywords : null,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast.error(err.error ?? "Erro ao salvar SEO");
      return;
    }
    toast.success("SEO atualizado");
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 max-w-xl"
    >
      <Input
        label="Título SEO"
        placeholder="Título para motores de busca (máx. 200)"
        {...register("seo_title")}
        error={errors.seo_title?.message}
      />

      <Textarea
        label="Meta Descrição"
        rows={4}
        placeholder="Descrição para resultados de busca (máx. 500)..."
        {...register("seo_description")}
        error={errors.seo_description?.message}
      />

      <div className="flex flex-col gap-1.5">
        <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
          Keywords
        </label>
        <div
          className={clsx(
            "flex flex-wrap gap-1.5 p-2 bg-[#1a1a1a] border-2 border-[#FF00B6]/20",
            "focus-within:border-[#FF00B6] focus-within:shadow-[0_0_8px_rgba(255,0,182,0.2)]",
            "transition-all duration-150 min-h-10.5",
          )}
        >
          {keywords.map((kw) => (
            <span
              key={kw}
              className="flex items-center gap-1 px-2 py-0.5 bg-[#FF00B6]/10 border border-[#FF00B6]/20 font-mono text-[9px] text-[#FF00B6]/80"
            >
              {kw}
              <button
                type="button"
                onClick={() => removeKeyword(kw)}
                className="text-[#FF00B6]/50 hover:text-[#FF00B6] transition-colors"
              >
                <X size={8} />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={kwInput}
            onChange={(e) => setKwInput(e.target.value)}
            onKeyDown={addKeyword}
            placeholder={
              keywords.length === 0 ? "Digite e pressione Enter ou ," : ""
            }
            className="flex-1 min-w-24 bg-transparent font-mono text-[11px] text-white placeholder:text-white/20 outline-none py-0.5 px-1"
          />
        </div>
        <p className="font-mono text-[8px] uppercase tracking-wider text-white/20">
          Enter ou vírgula para adicionar — máx. 30 keywords
        </p>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={isSubmitting}
        >
          <Save size={12} />
          Salvar SEO
        </Button>
      </div>
    </form>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  product: ProductEditData;
  categories: CategoryWithSubs[];
}

export default function ProductEditClient({ product, categories }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("details");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDeleteProduct() {
    setDeleting(true);
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "DELETE",
    });
    setDeleting(false);
    if (!res.ok) {
      toast.error("Erro ao desativar produto");
      return;
    }
    toast.success("Produto desativado");
    router.push("/admin/products");
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Modal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Desativar Produto"
        description="O produto será ocultado da loja. Esta ação pode ser revertida pelo suporte."
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDeleteOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={deleting}
              onClick={handleDeleteProduct}
            >
              <Trash2 size={11} />
              Desativar
            </Button>
          </>
        }
      >
        <p className="font-mono text-[11px] text-white/60">
          Desativar <span className="text-white font-bold">{product.name}</span>
          ?
        </p>
      </Modal>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex flex-col gap-1.5">
          <Link
            href="/admin/products"
            className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-white/25 hover:text-[#FF00B6]/60 transition-colors w-fit"
          >
            <ArrowLeft size={10} />
            Produtos
          </Link>
          <h1 className="font-shrikhand text-2xl text-white tracking-wide leading-tight">
            {product.name}
          </h1>
          {product.code && (
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#00F0FF]/50">
              SKU: {product.code}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          className={clsx(
            "flex items-center gap-1.5 px-4 py-2 border border-red-500/20",
            "font-mono text-[9px] uppercase tracking-widest text-red-500/40",
            "hover:text-red-400 hover:border-red-400/40 transition-all duration-150",
          )}
        >
          <Trash2 size={11} />
          Desativar
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-white/8 bg-[#1a1a1a]">
        {TABS_EDIT.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              "relative px-5 py-3 font-mono text-[9px] uppercase tracking-[0.2em] transition-colors duration-150",
              "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5",
              "after:bg-[#FF00B6] after:transition-transform after:duration-200 after:origin-left",
              "outline-none",
              activeTab === tab.id
                ? "text-white after:scale-x-100"
                : "text-white/30 hover:text-white/60 after:scale-x-0",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* All panels always mounted — hidden via CSS to preserve form state */}
      <div className="bg-[#141414] border border-white/5 border-t-0 p-6">
        <div className={clsx(activeTab !== "details" && "hidden")}>
          <DetailsTab product={product} categories={categories} />
        </div>
        <div className={clsx(activeTab !== "variants" && "hidden")}>
          <VariantsTab
            productId={product.id}
            initialVariants={product.variants}
          />
        </div>
        <div className={clsx(activeTab !== "images" && "hidden")}>
          <ImagesTab productId={product.id} initialImages={product.images} />
        </div>
        <div className={clsx(activeTab !== "video" && "hidden")}>
          <VideoTab
            productId={product.id}
            initialVideoUrl={product.video_url}
          />
        </div>
        <div className={clsx(activeTab !== "seo" && "hidden")}>
          <SeoTab
            productId={product.id}
            initialData={{
              seo_title: product.seo_title,
              seo_description: product.seo_description,
              seo_keywords: product.seo_keywords,
            }}
          />
        </div>
      </div>
    </div>
  );
}
