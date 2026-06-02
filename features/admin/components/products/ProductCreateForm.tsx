"use client";
/**
 * Component: ProductCreateForm — formulário multi-tab de criação de produto Y2K Chrome.
 *
 * Tabs: Detalhes / Textos & SEO / Mídia. Todos os campos renderizam no DOM (tabs com
 * hidden/show) para que React Hook Form registre todos os campos independente da aba ativa.
 *
 * Usado em: src/app/admin/products/new/page.tsx.
 */
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { clsx } from "clsx";
import Link from "next/link";
import { ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import Image from "next/image";

import type { CategoryRow } from "@features/categories/types/category.types";
import { Button } from "@features/admin/components/primitives/Button";
import { Input } from "@features/admin/components/primitives/Input";
import { Select } from "@features/admin/components/primitives/Select";
import Textarea from "../primitives/inputs/Textarea";

import {
  FRAME_MATERIAL_OPTIONS,
  FRAME_SHAPE_OPTIONS,
  LENS_TYPE_OPTIONS,
} from "../../consts/productSpecs.const.";
import { INSTALLMENTS_OPTIONS } from "../../consts/instamentsOptions.const";
import { TabId } from "../../types/product/tabId.type";
import { TABS_CREATE } from "../../consts/tabs.const";

import { productCreateFormSchema } from "../../schemas/product/form/productCreateForm.schema";
import type { ProductCreateFormData } from "../../types/product/productCreateFormData.type";
import { useProductCreate } from "../../hooks/product/useProductCreate.hook";
import { isApiError } from "../../utils/isApiError";
import { toSlug } from "../../utils/stringToSlug";
import { FLAG_LABELS } from "../../consts/flagsLabels.const";

interface Props {
  categories: CategoryRow[];
}

const DETAILS_FIELDS: (keyof ProductCreateFormData)[] = ["name", "slug", "price", "weight"];
const TEXTS_FIELDS: (keyof ProductCreateFormData)[] = [
  "description",
  "seo_title",
  "seo_description",
];

export default function ProductCreateForm({ categories }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("details");
  const slugTouched = useRef(false);

  const createMutation = useProductCreate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    control,
    formState: { errors },
  } = useForm<ProductCreateFormData>({
    resolver: zodResolver(productCreateFormSchema),
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

  async function onSubmit(data: ProductCreateFormData) {
    try {
      const { id, code } = await createMutation.mutateAsync(data);
      toast.success(`Produto criado! SKU: ${code}`);
      router.push(`/admin/products/${id}`);
    } catch (err: unknown) {
      if (isApiError(err)) {
        if (err.status === 409) {
          setError("slug", { message: "Slug já em uso — tente outro" });
          setActiveTab("details");
          return;
        }
        toast.error(err.message);
        return;
      }
      toast.error("Erro inesperado ao criar produto");
    }
  }

  const categoryOptions = [
    { value: "", label: "Sem categoria" },
    ...categories
      .filter((c) => c.active)
      .map((c) => ({ value: c.id, label: c.name_pt })),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex border-b border-white/8 bg-[#0a0a0a]">
        {TABS_CREATE.map((tab) => {
          const hasError =
            (tab.id === "details" && detailsHasError) ||
            (tab.id === "texts" && textsHasError);
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "relative px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-150 flex items-center gap-1.5",
                "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5",
                "after:bg-brand-pink after:transition-transform after:duration-200 after:origin-left",
                "outline-none",
                activeTab === tab.id
                  ? "text-white after:scale-x-100"
                  : "text-white/30 hover:text-white/60 after:scale-x-0",
              )}
            >
              {tab.label}
              {hasError && (
                <AlertCircle size={12} className="text-red-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 border-t-0 p-6">
        <div className={clsx(activeTab !== "details" && "hidden")}>
          <div className="flex items-center gap-2 mb-6 p-3 border border-brand-pink/15 bg-brand-pink/5">
            <Sparkles size={14} className="text-brand-pink shrink-0" />
            <p className="font-mono text-[11px] uppercase tracking-widest text-brand-pink/60">{"// "}O código SKU será gerado automaticamente após salvar — formato:
              CAT-0001
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px flex-1 bg-white/5" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/20">{"// "}Atributos Físicos
              </span>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px flex-1 bg-white/5" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/20">{"// "}Flags
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
                        "px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest border-2 transition-all duration-150",
                        !field.value &&
                          "border-white/10 text-white/25 hover:border-white/25 bg-transparent",
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

        <div className={clsx(activeTab !== "texts" && "hidden")}>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Textarea
                label="Descrição Curta"
                rows={3}
                placeholder="Uma frase que resume o produto..."
                {...register("short_description")}
                error={errors.short_description?.message}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Textarea
                label="Descrição Completa"
                rows={7}
                placeholder="Descreva o produto em detalhes..."
                {...register("description")}
                error={errors.description?.message}
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/5" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/20">{"// "}SEO
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
              <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">{"// "}Meta Descrição SEO
              </label>
              <textarea
                {...register("seo_description")}
                rows={3}
                placeholder="Descrição para resultados de busca (máx. 500)..."
                className={clsx(
                  "w-full bg-[#0a0a0a] border-2 border-brand-pink/20 px-3 py-2.5",
                  "font-mono text-[14px] text-white placeholder:text-white/20",
                  "focus:border-brand-pink focus:shadow-[0_0_8px_rgba(255,0,182,0.2)]",
                  "focus:outline-none transition-all duration-150 resize-y",
                  errors.seo_description && "border-red-500/60",
                )}
              />
              {errors.seo_description && (
                <p className="font-mono text-[11px] uppercase tracking-wider text-red-400">{"// "}{errors.seo_description.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className={clsx(activeTab !== "media" && "hidden")}>
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Image
              src="/loaders/sparkles-loader.gif"
              width={48}
              height={48}
              alt=""
            />
            <p className="font-mono text-[12px] uppercase tracking-[0.35em] text-white/25">{"// "}Disponível na edição do produto
            </p>
            <p className="font-mono text-[11px] text-white/15 text-center max-w-xs leading-relaxed">{"// "}Após criar o produto, acesse a página de edição para fazer upload
              de imagens e vídeos.
            </p>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 mt-6 pt-6 border-t border-white/5">
        <Link
          href="/admin/products"
          className="font-mono text-[11px] uppercase tracking-widest text-white/20 hover:text-white/40 transition-colors duration-150"
        >{"// "}← Cancelar
        </Link>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={createMutation.isPending}
        >
          Criar Produto
          <ArrowRight size={16} />
        </Button>
      </div>
    </form>
  );
}
