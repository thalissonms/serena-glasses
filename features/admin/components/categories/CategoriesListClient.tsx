"use client";
/**
 * Component: CategoriesListClient — árvore de categorias com DnD em dois níveis.
 *
 * Top-level DndContext reordena categorias via POST /api/admin/categories/reorder.
 * DndContext aninhado em cada linha reordena subcategorias via POST /api/admin/subcategories/reorder.
 * Cada linha expõe: icon, name_pt, kind badge, active toggle, edit link, delete.
 *
 * Usado em: src/app/admin/categories/page.tsx.
 */
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { clsx } from "clsx";
import Link from "next/link";
import {
  GripVertical,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  ToggleLeft,
  ToggleRight,
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
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type {
  CategoryWithSubs,
  SubcategoryRow,
} from "@features/categories/types/category.types";
import { ALLOWED_CATEGORY_ICONS } from "@features/admin/consts/categoryIcons.const";
import { DynamicLucideIcon } from "@shared/components/DynamicLucideIcon";
import { Button } from "@features/admin/components/primitives/Button";
import { Input } from "@features/admin/components/primitives/Input";
import { Select } from "@features/admin/components/primitives/Select";
import { Modal } from "@features/admin/components/primitives/Modal";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toSlug(v: string): string {
  return v
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── Icon Picker Modal ────────────────────────────────────────────────────────

function IconPickerModal({
  open,
  onClose,
  value,
  onChange,
}: {
  open: boolean;
  onClose: () => void;
  value: string;
  onChange: (icon: string) => void;
}) {
  return (
    <Modal
      open={open}
      onOpenChange={(o) => !o && onClose()}
      title="Escolher Ícone"
      size="md"
    >
      <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto scrollbar-admin">
        {ALLOWED_CATEGORY_ICONS.map((icon) => (
          <button
            key={icon}
            type="button"
            onClick={() => {
              onChange(icon);
              onClose();
            }}
            className={clsx(
              "flex flex-col items-center gap-1.5 p-3 border-2 transition-all duration-150",
              value === icon
                ? "border-brand-pink/60 bg-brand-pink/10 text-brand-pink shadow-[0_0_8px_rgba(255,0,182,0.2)]"
                : "border-white/8 bg-[#0a0a0a] text-white/40 hover:border-white/20 hover:text-white/70",
            )}
          >
            <DynamicLucideIcon name={icon} size={18} />
            <span className="font-mono text-[9px] uppercase tracking-wider truncate w-full text-center">
              {icon}
            </span>
          </button>
        ))}
      </div>
    </Modal>
  );
}

// ─── Category Create Form ─────────────────────────────────────────────────────

const createSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Apenas letras minúsculas, números e hífens")
    .max(40),
  name_pt: z.string().min(1, "Obrigatório").max(60),
  icon_name: z.enum(ALLOWED_CATEGORY_ICONS),
  kind: z.enum(["category", "flag"]),
  href_override: z.string().max(200).optional(),
});
type CreateFormData = z.infer<typeof createSchema>;

