import { Save, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "../primitives/Button";
import Textarea from "../primitives/inputs/Textarea";
import SectionDivider from "../primitives/SectionDivider";
import clsx from "clsx";
import { ProductEditData } from "../../services/productEdit.service";
import { CategoryWithSubs } from "@features/categories/types/category.types";
import { useEffect, useRef } from "react";
import { useProductDetailsForm } from "../../hooks/product/useProductDetailsForm.hook";
import React from "react";
import { toSlug } from "../../utils/stringToSlug";
import { ProductDetailsFormData } from "../../types/product/productDetailsFormData.type";
import { toast } from "sonner";
import { Input } from "../primitives/Input";
import { Controller } from "react-hook-form";
import { Select } from "../primitives/Select";
import { INSTALLMENTS_OPTIONS } from "../../consts/instamentsOptions.const";
import {
  FRAME_MATERIAL_OPTIONS,
  FRAME_SHAPE_OPTIONS,
  LENS_TYPE_OPTIONS,
} from "../../consts/productSpecs.const.";
import { FLAG_LABELS } from "../../consts/flagsLabels.const";
import { useUpdateProduct } from "../../hooks/product/useProductUpdate.hook";
import { isApiError } from "../../utils/isApiError";

export function DetailsTab({
  product,
  categories,
}: {
  product: ProductEditData;
  categories: CategoryWithSubs[];
}) {
  const slugTouched = useRef(false);
  // const [subcategories, setSubcategories] = useState<SubcategoryRow[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    control,
    formState: { errors },
  } = useProductDetailsForm(product);

  const mutation = useUpdateProduct(product.id);

  const nameValue = watch("name");
  const selectedCategoryId = watch("category_id");
  const subcategories = React.useMemo(
    () =>
      categories.find((cat) => cat.id === selectedCategoryId)?.subcategories ??
      [],
    [categories, selectedCategoryId],
  );

  useEffect(() => {
    const validSubIds = subcategories.map((s) => s.id);

    const current = watch("subcategory_ids") ?? [];

    const filtered = current.filter((id) => validSubIds.includes(id));

    if (filtered.length !== current.length) {
      setValue("subcategory_ids", filtered, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [selectedCategoryId, subcategories, watch, setValue]);

  useEffect(() => {
    if (!slugTouched.current) {
      setValue("slug", toSlug(nameValue ?? ""), { shouldValidate: false });
    }
  }, [nameValue, setValue]);

  const categoryOptions = [
    { value: "", label: "Sem categoria" },
    ...categories
      .filter((c) => c.active)
      .map((c) => ({ value: c.id, label: c.name_pt })),
  ];

  async function onSubmit(data: ProductDetailsFormData) {
    try {
      await mutation.mutateAsync(data);

      toast.success("Produto atualizado");
    } catch (err: unknown) {
      if (isApiError(err)) {
        if (err.status === 409) {
          setError("slug", {
            message: "Slug já em uso",
          });

          return;
        }

        toast.error(err.message);

        return;
      }

      toast.error("Erro inesperado");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nome *"
          placeholder="Ex: Óculos de Sol Vintage"
          {...register("name")}
          error={errors.name?.message}
        />
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          label="Preço (R$) *"
          placeholder="0,00"
          inputMode="decimal"
          {...register("price")}
          error={errors.price?.message}
        />
        <Input
          label="Preço Original (R$)"
          placeholder="0,00"
          inputMode="decimal"
          {...register("compare_at_price")}
          error={errors.compare_at_price?.message}
          hint="Preço riscado"
        />
        <Input
          label="Peso (g)"
          placeholder="150"
          inputMode="numeric"
          {...register("weight")}
          error={errors.weight?.message}
        />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Controller
            name="category_id"
            control={control}
            render={({ field }) => (
              <Select
                label="Categoria"
                options={categoryOptions}
                value={field.value ?? ""}
                onValueChange={(v) => field.onChange(v)}
              />
            )}
          />
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40 select-none">{"// "}Subcategoria(s)
            </span>
            <Controller
              key={selectedCategoryId || "no-category"}
              name="subcategory_ids"
              control={control}
              render={({ field }) => {
                const filtered = subcategories.filter(
                  (s) => s.category_id === watch("category_id"),
                );

                return (
                  <div className="flex flex-wrap gap-2">
                    {filtered.map((sub) => {
                      const values = field.value ?? [];
                      const active = values.includes(sub.id);

                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => {
                            if (active) {
                              field.onChange(
                                values.filter((id: string) => id !== sub.id),
                              );
                            } else {
                              field.onChange([...values, sub.id]);
                            }
                          }}
                          className={clsx(
                            "px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest border-2 transition-all duration-150 cursor-pointer",
                            active
                              ? "border-brand-pink/40 text-brand-pink bg-brand-pink/8 shadow-[0_0_10px_rgba(255,0,182,0.2)]"
                              : "border-white/10 text-white/25 hover:border-white/25 bg-transparent",
                          )}
                        >
                          {sub.name_pt}
                        </button>
                      );
                    })}
                  </div>
                );
              }}
            />
          </div>
        </div>
        <Input
          label="Dimensões"
          placeholder="Ex: 145-20-140"
          {...register("dimensions")}
          hint="Formato livre"
        />
      </div>

      <div>
        <SectionDivider label="Atributos Físicos" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          <Controller
            name="frame_shape"
            control={control}
            render={({ field }) => (
              <Select
                label="Forma da Armação"
                options={FRAME_SHAPE_OPTIONS}
                value={field.value ?? ""}
                onValueChange={(v) => field.onChange(v)}
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
                onValueChange={(v) => field.onChange(v)}
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
                onValueChange={(v) => field.onChange(v)}
              />
            )}
          />
        </div>
        <div className="mt-4">
          <Controller
            name="uv_protection"
            control={control}
            render={({ field }) => (
              <button
                type="button"
                onClick={() => field.onChange(!field.value)}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2.5 border-2 transition-all duration-150",
                  "font-mono text-[11px] uppercase tracking-widest",
                  field.value
                    ? "border-brand-pink/40 text-brand-pink bg-brand-pink/8 shadow-[0_0_10px_rgba(255,0,182,0.2)]"
                    : "border-white/10 text-white/30 hover:border-white/20",
                )}
              >
                {field.value ? (
                  <ToggleRight size={17} />
                ) : (
                  <ToggleLeft size={17} />
                )}
                Proteção UV
              </button>
            )}
          />
        </div>
      </div>

      <div>
        <SectionDivider label="Flags" />
        <div className="flex gap-2 flex-wrap mt-3">
          {FLAG_LABELS.map(({ key, label, color }) => (
            <Controller
              key={key}
              name={key}
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

      <div>
        <SectionDivider label="Textos" />
        <div className="space-y-4 mt-3">
          <Textarea
            label="Descrição Curta"
            rows={3}
            placeholder="Uma frase que resume o produto..."
            {...register("short_description")}
            error={errors.short_description?.message}
          />
          <Textarea
            label="Descrição Completa"
            rows={7}
            placeholder="Descreva o produto em detalhes..."
            {...register("description")}
            error={errors.description?.message}
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={mutation.isPending}
        >
          <Save size={15} />
          Salvar Detalhes
        </Button>
      </div>
    </form>
  );
}
