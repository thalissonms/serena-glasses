"use client";
/**
 * Component: ProductCreateForm — formulário multi-tab de criação de produto Y2K Chrome.
 *
 * Tabs: Detalhes / Textos & SEO / Mídia. Todos os campos renderizam no DOM (tabs com
 * hidden/show) para que React Hook Form registre todos os campos independente da aba ativa.
 * POST core fields → PATCH campos opcionais → redirect para edit page.
 *
 * Usado em: src/app/admin-v2/products/new/page.tsx.
 */
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { clsx } from "clsx";
import Link from "next/link";
import { ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import type { CategoryRow } from "@features/categories/types/category.types";
import { FRAME_SHAPES, FRAME_MATERIALS, LENS_TYPES } from "@features/admin/schemas/productEdit.schema";
import { Button } from "@features/admin-v2/components/primitives/Button";
import { Input } from "@features/admin-v2/components/primitives/Input";
import { Select } from "@features/admin-v2/components/primitives/Select";

interface Props {
  categories: CategoryRow[];
}

const formSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(120, "Máximo 120 caracteres"),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Apenas a-z, 0-9 e hífens")
    .max(120),
  price: z.string().refine((v) => {
    const n = parseFloat(v.replace(",", "."));
    return !isNaN(n) && n > 0;
  }, "Preço inválido — ex: 199,90"),
  compare_at_price: z
    .string()
    .optional()
    .refine((v) => {
      if (!v || v === "") return true;
      const n = parseFloat(v.replace(",", "."));
      return !isNaN(n) && n >= 0;
    }, "Valor inválido"),
  weight: z.string().refine((v) => {
    const n = parseInt(v, 10);
    return !isNaN(n) && n >= 1;
  }, "Mínimo 1 grama"),
  category_id: z.string().optional(),
  max_installments: z.string().optional(),
  description: z.string().max(5000, "Máximo 5000 caracteres").optional(),
  short_description: z.string().max(500, "Máximo 500 caracteres").optional(),
  featured: z.boolean(),
  is_new: z.boolean(),
  is_sale: z.boolean(),
  is_outlet: z.boolean(),
  frame_shape: z.string().optional(),
  frame_material: z.string().optional(),
  lens_type: z.string().optional(),
  seo_title: z.string().max(200, "Máximo 200 caracteres").optional(),
  seo_description: z.string().max(500, "Máximo 500 caracteres").optional(),
});

type FormData = z.infer<typeof formSchema>;

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parsePrice(v: string): number {
  return Math.round(parseFloat(v.replace(",", ".")) * 100);
}

type TabId = "details" | "texts" | "media";

const TABS: { id: TabId; label: string }[] = [
  { id: "details", label: "Detalhes" },
  { id: "texts", label: "Textos & SEO" },
  { id: "media", label: "Mídia" },
];

const DETAILS_FIELDS: (keyof FormData)[] = ["name", "slug", "price", "weight"];
const TEXTS_FIELDS: (keyof FormData)[] = ["description", "seo_title", "seo_description"];

const FRAME_SHAPE_OPTIONS = [
  { value: "", label: "Sem forma" },
  ...FRAME_SHAPES.map((s) => ({ value: s, label: s })),
];
const FRAME_MATERIAL_OPTIONS = [
  { value: "", label: "Sem material" },
  ...FRAME_MATERIALS.map((s) => ({ value: s, label: s })),
];
const LENS_TYPE_OPTIONS = [
  { value: "", label: "Sem tipo" },
  ...LENS_TYPES.map((s) => ({ value: s, label: s })),
];
const INSTALLMENTS_OPTIONS = [
  { value: "1", label: "1x (sem parcelamento)" },
  ...Array.from({ length: 11 }, (_, i) => ({
    value: String(i + 2),
    label: `até ${i + 2}x`,
  })),
];