function CategoryCreateForm({ onCancel }: { onCancel: () => void }) {
  const router = useRouter();
  const slugTouched = useRef(false);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateFormData>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      slug: "",
      name_pt: "",
      icon_name: "Glasses",
      kind: "category",
      href_override: "",
    },
  });

  const nameValue = watch("name_pt");
  const iconValue = watch("icon_name");

  useEffect(() => {
    if (!slugTouched.current) {
      setValue("slug", toSlug(nameValue ?? ""), { shouldValidate: false });
    }
  }, [nameValue, setValue]);

  async function onSubmit(data: CreateFormData) {
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: data.slug,
        name_pt: data.name_pt,
        icon_name: data.icon_name,
        kind: data.kind,
        href_override: data.href_override || null,
      }),
    });
    if (res.status === 409) {
      setError("slug", { message: "Slug já em uso" });
      return;
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast.error(err.error ?? "Erro ao criar categoria");
      return;
    }
    const { id } = await res.json();
    toast.success("Categoria criada");
    router.push(`/admin/categories/${id}`);
  }

  return (
    <>
      <IconPickerModal
        open={iconPickerOpen}
        onClose={() => setIconPickerOpen(false)}
        value={iconValue}
        onChange={(v) =>
          setValue("icon_name", v as (typeof ALLOWED_CATEGORY_ICONS)[number])
        }
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="border border-brand-pink/20 bg-[#050505] p-5 space-y-4"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand-pink/60">{"// "}Nova Categoria
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nome PT *"
            placeholder="Ex: Óculos de Sol"
            {...register("name_pt")}
            error={errors.name_pt?.message}
          />
          <Controller
            name="slug"
            control={control}
            render={({ field }) => (
              <Input
                label="Slug *"
                placeholder="oculos-de-sol"
                {...field}
                onChange={(e) => {
                  slugTouched.current = true;
                  field.onChange(e);
                }}
                error={errors.slug?.message}
                hint="Auto-gerado do nome"
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">{"// "}Ícone *
            </label>
            <button
              type="button"
              onClick={() => setIconPickerOpen(true)}
              className="flex items-center gap-2.5 px-3 py-2.5 bg-[#0a0a0a] border-2 border-brand-pink/20 hover:border-brand-pink/50 transition-colors"
            >
              <DynamicLucideIcon
                name={iconValue}
                size={19}
                className="text-brand-pink/70 shrink-0"
              />
              <span className="font-mono text-[12px] text-white/50 flex-1 text-left">{"// "}{iconValue}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-white/20">
                Trocar
              </span>
            </button>
            {errors.icon_name && (
              <p className="font-mono text-[11px] text-red-400">{"// "}{errors.icon_name.message}
              </p>
            )}
          </div>

          <Controller
            name="kind"
            control={control}
            render={({ field }) => (
              <Select
                label="Tipo"
                options={[
                  { value: "category", label: "Category" },
                  { value: "flag", label: "Flag" },
                ]}
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />

          <Input
            label="Link Override"
            placeholder="/sale"
            {...register("href_override")}
            hint="Opcional"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={isSubmitting}
          >
            <Plus size={14} />
            Criar e Editar
          </Button>
          <button
            type="button"
            onClick={onCancel}
            className="font-mono text-[11px] uppercase tracking-widest text-white/25 hover:text-white/40 transition-colors"
          >{"// "}Cancelar
          </button>
        </div>
      </form>
    </>
  );
}

// ─── Sortable Subcategory Row ─────────────────────────────────────────────────

function SortableSubRow({
  sub,
  onDelete,
  onToggleActive,
}: {
  sub: SubcategoryRow;
  onDelete: (id: string, name: string) => void;
  onToggleActive: (id: string, current: boolean) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sub.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
      className={clsx(
        "flex items-center gap-3 pl-12 pr-3 py-2.5",
        "border-b border-white/4 bg-[#050505] group",
        "hover:bg-[#0a0a0a] transition-colors",
        isDragging && "shadow-[0_0_12px_rgba(255,0,182,0.1)]",
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="text-white/12 hover:text-white/30 cursor-grab active:cursor-grabbing transition-colors shrink-0"
      >
        <GripVertical size={14} />
      </button>
      <span className="w-px h-3 bg-white/8 shrink-0" />
      <span className="flex-1 font-poppins text-[14px] text-white/45 truncate">
        {sub.name_pt}
      </span>
      <button
        type="button"
        onClick={() => onToggleActive(sub.id, sub.active)}
        className={clsx(
          "flex items-center transition-colors shrink-0",
          sub.active
            ? "text-brand-pink/50 hover:text-brand-pink"
            : "text-white/15 hover:text-white/35",
        )}
      >
        {sub.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
      </button>
      <button
        type="button"
        onClick={() => onDelete(sub.id, sub.name_pt)}
        className="text-red-500/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

// ─── Sortable Category Row ────────────────────────────────────────────────────

function SortableCategoryRow({
  category,
  onDelete,
  onToggleActive,
  onSubsChanged,
}: {
  category: CategoryWithSubs;
  onDelete: (id: string, name: string) => void;
  onToggleActive: (id: string, current: boolean) => void;
  onSubsChanged: (categoryId: string, subs: SubcategoryRow[]) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const [expanded, setExpanded] = useState(false);
  const [subs, setSubs] = useState<SubcategoryRow[]>(category.subcategories);
  const [deleteSubTarget, setDeleteSubTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deletingSubbing, setDeletingSubbing] = useState(false);

  const subSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  function handleSubDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = subs.findIndex((s) => s.id === active.id);
    const newIdx = subs.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(subs, oldIdx, newIdx);
    setSubs(reordered);
    onSubsChanged(category.id, reordered);
    fetch("/api/admin/subcategories/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: reordered.map((s) => s.id) }),
    }).then((r) => {
      if (!r.ok) toast.error("Erro ao reordenar subcategorias");
    });
  }

  async function handleSubToggleActive(subId: string, current: boolean) {
    const res = await fetch(`/api/admin/subcategories/${subId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !current }),
    });
    if (res.ok) {
      setSubs((prev) =>
        prev.map((s) => (s.id === subId ? { ...s, active: !current } : s)),
      );
    } else {
      toast.error("Erro ao atualizar subcategoria");
    }
  }

  async function confirmSubDelete() {
    if (!deleteSubTarget) return;
    setDeletingSubbing(true);
    const res = await fetch(
      `/api/admin/subcategories/${deleteSubTarget.id}`,
      { method: "DELETE" },
    );
    setDeletingSubbing(false);
    if (res.ok) {
      setSubs((prev) =>
        prev.filter((s) => s.id !== deleteSubTarget.id),
      );
      setDeleteSubTarget(null);
      toast.success("Subcategoria removida");
    } else {
      toast.error("Erro ao remover subcategoria");
      setDeleteSubTarget(null);
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
      className={clsx(
        "border-b border-white/5",
        isDragging && "shadow-[0_0_20px_rgba(255,0,182,0.12)]",
      )}
    >
      <Modal
        open={!!deleteSubTarget}
        onOpenChange={(o) => !o && setDeleteSubTarget(null)}
        title="Remover Subcategoria"
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDeleteSubTarget(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={deletingSubbing}
              onClick={confirmSubDelete}
            >
              <Trash2 size={14} />
              Remover
            </Button>
          </>
        }
      >
        <p className="font-mono text-[13px] text-white/60">
          Remover{" "}
          <span className="text-white font-bold">{deleteSubTarget?.name}</span>
          ?
        </p>
      </Modal>

      {/* Category row */}
      <div className="flex items-center gap-3 px-3 py-3 hover:bg-white/[0.02] transition-colors group">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="text-white/15 hover:text-white/35 cursor-grab active:cursor-grabbing transition-colors shrink-0"
        >
          <GripVertical size={17} />
        </button>

        <button
          type="button"
          onClick={() => setExpanded((p) => !p)}
          className="text-white/25 hover:text-white/55 transition-colors shrink-0"
        >
          {expanded ? (
            <ChevronDown size={15} />
          ) : (
            <ChevronRight size={15} />
          )}
        </button>

        <div className="shrink-0 w-5 h-5 flex items-center justify-center text-brand-pink/55">
          <DynamicLucideIcon name={category.icon_name} size={19} />
        </div>

        <span className="flex-1 font-poppins font-semibold text-[15px] text-white truncate">
          {category.name_pt}
        </span>

        {subs.length > 0 && (
          <span className="font-mono text-[10px] text-white/18 shrink-0">{"// "}{subs.length} sub{subs.length > 1 ? "s" : ""}
          </span>
        )}

        <span
          className={clsx(
            "font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 border shrink-0",
            category.kind === "flag"
              ? "border-brand-pink/25 text-brand-pink/50"
              : "border-white/10 text-white/22",
          )}
        >
          {category.kind}
        </span>

        <button
          type="button"
          onClick={() => onToggleActive(category.id, category.active)}
          className={clsx(
            "flex items-center transition-colors shrink-0",
            category.active
              ? "text-brand-pink/60 hover:text-brand-pink"
              : "text-white/18 hover:text-white/40",
          )}
        >
          {category.active ? (
            <ToggleRight size={18} />
          ) : (
            <ToggleLeft size={18} />
          )}
        </button>

        <Link
          href={`/admin/categories/${category.id}`}
          className="text-white/18 hover:text-brand-pink/60 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
        >
          <Edit2 size={15} />
        </Link>

        <button
          type="button"
          onClick={() => onDelete(category.id, category.name_pt)}
          className="text-red-500/18 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Subcategories */}
      {expanded && (
        <>
          {subs.length > 0 ? (
            <DndContext
              sensors={subSensors}
              collisionDetection={closestCenter}
              onDragEnd={handleSubDragEnd}
            >
              <SortableContext
                items={subs.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                {subs.map((sub) => (
                  <SortableSubRow
                    key={sub.id}
                    sub={sub}
                    onDelete={(id, name) =>
                      setDeleteSubTarget({ id, name })
                    }
                    onToggleActive={handleSubToggleActive}
                  />
                ))}
              </SortableContext>
            </DndContext>
          ) : (
            <div className="pl-12 pr-3 py-3 border-b border-white/4 bg-[#050505]">
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/15">{"// "}Sem subcategorias — adicione no edit
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  initialCategories: CategoryWithSubs[];
}

export default function CategoriesListClient({ initialCategories }: Props) {
  const [categories, setCategories] =
    useState<CategoryWithSubs[]>(initialCategories);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  async function handleCategoryDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = categories.findIndex((c) => c.id === active.id);
    const newIdx = categories.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(categories, oldIdx, newIdx);
    setCategories(reordered);
    const res = await fetch("/api/admin/categories/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: reordered.map((c) => c.id) }),
    });
    if (!res.ok) toast.error("Erro ao reordenar categorias");
    else toast.success("Ordem salva");
  }

  async function handleToggleActive(id: string, current: boolean) {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !current }),
    });
    if (res.ok) {
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, active: !current } : c)),
      );
    } else {
      toast.error("Erro ao atualizar categoria");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/categories/${deleteTarget.id}`, {
      method: "DELETE",
    });
    setDeleting(false);
    if (res.ok) {
      setCategories((prev) =>
        prev.filter((c) => c.id !== deleteTarget.id),
      );
      setDeleteTarget(null);
      toast.success("Categoria desativada");
    } else {
      toast.error("Erro ao desativar categoria");
      setDeleteTarget(null);
    }
  }

  function handleSubsChanged(categoryId: string, subs: SubcategoryRow[]) {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId ? { ...c, subcategories: subs } : c,
      ),
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Modal
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Desativar Categoria"
        description="A categoria será ocultada da loja. Pode ser reativada no edit."
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDeleteTarget(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={deleting}
              onClick={confirmDelete}
            >
              <Trash2 size={14} />
              Desativar
            </Button>
          </>
        }
      >
        <p className="font-mono text-[13px] text-white/60">
          Desativar{" "}
          <span className="text-white font-bold">{deleteTarget?.name}</span>?
        </p>
      </Modal>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 mb-6">
        <div>
          <h1 className="font-poppins font-black text-2xl text-white tracking-wide">
            Categorias
          </h1>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/25 mt-0.5">{"// "}{categories.length} categori{categories.length === 1 ? "a" : "as"}{" "}
            · arraste para reordenar
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowCreate((p) => !p)}
        >
          <Plus size={14} />
          Nova Categoria
        </Button>
      </div>

      {showCreate && (
        <div className="mb-4">
          <CategoryCreateForm onCancel={() => setShowCreate(false)} />
        </div>
      )}

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-white/8">
          <p className="font-mono text-[11px] uppercase tracking-widest text-white/20">{"// "}Nenhuma categoria — crie a primeira
          </p>
        </div>
      ) : (
        <div className="border border-white/8 bg-[#0a0a0a]">
          {/* Table header */}
          <div className="flex items-center gap-3 px-3 py-2 border-b border-white/8 bg-[#050505]">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/20 ml-11">{"// "}Nome
            </span>
            <span className="flex-1" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/20 pr-14">{"// "}Tipo · Ativo
            </span>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleCategoryDragEnd}
          >
            <SortableContext
              items={categories.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {categories.map((cat) => (
                <SortableCategoryRow
                  key={cat.id}
                  category={cat}
                  onDelete={(id, name) => setDeleteTarget({ id, name })}
                  onToggleActive={handleToggleActive}
                  onSubsChanged={handleSubsChanged}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}
