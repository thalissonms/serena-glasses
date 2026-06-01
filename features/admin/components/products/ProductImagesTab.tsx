"use client";

import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { clsx } from "clsx";
import { Trash2, GripVertical, X, Upload } from "lucide-react";
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

import type { ProductImageInterface } from "../../types/product/productImage.interface";
import { isApiError } from "../../utils/isApiError";
import {
  useDeleteImage,
  usePatchImageAlt,
  useReorderImages,
  useUploadImage,
} from "../../hooks/product/useProductImage.hook";
import { Button } from "../primitives/Button";
import { Modal } from "../primitives/Modal";
import { AdminUploadBox } from "../primitives/AdminUploadBox";

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
  const patchAltMutation = usePatchImageAlt(productId);

  async function saveAlt() {
    if (altValue === (image.alt ?? "")) return;
    try {
      await patchAltMutation.mutateAsync({ imageId: image.id, alt: altValue || null });
      onAltChange(image.id, altValue);
    } catch (err: unknown) {
      if (isApiError(err)) {
        toast.error(err.message);
      }
    }
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
          disabled={patchAltMutation.isPending}
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

export function ImagesTab({
  productId,
  initialImages,
}: {
  productId: string;
  initialImages: ProductImageInterface[];
}) {
  const [images, setImages] = useState<ProductImageInterface[]>(initialImages);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const uploadMutation = useUploadImage(productId);
  const deleteMutation = useDeleteImage(productId);
  const reorderMutation = useReorderImages(productId);

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

    try {
      await reorderMutation.mutateAsync(reordered);
      toast.success("Ordem atualizada");
    } catch (err: unknown) {
      if (isApiError(err)) {
        toast.error(err.message);
      }
    }
  }

  async function handleUpload(files: FileList) {
    if (!files || files.length === 0) return;
    
    for (const file of Array.from(files)) {
      try {
        const created = await uploadMutation.mutateAsync(file);
        setImages((prev) => [...prev, created]);
      } catch (err: unknown) {
        if (isApiError(err)) {
          toast.error(err.message);
        }
      }
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    
    try {
      await deleteMutation.mutateAsync(deleteId);
      setImages((prev) => {
        const filtered = prev.filter((i) => i.id !== deleteId);
        return filtered.map((img, idx) => ({ ...img, position: idx }));
      });
      setDeleteId(null);
      toast.success("Imagem excluída");
    } catch (err: unknown) {
      if (isApiError(err)) {
        toast.error(err.message);
        setDeleteId(null);
        return;
      }
      toast.error("Erro ao excluir imagem");
      setDeleteId(null);
    }
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
              loading={deleteMutation.isPending}
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

      <AdminUploadBox
        onFilesSelect={handleUpload}
        accept="image/jpeg,image/png,image/webp"
        multiple
        isUploading={uploadMutation.isPending}
        title="Clique para selecionar imagens"
        subtitle="JPEG · PNG · WebP — máx. 5 MB por arquivo"
        icon={<Upload size={18} />}
        themeColor="cyan"
      />

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
