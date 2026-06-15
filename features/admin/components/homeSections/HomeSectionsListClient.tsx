"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
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
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { HomeSection } from "../../types/homeSection/homeSection.types";
import { CategoryWithSubs } from "@features/categories/types/category.types";
import { Button } from "../primitives/Button";
import { Modal } from "../primitives/Modal";

import { useHomeSections } from "../../hooks/homeSection/useHomeSections.hook";
import {
  useDeleteHomeSection,
  useReorderHomeSections,
  useToggleHomeSectionActive,
} from "../../hooks/homeSection/useHomeSectionMutations.hook";

import { HomeSectionForm } from "./HomeSectionForm";
import { SortableSectionRow } from "./SortableSectionRow";

interface Props {
  initialSections: HomeSection[];
  categories: CategoryWithSubs[];
}

export default function HomeSectionsListClient({ initialSections, categories }: Props) {
  const { data: serverSections = initialSections } = useHomeSections();
  const [sections, setSections] = useState<HomeSection[]>(serverSections);
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<HomeSection | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<HomeSection | null>(null);

  const reorderMutation = useReorderHomeSections();
  const deleteMutation = useDeleteHomeSection();
  const toggleActiveMutation = useToggleHomeSectionActive();

  useEffect(() => {
    setSections(serverSections);
  }, [serverSections]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIdx = sections.findIndex((c) => c.id === active.id);
    const newIdx = sections.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(sections, oldIdx, newIdx);

    // Update local state instantly for UI
    setSections(reordered);

    // Call mutation
    const payload = reordered.map((s, index) => ({ id: s.id, display_order: index }));
    try {
      await reorderMutation.mutateAsync(payload);
      toast.success("Ordem salva");
    } catch (err) {
      console.error(err)
      toast.error("Erro ao reordenar seções");
      setSections(serverSections);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success("Seção excluída");
    } catch (err) {
      console.error(err)
      toast.error("Erro ao excluir seção");
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Modal
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Excluir Seção"
        description="Tem certeza que deseja excluir esta seção da página inicial?"
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={deleteMutation.isPending}
              onClick={confirmDelete}
            >
              <Trash2 size={14} />
              Excluir
            </Button>
          </>
        }
      >
        <p className="font-mono text-[13px] text-white/60">
          Excluir <span className="font-bold text-white">{deleteTarget?.title_pt}</span>?
        </p>
      </Modal>

      {/* Header */}
      <div className="mb-8 flex items-end justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="font-shrikhand text-2xl tracking-wide text-white">
            SEÇÕES DA HOME
          </h1>
          <div className="mt-1 flex items-center gap-3">
            <span className="font-mono text-[12px] tracking-[0.2em] text-brand-pink/60 uppercase">
              STATUS: {sections.length} ATIVAS
            </span>
            <div className="h-px w-12 bg-gradient-to-r from-brand-pink/50 to-transparent"></div>
          </div>
        </div>
        <button
          onClick={() => {
            setEditTarget(null);
            setShowCreate((p) => !p);
          }}
          className="group relative flex items-center gap-2 overflow-hidden border border-brand-pink/30 bg-brand-pink/5 px-4 py-2 font-mono text-[12px] uppercase tracking-widest text-brand-pink transition-all hover:bg-brand-pink/10"
        >
          <div className="absolute left-0 top-0 h-full w-[2px] bg-brand-pink"></div>
          <Plus size={15} className="transition-transform group-hover:rotate-90" />
          [ NOVA SEÇÃO ]
        </button>
      </div>

      {(showCreate || editTarget) && (
        <div className="mb-6 relative">
          {/* Cyber accents for form wrapper */}
          <div className="absolute -left-1 -top-1 h-2 w-2 border-l border-t border-brand-pink"></div>
          <div className="absolute -right-1 -top-1 h-2 w-2 border-r border-t border-brand-pink"></div>
          <div className="absolute -left-1 -bottom-1 h-2 w-2 border-l border-b border-brand-pink"></div>
          <div className="absolute -right-1 -bottom-1 h-2 w-2 border-r border-b border-brand-pink"></div>
          
          <HomeSectionForm
            categories={categories}
            initialData={editTarget || undefined}
            onCancel={() => {
              setShowCreate(false);
              setEditTarget(null);
            }}
          />
        </div>
      )}

      {sections.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-white/10 bg-[#050505] py-20">
          <p className="font-mono text-[12px] tracking-[0.2em] text-white/30 uppercase">
            [ MEMÓRIA VAZIA ]
          </p>
          <p className="mt-2 font-mono text-[11px] text-white/20 uppercase">
            NENHUMA SEÇÃO CONFIGURADA
          </p>
        </div>
      ) : (
        <div className="border border-white/10 bg-[#050505] shadow-[inset_0_0_15px_rgba(255,0,182,0.05)] rounded-none">
          <div className="flex items-center gap-3 border-b border-white/10 bg-[#000000] px-4 py-2">
            <span className="font-mono text-[10px] tracking-[0.3em] text-brand-pink/40 uppercase">
              {"//"} POS
            </span>
            <span className="ml-5 font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase">
              DADOS DA SEÇÃO
            </span>
            <span className="flex-1" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase">
              STATUS
            </span>
            <span className="w-[100px]" /> {/* Spacer for actions */}
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {sections.map((section) => (
                <SortableSectionRow
                  key={section.id}
                  section={section}
                  onEdit={setEditTarget}
                  onDelete={setDeleteTarget}
                  onToggleActive={async (id, current) => {
                    try {
                      await toggleActiveMutation.mutateAsync({ id, active: !current });
                      setSections((prev) =>
                        prev.map((s) => (s.id === id ? { ...s, active: !current } : s))
                      );
                    } catch (err) {
                      console.error(err)
                      toast.error("Erro ao atualizar status");
                    }
                  }}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}
