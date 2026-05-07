"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, Edit2, GripVertical } from "lucide-react";
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
import type { CategoryWithSubs } from "@features/categories/types/category.types";
import { DynamicLucideIcon } from "@shared/components/DynamicLucideIcon";

function CategoryRow({ item }: { item: CategoryWithSubs }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
  });
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

      <DynamicLucideIcon name={item.icon_name} size={18} className="text-brand-pink shrink-0" />

      <div className="flex-1 min-w-0">
        <span className="font-poppins font-bold text-sm text-white">{item.name_pt}</span>
        <span className="font-inter text-xs text-gray-500 ml-2">/{item.slug}</span>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`font-inter text-[10px] uppercase px-2 py-0.5 border ${
            item.kind === "flag"
              ? "border-brand-blue/50 text-brand-blue"
              : "border-white/20 text-gray-400"
          }`}
        >
          {item.kind}
        </span>

        {item.kind === "category" && (
          <span className="font-inter text-[10px] text-gray-500">
            {item.subcategories.length} subs
          </span>
        )}

        {!item.active && (
          <span className="font-inter text-[10px] text-red-400 uppercase">inativo</span>
        )}

        <Link
          href={`/admin/categories/${item.id}/edit`}
          className="p-1.5 border-2 border-white/10 text-gray-400 hover:border-brand-pink hover:text-brand-pink transition-colors"
        >
          <Edit2 size={14} />
        </Link>
      </div>
    </div>
  );
}

interface Props {
  initialItems: CategoryWithSubs[];
}

export default function CategoryListClient({ initialItems }: Props) {
  const [items, setItems] = useState(initialItems);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  async function handleEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = items.findIndex((i) => i.id === active.id);
    const newIdx = items.findIndex((i) => i.id === over.id);
    const next = arrayMove(items, oldIdx, newIdx);
    setItems(next);

    const res = await fetch("/api/admin/categories/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: next.map((i) => i.id) }),
    });
    if (!res.ok) toast.error("Erro ao reordenar");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-poppins font-black text-2xl text-white uppercase tracking-widest">
            Categorias
          </h1>
          <Link
            href="/admin/categories/new"
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
                <CategoryRow key={item.id} item={item} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {items.length === 0 && (
          <p className="font-inter text-sm text-gray-500 text-center py-16">
            Nenhuma categoria. Crie a primeira.
          </p>
        )}
      </div>
    </div>
  );
}
