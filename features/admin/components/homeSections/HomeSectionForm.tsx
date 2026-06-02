"use client";

import { Controller, FieldErrors, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { clsx } from "clsx";
import { Plus } from "lucide-react";

import { HomeSection, HomeSectionCreateInput } from "../../types/homeSection/homeSection.types";
import { CategoryWithSubs } from "@features/categories/types/category.types";
import { Input } from "../primitives/Input";
import { Select } from "../primitives/Select";

import {
  useCreateHomeSection,
  useUpdateHomeSection,
} from "../../hooks/homeSection/useHomeSectionMutations.hook";
import { useHomeSectionForm } from "../../hooks/homeSection/useHomeSectionForm.hook";
import { isApiError } from "../../utils/isApiError";
import { TYPE_OPTIONS } from "../../consts/homeSection.const";
import { ManualProductsModal } from "./ManualProductsModal";
import { useState } from "react";

interface Props {
  categories: CategoryWithSubs[];
  onCancel: () => void;
  initialData?: HomeSection;
}

export function HomeSectionForm({ categories, onCancel, initialData }: Props) {
  const [showModal, setShowModal] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useHomeSectionForm(initialData);

  const createMutation = useCreateHomeSection();
  const updateMutation = useUpdateHomeSection(initialData?.id ?? "");

  const typeValue = watch("type");
  const isSubcategory = typeValue === "subcategory";
  const isCategory = typeValue === "category";
  const isManual = typeValue === "manual";

  const subcategoryOptions = [
    { value: "", label: "Selecione uma subcategoria..." },
    ...categories.flatMap((c) =>
      c.subcategories.map((s) => ({
        value: s.id,
        label: `${c.name_pt} > ${s.name_pt}`,
      }))
    ),
  ];

  const categoryOptions = [
    { value: "", label: "Selecione uma categoria..." },
    ...categories.map((c) => ({ value: c.id, label: c.name_pt })),
  ];

  const onSubmit: SubmitHandler<HomeSectionCreateInput> = async (data) => {
    try {
      if (initialData) {
        await updateMutation.mutateAsync(data);
        toast.success("Seção atualizada!");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Seção criada!");
      }
      onCancel();
    } catch (err: unknown) {
      if (isApiError(err)) {
        toast.error(err.message);
      } else {
        toast.error("Erro inesperado ao salvar seção.");
      }
    }
  };

  const onError = (errors: FieldErrors<HomeSectionCreateInput>) => {
    console.error("Form validation failed:", errors);
    toast.error("Erro de validação. Verifique os campos obrigatórios.");
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      noValidate
      className="relative space-y-6 border border-brand-pink/30 bg-brand-pink/5 p-6 shadow-[inset_0_0_20px_rgba(255,0,182,0.05)]"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 border-b border-brand-pink/20 pb-3">
        <p className="font-mono text-[12px] tracking-[0.3em] text-brand-pink uppercase">
          {initialData ? "// EDIÇÃO DE SISTEMA" : "// NOVA DIRETRIZ"}
        </p>
        <span className="font-mono text-[10px] tracking-widest text-brand-pink/40">
          {initialData?.id ? initialData.id.split("-")[0] : "NEW_ENTRY"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="TÍTULO PT *"
          placeholder="Ex: Ofertas de Verão"
          {...register("title_pt")}
          error={errors.title_pt?.message}
        />
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              label="TIPO DE SEÇÃO *"
              options={TYPE_OPTIONS}
              value={field.value}
              onValueChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isSubcategory && (
          <Controller
            name="subcategory_id"
            control={control}
            render={({ field }) => (
              <Select
                label="SUBCATEGORIA *"
                options={subcategoryOptions}
                value={field.value ?? ""}
                onValueChange={(v) => field.onChange(v || null)}
              />
            )}
          />
        )}
        {isCategory && (
          <Controller
            name="category_id"
            control={control}
            render={({ field }) => (
              <Select
                label="CATEGORIA *"
                options={categoryOptions}
                value={field.value ?? ""}
                onValueChange={(v) => field.onChange(v || null)}
              />
            )}
          />
        )}

        {isManual && (
          <Controller
            name="product_ids"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col justify-center gap-2">
                <span className="font-mono text-[12px] font-bold tracking-wider text-white uppercase">
                  PRODUTOS SELECIONADOS
                </span>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 border border-brand-pink/20 bg-[#000000] px-4 py-2.5 shadow-[inset_0_0_10px_rgba(255,0,182,0.05)]">
                  <span className="font-mono text-[14px] font-semibold text-brand-pink">
                    {field.value?.length || 0} ITENS
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="border border-brand-pink/30 px-3 py-1 font-mono text-[11px] tracking-widest text-brand-pink uppercase transition-colors hover:bg-brand-pink/10"
                  >
                    [ GERENCIAR ]
                  </button>
                </div>
                <ManualProductsModal
                  open={showModal}
                  onClose={() => setShowModal(false)}
                  selectedIds={field.value || []}
                  onConfirm={(ids) => field.onChange(ids)}
                />
              </div>
            )}
          />
        )}
      </div>

      <div className="flex gap-4">
        <Controller
          name="is_special_component"
          control={control}
          render={({ field }) => (
            <button
              type="button"
              onClick={() => field.onChange(!field.value)}
              className={clsx(
                "flex items-center gap-3 border px-4 py-3 transition-all duration-150",
                "font-mono text-[12px] tracking-widest uppercase",
                field.value
                  ? "border-brand-pink/50 bg-brand-pink/10 text-brand-pink shadow-[inset_0_0_15px_rgba(255,0,182,0.15)]"
                  : "border-white/10 bg-[#0a0a0a] text-white/40 hover:border-white/30 hover:text-white/60"
              )}
            >
              <div className={clsx("h-2 w-2", field.value ? "bg-brand-pink border border-brand-pink" : "bg-white/20 border border-white/20")} />
              Componente Especial
            </button>
          )}
        />
      </div>

      <div className="flex items-center gap-4 border-t border-brand-pink/10 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="group relative flex items-center gap-2 overflow-hidden border border-brand-pink bg-brand-pink/10 px-6 py-2.5 font-mono text-[13px] tracking-widest text-brand-pink uppercase transition-all hover:bg-brand-pink/20"
        >
          <div className="absolute top-0 left-0 h-full w-[2px] bg-brand-pink"></div>
          {isPending ? (
            <span className="animate-pulse">PROCESSANDO...</span>
          ) : (
            <>
              <Plus size={15} className="transition-transform group-hover:rotate-90" />
              [ {initialData ? "SALVAR DIRETRIZ" : "INICIALIZAR SEÇÃO"} ]
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="font-mono text-[12px] tracking-widest text-white/30 uppercase transition-colors hover:text-brand-pink"
        >
          [ ABORTAR ]
        </button>
      </div>
    </form>
  );
}
