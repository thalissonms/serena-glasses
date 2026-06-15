"use client";

import { clsx } from "clsx";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { HomeSection } from "../../types/homeSection/homeSection.types";
import { TYPE_OPTIONS } from "../../consts/homeSection.const";

interface Props {
  section: HomeSection;
  onEdit: (section: HomeSection) => void;
  onDelete: (section: HomeSection) => void;
  onToggleActive: (id: string, current: boolean) => void;
}

export function SortableSectionRow({
  section,
  onEdit,
  onDelete,
  onToggleActive,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const typeLabel = TYPE_OPTIONS.find((t) => t.value === section.type)?.label || section.type;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.9 : 1,
        zIndex: isDragging ? 10 : 1,
        position: "relative",
      }}
      className={clsx(
        "group flex items-center justify-between border-b border-brand-pink/10 bg-[#050505] p-3 transition-all rounded-none",
        isDragging
          ? "border-brand-pink shadow-[inset_0_0_15px_rgba(255,0,182,0.1)]"
          : "hover:bg-[#050505] hover:border-brand-pink/30"
      )}
    >
      <div className="flex items-center gap-4">
        {/* Grip Handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className={clsx(
            "flex h-8 w-4 flex-col items-center justify-center gap-1 cursor-grab active:cursor-grabbing",
            isDragging ? "text-brand-pink" : "text-white/20 group-hover:text-white/40"
          )}
        >
          <div className="h-0.5 w-full bg-current"></div>
          <div className="h-0.5 w-full bg-current"></div>
          <div className="h-0.5 w-full bg-current"></div>
        </button>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-poppins text-[16px] font-bold tracking-wide text-white">
              {section.title_pt}
            </span>
            {section.is_special_component && (
              <span className="border border-brand-pink/40 bg-brand-pink/5 px-1.5 py-0.5 font-mono text-[11px] tracking-[0.2em] text-brand-pink uppercase">
                Spec
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-[12px] text-brand-pink/70 uppercase">
              [{typeLabel}]
            </span>
            {section.type === "manual" && section.home_section_products && (
              <span className="font-mono text-[11px] text-white/40">
                {section.home_section_products.length} itens
              </span>
            )}
            {section.type === "category" && section.categories && (
              <span className="font-mono text-[11px] text-white/40">
                Cat: {section.categories.name_pt}
              </span>
            )}
            {section.type === "subcategory" && section.subcategories && (
              <span className="font-mono text-[11px] text-white/40">
                Sub: {section.subcategories.name_pt}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={section.active}
            onChange={() => onToggleActive(section.id, section.active)}
          />
          <div className="h-4 w-8 rounded-none border border-white/20 bg-transparent transition-colors peer-checked:border-brand-pink/50 peer-checked:bg-brand-pink/20 relative">
            <div className="absolute top-0.5 left-0.5 h-2.5 w-2.5 bg-white/40 transition-transform peer-checked:translate-x-4 peer-checked:bg-brand-pink"></div>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-white/40 peer-checked:text-brand-pink">
            {section.active ? "On" : "Off"}
          </span>
        </label>

        <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(section)}
            className="border border-white/10 px-3 py-1 font-mono text-[12px] text-white/60 transition-colors hover:border-brand-pink/50 hover:text-brand-pink"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => onDelete(section)}
            className="border border-white/10 px-3 py-1 font-mono text-[12px] text-white/60 transition-colors hover:border-brand-pink/50 hover:text-brand-pink"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