const FLAG_LABELS: { key: keyof FormData; label: string; color: string }[] = [
  { key: "featured", label: "Destaque", color: "#FFD700" },
  { key: "is_new", label: "Novidade", color: "#00F0FF" },
  { key: "is_sale", label: "Sale", color: "#FF00B6" },
  { key: "is_outlet", label: "Outlet", color: "#FF7700" },
];

export default function ProductCreateForm({ categories }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("details");
  const slugTouched = useRef(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      price: "",
      compare_at_price: "",
      weight: "",
      category_id: "",
      max_installments: "1",
      description: "",
      short_description: "",
      featured: false,
      is_new: false,
      is_sale: false,
      is_outlet: false,
      frame_shape: "",
      frame_material: "",
      lens_type: "",
      seo_title: "",
      seo_description: "",
    },
  });

  const nameValue = watch("name");

  useEffect(() => {
    if (!slugTouched.current) {
      setValue("slug", toSlug(nameValue ?? ""), { shouldValidate: false });
    }
  }, [nameValue, setValue]);

  const detailsHasError = DETAILS_FIELDS.some((k) => k in errors);
  const textsHasError = TEXTS_FIELDS.some((k) => k in errors);

  async function onSubmit(data: FormData) {
    const priceInt = parsePrice(data.price);
    const weightInt = parseInt(data.weight, 10);

    const createPayload: Record<string, unknown> = {
      name: data.name,
      slug: data.slug,
      price: priceInt,
      weight: weightInt,
    };
    if (data.category_id) createPayload.category_id = data.category_id;

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createPayload),
    });

    if (res.status === 409) {
      setError("slug", { message: "Slug já em uso — tente outro" });
      setActiveTab("details");
      return;
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast.error(err.error ?? "Erro ao criar produto");
      return;
    }

    const { id, code } = await res.json();

    const patchPayload: Record<string, unknown> = {};
    if (data.compare_at_price) patchPayload.compare_at_price = parsePrice(data.compare_at_price);
    if (data.description) patchPayload.description = data.description;
    if (data.short_description) patchPayload.short_description = data.short_description;
    if (data.max_installments && data.max_installments !== "1") {
      patchPayload.max_installments = parseInt(data.max_installments, 10);
    }
    if (data.featured) patchPayload.featured = true;
    if (data.is_new) patchPayload.is_new = true;
    if (data.is_sale) patchPayload.is_sale = true;
    if (data.is_outlet) patchPayload.is_outlet = true;
    if (data.frame_shape) patchPayload.frame_shape = data.frame_shape;
    if (data.frame_material) patchPayload.frame_material = data.frame_material;
    if (data.lens_type) patchPayload.lens_type = data.lens_type;
    if (data.seo_title) patchPayload.seo_title = data.seo_title;
    if (data.seo_description) patchPayload.seo_description = data.seo_description;

    if (Object.keys(patchPayload).length > 0) {
      await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patchPayload),
      });
    }

    toast.success(`Produto criado! SKU: ${code}`);
    router.push(`/admin-v2/products/${id}`);
  }

  const categoryOptions = [
    { value: "", label: "Sem categoria" },
    ...categories.filter((c) => c.active).map((c) => ({ value: c.id, label: c.name_pt })),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Tab header */}
      <div className="flex border-b border-white/8 bg-[#1a1a1a]">
        {TABS.map((tab) => {
          const hasError =
            (tab.id === "details" && detailsHasError) ||
            (tab.id === "texts" && textsHasError);
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "relative px-5 py-3 font-mono text-[9px] uppercase tracking-[0.2em] transition-colors duration-150 flex items-center gap-1.5",
                "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px]",
                "after:bg-[#FF00B6] after:transition-transform after:duration-200 after:origin-left",
                "outline-none",
                activeTab === tab.id
                  ? "text-white after:scale-x-100"
                  : "text-white/30 hover:text-white/60 after:scale-x-0",
              )}
            >
              {tab.label}
              {hasError && (
                <AlertCircle size={9} className="text-red-400 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab panels — all always in DOM */}
      <div className="bg-[#141414] border border-white/5 border-t-0 p-6">
        {/* DETALHES */}
        <div className={clsx(activeTab !== "details" && "hidden")}>
          {/* SKU hint */}
          <div className="flex items-center gap-2 mb-6 p-3 border border-[#00F0FF]/15 bg-[#00F0FF]/5">
            <Sparkles size={11} className="text-[#00F0FF] flex-shrink-0" />
            <p className="font-mono text-[9px] uppercase tracking-widest text-[#00F0FF]/60">
              O código SKU será gerado automaticamente após salvar — formato: CAT-0001
            </p>
          </div>

          {/* Row 1: name + slug */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Input
                label="Nome *"
                placeholder="Ex: Óculos de Sol Vintage"
                {...register("name")}
                error={errors.name?.message}
              />
            </div>
            <div>
              <Controller
                name="slug"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Slug *"
                    placeholder="ex: oculos-sol-vintage"
                    {...field}
                    onChange={(e) => {
                      slugTouched.current = true;
                      field.onChange(e);
                    }}
                    error={errors.slug?.message}
                    hint="Auto-gerado a partir do nome"
                  />
                )}
              />
            </div>
          </div>

          {/* Row 2: price + compare + weight + installments */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <Input
                label="Preço (R$) *"
                placeholder="0,00"
                inputMode="decimal"
                {...register("price")}
                error={errors.price?.message}
              />
            </div>
            <div>
              <Input
                label="Preço Original (R$)"
                placeholder="0,00"
                inputMode="decimal"
                {...register("compare_at_price")}
                error={errors.compare_at_price?.message}
                hint="Preço riscado (opcional)"
              />
            </div>
            <div>
              <Input
                label="Peso (g) *"
                placeholder="150"
                inputMode="numeric"
                {...register("weight")}
                error={errors.weight?.message}
                hint="Peso em gramas"
              />
            </div>
            <div>
              <Controller
                name="max_installments"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Max. Parcelas"
                    options={INSTALLMENTS_OPTIONS}
                    value={field.value ?? "1"}
                    onValueChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>

          {/* Row 3: category */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <Controller
                name="category_id"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Categoria"
                    options={categoryOptions}
                    value={field.value ?? ""}
                    onValueChange={(v) => field.onChange(v === "" ? "" : v)}
                    error={errors.category_id?.message}
                  />
                )}
              />
            </div>
          </div>

          {/* Physical attributes */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px flex-1 bg-white/5" />
              <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/20">
                Atributos Físicos
              </span>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Controller
                name="frame_shape"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Forma da Armação"
                    options={FRAME_SHAPE_OPTIONS}
                    value={field.value ?? ""}
                    onValueChange={(v) => field.onChange(v === "" ? "" : v)}
                  />
                )}
              />
              <Controller
                name="frame_material"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Material"
                    options={FRAME_MATERIAL_OPTIONS}
                    value={field.value ?? ""}
                    onValueChange={(v) => field.onChange(v === "" ? "" : v)}
                  />
                )}
              />
              <Controller
                name="lens_type"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Tipo de Lente"
                    options={LENS_TYPE_OPTIONS}
                    value={field.value ?? ""}
                    onValueChange={(v) => field.onChange(v === "" ? "" : v)}
                  />
                )}
              />
            </div>
          </div>

          {/* Flags */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px flex-1 bg-white/5" />
              <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/20">
                Flags
              </span>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {FLAG_LABELS.map(({ key, label, color }) => (
                <Controller
                  key={key}
                  name={key as "featured" | "is_new" | "is_sale" | "is_outlet"}
                  control={control}
                  render={({ field }) => (
                    <button
                      type="button"
                      onClick={() => field.onChange(!field.value)}
                      className={clsx(
                        "px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest border-2 transition-all duration-150",
                        !field.value && "border-white/10 text-white/25 hover:border-white/25 bg-transparent",
                      )}
                      style={
                        field.value
                          ? {
                              color,
                              borderColor: `${color}60`,
                              backgroundColor: `${color}12`,
                              boxShadow: `0 0 10px ${color}25`,
                            }
                          : undefined
                      }
                    >
                      {label}
                    </button>
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* TEXTOS & SEO */}
        <div className={clsx(activeTab !== "texts" && "hidden")}>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
                Descrição Curta
              </label>
              <textarea
                {...register("short_description")}
                rows={3}
                placeholder="Uma frase que resume o produto..."
                className={clsx(
                  "w-full bg-[#1a1a1a] border-2 border-[#FF00B6]/20 px-3 py-2.5",
                  "font-mono text-[12px] text-white placeholder:text-white/20",
                  "focus:border-[#FF00B6] focus:shadow-[0_0_8px_rgba(255,0,182,0.2)]",
                  "focus:outline-none transition-all duration-150 resize-y",
                  errors.short_description && "border-red-500/60",
                )}
              />
              {errors.short_description && (
                <p className="font-mono text-[9px] uppercase tracking-wider text-red-400">
                  {errors.short_description.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
                Descrição Completa
              </label>
              <textarea
                {...register("description")}
                rows={8}
                placeholder="Descreva o produto em detalhes..."
                className={clsx(
                  "w-full bg-[#1a1a1a] border-2 border-[#FF00B6]/20 px-3 py-2.5",
                  "font-mono text-[12px] text-white placeholder:text-white/20",
                  "focus:border-[#FF00B6] focus:shadow-[0_0_8px_rgba(255,0,182,0.2)]",
                  "focus:outline-none transition-all duration-150 resize-y",
                  errors.description && "border-red-500/60",
                )}
              />
              {errors.description && (
                <p className="font-mono text-[9px] uppercase tracking-wider text-red-400">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/5" />
              <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/20">
                SEO
              </span>
              <div className="h-px flex-1 bg-white/5" />
            </div>

            <div>
              <Input
                label="Título SEO"
                placeholder="Título para motores de busca (máx. 200)"
                {...register("seo_title")}
                error={errors.seo_title?.message}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
                Meta Descrição SEO
              </label>
              <textarea
                {...register("seo_description")}
                rows={3}
                placeholder="Descrição para resultados de busca (máx. 500)..."
                className={clsx(
                  "w-full bg-[#1a1a1a] border-2 border-[#FF00B6]/20 px-3 py-2.5",
                  "font-mono text-[12px] text-white placeholder:text-white/20",
                  "focus:border-[#FF00B6] focus:shadow-[0_0_8px_rgba(255,0,182,0.2)]",
                  "focus:outline-none transition-all duration-150 resize-y",
                  errors.seo_description && "border-red-500/60",
                )}
              />
              {errors.seo_description && (
                <p className="font-mono text-[9px] uppercase tracking-wider text-red-400">
                  {errors.seo_description.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* MÍDIA */}
        <div className={clsx(activeTab !== "media" && "hidden")}>
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <pre
              className="font-mono text-[9px] leading-relaxed text-white/10 text-center"
              aria-hidden="true"
            >
              {`╔═══════════════════════════════╗
║  ·   ˚  ✦  ˚  ·   ˚  ✦  ˚  ·  ║
║                               ║
║       [ uploading... ]        ║
║                               ║
╚═══════════════════════════════╝`}
            </pre>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/25">
              Disponível na edição do produto
            </p>
            <p className="font-mono text-[9px] text-white/15 text-center max-w-xs leading-relaxed">
              Após criar o produto, acesse a página de edição para fazer upload de imagens e vídeos.
            </p>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div
        className="flex items-center justify-between mt-6 pt-6 border-t border-white/5"
      >
        <Link
          href="/admin-v2/products"
          className="font-mono text-[9px] uppercase tracking-widest text-white/20 hover:text-white/40 transition-colors duration-150"
        >
          ← Cancelar
        </Link>
        <Button type="submit" variant="primary" size="lg" loading={isSubmitting}>
          Criar Produto
          <ArrowRight size={13} />
        </Button>
      </div>
    </form>
  );
}
