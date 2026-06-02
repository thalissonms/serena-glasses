"use client";
/**
 * Component: CategoryEditClient — form de edição de categoria + subcategorias inline.
 *
 * Slug bloqueado após criação. Nomes i18n (PT/EN/ES). Icon picker modal com 30 ícones.
 * Sub-section: DnD reorder + CRUD inline (slug auto-gerado do name_pt).
 *
 * Usado em: src/app/admin/categories/[id]/page.tsx.
 */
import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { clsx } from "clsx";
import Link from "next/link";
import {
  ArrowLeft,
  Lock,
  Save,
  Plus,
  Trash2,
  GripVertical,
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
import { toSlug } from "../../utils/stringToSlug";
import SectionDivider from "../primitives/SectionDivider";


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

// ─── Subcategory Sortable Row ─────────────────────────────────────────────────

function SortableSubRow({
  sub,
  onToggleActive,
  onDelete,
}: {
  sub: SubcategoryRow;
  onToggleActive: (id: string, current: boolean) => void;
  onDelete: (id: string, name: string) => void;
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
        "flex items-center gap-3 px-3 py-3 border-b border-white/4 group",
        "bg-[#111] hover:bg-[#161616] transition-colors",
        isDragging && "shadow-[0_0_12px_rgba(255,0,182,0.1)]",
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="text-white/15 hover:text-white/30 cursor-grab active:cursor-grabbing transition-colors shrink-0"
      >
        <GripVertical size={15} />
      </button>

      <div className="flex-1 min-w-0">
        <p className="font-poppins text-[15px] text-white/70 truncate">
          {sub.name_pt}
        </p>
        {(sub.name_en || sub.name_es) && (
          <p className="font-mono text-[10px] text-white/22 mt-0.5 truncate">{"// "}{[sub.name_en, sub.name_es].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>

      <span className="font-mono text-[10px] text-white/18 shrink-0">{"// "}{sub.slug}
      </span>

      <button
        type="button"
        onClick={() => onToggleActive(sub.id, sub.active)}
        className={clsx(
          "flex items-center transition-colors shrink-0",
          sub.active
            ? "text-brand-pink/60 hover:text-brand-pink"
            : "text-white/18 hover:text-white/40",
        )}
      >
        {sub.active ? <ToggleRight size={17} /> : <ToggleLeft size={17} />}
      </button>

      <button
        type="button"
        onClick={() => onDelete(sub.id, sub.name_pt)}
        className="text-red-500/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

// ─── Subcategories Section ────────────────────────────────────────────────────

const subCreateSchema = z.object({
  slug: z
    .string()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Apenas letras minúsculas, números e hífens",
    )
    .max(40),
  name_pt: z.string().min(1, "Obrigatório").max(60),
  name_en: z.string().max(60).optional(),
  name_es: z.string().max(60).optional(),
});
type SubCreateFormData = z.infer<typeof subCreateSchema>;

function SubcategoriesSection({
  categoryId,
  initialSubs,
}: {
  categoryId: string;
  initialSubs: SubcategoryRow[];
}) {
  const [subs, setSubs] = useState<SubcategoryRow[]>(initialSubs);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const slugTouched = useRef(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SubCreateFormData>({
    resolver: zodResolver(subCreateSchema),
    defaultValues: { slug: "", name_pt: "", name_en: "", name_es: "" },
  });

  const subNameValue = watch("name_pt");
  useEffect(() => {
    if (!slugTouched.current) {
      setValue("slug", toSlug(subNameValue ?? ""), { shouldValidate: false });
    }
  }, [subNameValue, setValue]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = subs.findIndex((s) => s.id === active.id);
    const newIdx = subs.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(subs, oldIdx, newIdx);
    setSubs(reordered);
    fetch("/api/admin/subcategories/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: reordered.map((s) => s.id) }),
    }).then((r) => {
      if (!r.ok) toast.error("Erro ao reordenar subcategorias");
      else toast.success("Ordem salva");
    });
  }

  async function handleToggleActive(id: string, current: boolean) {
    const res = await fetch(`/api/admin/subcategories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !current }),
    });
    if (res.ok) {
      setSubs((prev) =>
        prev.map((s) => (s.id === id ? { ...s, active: !current } : s)),
      );
    } else {
      toast.error("Erro ao atualizar subcategoria");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await fetch(
      `/api/admin/subcategories/${deleteTarget.id}`,
      { method: "DELETE" },
    );
    setDeleting(false);
    if (res.ok) {
      setSubs((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success("Subcategoria removida");
    } else {
      toast.error("Erro ao remover subcategoria");
      setDeleteTarget(null);
    }
  }

  async function onAddSub(data: SubCreateFormData) {
    const res = await fetch(
      `/api/admin/categories/${categoryId}/subcategories`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: data.slug,
          name_pt: data.name_pt,
          ...(data.name_en ? { name_en: data.name_en } : {}),
          ...(data.name_es ? { name_es: data.name_es } : {}),
        }),
      },
    );
    if (res.status === 409) {
      setError("slug", { message: "Slug já em uso nesta categoria" });
      return;
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast.error(err.error ?? "Erro ao criar subcategoria");
      return;
    }
    const { id } = await res.json();
    setSubs((prev) => [
      ...prev,
      {
        id,
        category_id: categoryId,
        slug: data.slug,
        name_pt: data.name_pt,
        name_en: data.name_en || null,
        name_es: data.name_es || null,
        display_order: prev.length,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
    reset({ slug: "", name_pt: "", name_en: "", name_es: "" });
    slugTouched.current = false;
    setShowAddForm(false);
    toast.success("Subcategoria adicionada");
  }

  return (
    <div className="space-y-3">
      <Modal
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Remover Subcategoria"
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
              Remover
            </Button>
          </>
        }
      >
        <p className="font-mono text-[13px] text-white/60">
          Remover{" "}
          <span className="text-white font-bold">{deleteTarget?.name}</span>?
        </p>
      </Modal>

      {subs.length > 0 ? (
        <div className="border border-white/8 bg-[#0a0a0a]">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={subs.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {subs.map((sub) => (
                <SortableSubRow
                  key={sub.id}
                  sub={sub}
                  onToggleActive={handleToggleActive}
                  onDelete={(id, name) => setDeleteTarget({ id, name })}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 border border-dashed border-white/8">
          <p className="font-mono text-[11px] uppercase tracking-widest text-white/20">{"// "}Nenhuma subcategoria ainda
          </p>
        </div>
      )}

      {showAddForm ? (
        <form
          onSubmit={handleSubmit(onAddSub)}
          noValidate
          className="border border-brand-pink/20 bg-[#050505] p-4 space-y-4"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-pink/60">{"// "}Nova Subcategoria
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome PT *"
              placeholder="Ex: Quadrado"
              {...register("name_pt")}
              error={errors.name_pt?.message}
            />
            <Controller
              name="slug"
              control={control}
              render={({ field }) => (
                <Input
                  label="Slug *"
                  placeholder="quadrado"
                  {...field}
                  onChange={(e) => {
                    slugTouched.current = true;
                    field.onChange(e);
                  }}
                  error={errors.slug?.message}
                  hint="Auto-gerado"
                />
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome EN"
              placeholder="Square"
              {...register("name_en")}
            />
            <Input
              label="Nome ES"
              placeholder="Cuadrado"
              {...register("name_es")}
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
              Adicionar
            </Button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                reset();
                slugTouched.current = false;
              }}
              className="font-mono text-[11px] uppercase tracking-widest text-white/25 hover:text-white/40 transition-colors"
            >{"// "}Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className={clsx(
            "w-full flex items-center justify-center gap-2 py-3",
            "border border-dashed border-brand-pink/20",
            "font-mono text-[11px] uppercase tracking-widest text-brand-pink/40",
            "hover:text-brand-pink/70 hover:border-brand-pink/40 transition-all duration-150",
          )}
        >
          <Plus size={14} />
          Adicionar Subcategoria
        </button>
      )}
    </div>
  );
}

// ─── Main Form Schema ─────────────────────────────────────────────────────────

const categoryEditSchema = z.object({
  name_pt: z.string().min(1, "Obrigatório").max(60),
  name_en: z.string().max(60).optional(),
  name_es: z.string().max(60).optional(),
  icon_name: z.enum(ALLOWED_CATEGORY_ICONS),
  kind: z.enum(["category", "flag"]),
  href_override: z.string().max(200).optional(),
  active: z.boolean(),
});
type CategoryEditFormData = z.infer<typeof categoryEditSchema>;

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  category: CategoryWithSubs;
}

export default function CategoryEditClient({ category }: Props) {
  const [iconPickerOpen, setIconPickerOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CategoryEditFormData>({
    resolver: zodResolver(categoryEditSchema),
    defaultValues: {
      name_pt: category.name_pt,
      name_en: category.name_en ?? "",
      name_es: category.name_es ?? "",
      icon_name: category.icon_name as (typeof ALLOWED_CATEGORY_ICONS)[number],
      kind: category.kind,
      href_override: category.href_override ?? "",
      active: category.active,
    },
  });

  const iconValue = watch("icon_name");

  async function onSubmit(data: CategoryEditFormData) {
    const res = await fetch(`/api/admin/categories/${category.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name_pt: data.name_pt,
        name_en: data.name_en || null,
        name_es: data.name_es || null,
        icon_name: data.icon_name,
        kind: data.kind,
        href_override: data.href_override || null,
        active: data.active,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast.error(err.error ?? "Erro ao salvar categoria");
      return;
    }
    toast.success("Categoria atualizada");
  }

  return (
    <div className="max-w-3xl mx-auto">
      <IconPickerModal
        open={iconPickerOpen}
        onClose={() => setIconPickerOpen(false)}
        value={iconValue}
        onChange={(v) =>
          setValue(
            "icon_name",
            v as (typeof ALLOWED_CATEGORY_ICONS)[number],
          )
        }
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex flex-col gap-1.5">
          <Link
            href="/admin/categories"
            className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-white/25 hover:text-brand-pink/60 transition-colors w-fit"
          >
            <ArrowLeft size={13} />
            Categorias
          </Link>
          <div className="flex items-center gap-3">
            <div className="text-brand-pink/60 shrink-0">
              <DynamicLucideIcon name={iconValue} size={22} />
            </div>
            <h1 className="font-poppins font-black text-2xl text-white tracking-wide">
              {category.name_pt}
            </h1>
          </div>
          <div className="flex items-center gap-2 ml-0.5">
            <Lock size={12} className="text-white/15" />
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/25">{"// "}{category.slug}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <div className="bg-[#0a0a0a] border border-white/5 p-6 space-y-6">
          {/* Slug locked */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">{"// "}Slug{" "}
              <span className="text-white/18 normal-case tracking-normal">
                (bloqueado após criação)
              </span>
            </label>
            <div className="flex items-center gap-2 bg-[#050505] border-2 border-white/5 px-3 py-2.5">
              <Lock size={13} className="text-white/20 shrink-0" />
              <span className="font-mono text-[14px] text-white/30">
                {category.slug}
              </span>
            </div>
          </div>

          {/* i18n names */}
          <SectionDivider label="Nomes — i18n" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Nome PT *"
              placeholder="Óculos de Sol"
              {...register("name_pt")}
              error={errors.name_pt?.message}
            />
            <Input
              label="Nome EN"
              placeholder="Sunglasses"
              {...register("name_en")}
            />
            <Input
              label="Nome ES"
              placeholder="Gafas de Sol"
              {...register("name_es")}
            />
          </div>

          {/* Config */}
          <SectionDivider label="Configurações" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Icon picker */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">{"// "}Ícone *
              </label>
              <button
                type="button"
                onClick={() => setIconPickerOpen(true)}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 bg-[#0a0a0a] border-2 text-left",
                  "border-brand-pink/20 hover:border-brand-pink/50 transition-colors",
                )}
              >
                <DynamicLucideIcon
                  name={iconValue}
                  size={18}
                  className="text-brand-pink/70 shrink-0"
                />
                <span className="font-mono text-[13px] text-white/60 flex-1">
                  {iconValue}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/20">
                  Trocar
                </span>
              </button>
            </div>

            <Controller
              name="kind"
              control={control}
              render={({ field }) => (
                <Select
                  label="Tipo"
                  options={[
                    { value: "category", label: "Category — item de navegação" },
                    { value: "flag", label: "Flag — filtro especial" },
                  ]}
                  value={field.value}
                  onValueChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Link Override"
              placeholder="/sale ou /new-in"
              hint="Vazio = padrão /products?category=slug"
              {...register("href_override")}
            />

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">{"// "}Status
              </label>
              <Controller
                name="active"
                control={control}
                render={({ field }) => (
                  <button
                    type="button"
                    onClick={() => field.onChange(!field.value)}
                    className={clsx(
                      "flex items-center gap-2.5 px-4 py-2.5 border-2 transition-all duration-150",
                      "font-mono text-[11px] uppercase tracking-widest",
                      field.value
                        ? "border-brand-pink/40 text-brand-pink bg-brand-pink/8 shadow-[0_0_10px_rgba(255,0,182,0.12)]"
                        : "border-white/10 text-white/30 hover:border-white/20",
                    )}
                  >
                    {field.value ? (
                      <ToggleRight size={17} />
                    ) : (
                      <ToggleLeft size={17} />
                    )}
                    {field.value ? "Ativa" : "Inativa"}
                  </button>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isSubmitting}
          >
            <Save size={15} />
            Salvar Categoria
          </Button>
        </div>
      </form>

      {/* Subcategories */}
      <div className="mt-10 space-y-4">
        <SectionDivider label="Subcategorias" />
        <SubcategoriesSection
          categoryId={category.id}
          initialSubs={category.subcategories}
        />
      </div>
    </div>
  );
}
