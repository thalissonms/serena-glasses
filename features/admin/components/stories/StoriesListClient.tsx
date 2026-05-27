"use client";
/**
 * Component: StoriesListClient — grid de home_stories com DnD reorder e ações CRUD.
 *
 * Cards 9:16 com preview de mídia, kind badge, avatar label e active indicator.
 * Drag-and-drop reorder via @dnd-kit → POST /api/admin/home-stories/reorder.
 * Delete: DELETE /api/admin/home-stories/[id].
 *
 * Usado em: /admin/stories.
 */
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, GripVertical, Pencil, Trash2, Package, ImageIcon, VideoIcon } from "lucide-react";
import type { HomeStoryRow } from "@features/home/types/homeStory.types";

interface Props {
  stories: HomeStoryRow[];
}

interface CardProps {
  story: HomeStoryRow;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

function StoryCard({ story, onEdit, onDelete, isDeleting }: CardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: story.id,
  });

  const isVideo = story.media_type === "video";
  const isProduct = story.kind === "product";
  const kindColor = isProduct ? "#00F0FF" : "#FF00B6";
  const kindLabel = isProduct ? "PRODUCT" : isVideo ? "VIDEO" : "IMAGE";

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
      className={`relative border-2 ${story.active ? "border-white/20" : "border-white/8"} bg-[#1a1a1a] shadow-[4px_4px_0_#000] hover:border-[#00F0FF]/30 transition-colors group`}
    >
      <div className="aspect-9/16 relative overflow-hidden bg-[#0f0f0f]">
        {story.media_url && !isVideo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={story.media_url}
            alt={story.title_pt ?? "story"}
            className="w-full h-full object-cover"
          />
        ) : story.media_url && isVideo ? (
          <div className="w-full h-full flex items-center justify-center bg-[#111]">
            <VideoIcon size={22} className="text-white/20" />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {isProduct ? (
              <Package size={22} className="text-white/20" />
            ) : (
              <ImageIcon size={22} className="text-white/20" />
            )}
          </div>
        )}

        {story.avatar_label && (
          <div className="absolute top-2 left-2 font-mono text-[9px] font-bold uppercase bg-[#FF00B6] text-black px-1.5 py-0.5 leading-none">
            {story.avatar_label}
          </div>
        )}

        <div
          className={`absolute top-2 right-2 w-2 h-2 rounded-full ${story.active ? "bg-[#00F0FF] shadow-[0_0_6px_#00F0FF]" : "bg-white/15"}`}
        />

        {story.title_pt && (
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent px-2 py-3">
            <p className="font-poppins text-[10px] font-semibold text-white leading-tight line-clamp-2">
              {story.title_pt}
            </p>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            {...listeners}
            {...attributes}
            className="p-2 bg-[#1a1a1a] border border-white/20 text-white/50 hover:text-white cursor-grab active:cursor-grabbing"
            title="Arrastar para reordenar"
          >
            <GripVertical size={13} />
          </button>
          <button
            onClick={() => onEdit(story.id)}
            className="p-2 bg-[#1a1a1a] border border-white/20 text-white/50 hover:text-[#00F0FF]"
            title="Editar"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(story.id)}
            disabled={isDeleting}
            className="p-2 bg-[#1a1a1a] border border-white/20 text-white/50 hover:text-[#FF00B6] disabled:opacity-25"
            title="Deletar"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="px-2 py-1.5 border-t border-white/5">
        <div className="flex items-center justify-between">
          <span
            className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border"
            style={{ borderColor: `${kindColor}40`, color: kindColor }}
          >
            {kindLabel}
          </span>
          <span className="font-mono text-[9px] text-white/20">#{story.display_order}</span>
        </div>
      </div>
    </div>
  );
}

export default function StoriesListClient({ stories: initial }: Props) {
  const router = useRouter();
  const [stories, setStories] = useState(initial);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIdx = stories.findIndex((s) => s.id === active.id);
      const newIdx = stories.findIndex((s) => s.id === over.id);
      const reordered = arrayMove(stories, oldIdx, newIdx);
      setStories(reordered);

      setReordering(true);
      try {
        const res = await fetch("/api/admin/home-stories/reorder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: reordered.map((s) => s.id) }),
        });
        if (!res.ok) throw new Error();
        toast.success("Ordem salva");
      } catch {
        toast.error("Erro ao salvar ordem");
        setStories(initial);
      } finally {
        setReordering(false);
      }
    },
    [stories, initial],
  );

  async function handleDelete(id: string) {
    if (!confirm("Deletar este story permanentemente?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/home-stories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setStories((prev) => prev.filter((s) => s.id !== id));
      toast.success("Story removido");
    } catch {
      toast.error("Falha ao remover story");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-shrikhand text-3xl text-white tracking-wider">STORIES</h1>
          <p className="font-mono text-[10px] text-white/30 mt-1 uppercase tracking-widest">
            {stories.length} stor{stories.length !== 1 ? "ies" : "y"} — arraste para reordenar
            {reordering && " — salvando…"}
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/stories/new")}
          className="flex items-center gap-2 bg-linear-to-r from-[#FF00B6] to-[#00F0FF] text-black font-mono text-xs font-bold uppercase tracking-widest px-4 py-2 border-2 border-black shadow-[4px_4px_0_#000] hover:-translate-x-px hover:-translate-y-px hover:shadow-[5px_5px_0_#000] transition-all"
        >
          <Plus size={14} />
          Novo Story
        </button>
      </div>

      {stories.length === 0 ? (
        <div className="border-2 border-dashed border-white/10 bg-[#0f0f0f] p-20 text-center">
          <div className="font-mono text-white/15 text-xs uppercase tracking-[0.4em]">
            NENHUM STORY CADASTRADO
          </div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={stories.map((s) => s.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {stories.map((s) => (
                <StoryCard
                  key={s.id}
                  story={s}
                  onEdit={(id) => router.push(`/admin/stories/${id}`)}
                  onDelete={handleDelete}
                  isDeleting={deleting === s.id}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
