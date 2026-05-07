"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, Edit2, GripVertical, Trash2 } from "lucide-react";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { HomeStoryRow } from "@features/home/types/homeStory.types";

function StoryRow({ item, onDelete }: { item: HomeStoryRow; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  const title =
    item.kind === "product"
      ? `Produto: ${item.product_id?.slice(0, 8)}…`
      : (item.title_pt ?? item.media_url ?? "Manual");

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex items-center gap-3 px-4 py-3 border-2 border-white/10 bg-[#111] hover:bg-[#181818] transition-colors"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="text-gray-600 hover:text-gray-400 cursor-grab active:cursor-grabbing"
        title="Reordenar"
      >
        <GripVertical size={18} />
      </button>

      <div className="flex-1 min-w-0">
        <span className="font-poppins font-bold text-sm text-white truncate block">{title}</span>
        <span className="font-inter text-xs text-gray-500">
          {item.kind === "product" ? "produto" : item.media_type ?? "manual"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`font-inter text-[10px] uppercase px-2 py-0.5 border ${
            item.active
              ? "border-brand-pink/50 text-brand-pink"
              : "border-white/20 text-gray-500"
          }`}
        >
          {item.active ? "ativo" : "inativo"}
        </span>

        <Link
          href={`/admin/stories/${item.id}/edit`}
          className="p-1.5 border-2 border-white/10 text-gray-400 hover:border-brand-pink hover:text-brand-pink transition-colors"
        >
          <Edit2 size={14} />
        </Link>

        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="p-1.5 border-2 border-white/10 text-gray-400 hover:border-red-500 hover:text-red-500 transition-colors"
          title="Excluir"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

interface Props {
  initialItems: HomeStoryRow[];
}

export default function StoriesListClient({ initialItems }: Props) {
  const [items, setItems] = useState(initialItems);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  async function handleEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = items.findIndex((i) => i.id === active.id);
    const newIdx = items.findIndex((i) => i.id === over.id);
    const next = arrayMove(items, oldIdx, newIdx);
    setItems(next);

    const res = await fetch("/api/admin/home-stories/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: next.map((i) => i.id) }),
    });
    if (!res.ok) toast.error("Erro ao reordenar");
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta story?")) return;
    const res = await fetch(`/api/admin/home-stories/${id}`, { method: "DELETE" });
    if (!res.ok) { toast.error("Erro ao excluir"); return; }
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("Story excluída");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-poppins font-black text-2xl text-white uppercase tracking-widest">
            Stories
          </h1>
          <Link
            href="/admin/stories/new"
            className="flex items-center gap-2 px-5 py-2.5 border-4 border-brand-pink bg-brand-pink text-white font-poppins font-black text-xs uppercase tracking-widest shadow-[4px_4px_0_#000] hover:translate-y-0.5 hover:shadow-[2px_2px_0_#000] transition-all"
          >
            <Plus size={16} />
            Nova
          </Link>
        </div>

        <DndContext collisionDetection={closestCenter} onDragEnd={handleEnd} sensors={sensors}>
          <SortableContext
            items={items.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <StoryRow key={item.id} item={item} onDelete={handleDelete} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {items.length === 0 && (
          <p className="font-inter text-sm text-gray-500 text-center py-16">
            Nenhuma story. Crie a primeira.
          </p>
        )}
      </div>
    </div>
  );
}
