"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { couponCreateSchema } from "@features/admin/schemas/couponCreate.schema";
import {
  RHFTextInput,
  RHFSelectInput,
  RHFNumberInput,
  RHFPriceInput,
  RHFDateTimeInput,
  RHFCheckboxInput,
} from "@shared/components/forms/rhf";

const labelClass = "font-poppins text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block";

export default function CouponCreateForm() {
  const router = useRouter();
  const methods = useForm({
    resolver: zodResolver(couponCreateSchema),
    defaultValues: {
      discount_type: "percentage",
      discount_value: 0,
      applies_to: "all",
      min_order_cents: 0,
      usage_limit_per_email: 1,
      first_purchase_only: false,
      free_shipping: false,
    },
  });

  const { handleSubmit, watch, setValue, register, formState: { errors, isSubmitting } } = methods;

  const discountType = watch("discount_type");
  const appliesTo = watch("applies_to");
  const code = watch("code");

  useEffect(() => {
    if (discountType === "free_shipping") {
      setValue("discount_value", 0, { shouldValidate: true });
      setValue("free_shipping", true);
    }
  }, [discountType, setValue]);

  useEffect(() => {
    if (code && code !== code.toUpperCase()) {
      setValue("code", code.toUpperCase(), { shouldValidate: false });
    }
  }, [code, setValue]);

  async function onSubmit(data: unknown) {
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.status === 409) { toast.error("Código já em uso"); return; }
    if (!res.ok) { toast.error("Erro ao criar cupom"); return; }

    const { id } = await res.json();
    toast.success("Cupom criado!");
    router.push(`/admin/coupons/${id}/edit`);
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-2xl">
        {/* Código */}
        <RHFTextInput
          name="code"
          label="Código"
          required
          placeholder="EX: BEMVINDO10"
          variant="admin"
        />

        {/* Descrição */}
        <RHFTextInput
          name="description"
          label="Descrição (interna)"
          placeholder="Uso interno — não aparece para o cliente"
          variant="admin"
        />

        {/* Tipo de desconto */}
        <div>
          <label className={labelClass}>Tipo de desconto *</label>
          <div className="flex gap-3 flex-wrap">
            {(["percentage", "fixed", "free_shipping"] as const).map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value={type}
                  {...register("discount_type")}
                  className="accent-brand-pink"
                />
                <span className="font-poppins text-sm text-white">
                  {type === "percentage" ? "Percentual (%)" : type === "fixed" ? "Valor fixo (R$)" : "Frete grátis"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Valor do desconto */}
        {discountType === "percentage" && (
          <div className="grid grid-cols-2 gap-4">
            <RHFNumberInput
              name="discount_value"
              label="Desconto (%)"
              required
              min={1}
              max={100}
              step={1}
              placeholder="10"
              variant="admin"
            />
            <RHFPriceInput
              name="max_discount_cents"
              label="Desconto máximo"
              hint="Teto para cupons percentuais"
              variant="admin"
            />
          </div>
        )}

        {discountType === "fixed" && (
          <RHFPriceInput
            name="discount_value"
            label="Desconto"
            required
            variant="admin"
          />
        )}

        {/* Pedido mínimo */}
        <RHFPriceInput
          name="min_order_cents"
          label="Valor mínimo do pedido"
          hint="0 = sem mínimo"
          variant="admin"
        />

        {/* Aplica a */}
        <div>
          <RHFSelectInput
            name="applies_to"
            label="Aplica a"
            required
            variant="admin"
            options={[
              { value: "all", label: "Todos os produtos" },
              { value: "products", label: "Produtos específicos" },
              { value: "categories", label: "Categorias específicas" },
            ]}
          />
          {appliesTo === "products" && (
            <div className="mt-2">
              <p className="font-inter text-xs text-gray-400 mb-1">IDs dos produtos (um por linha)</p>
              <textarea
                className="w-full bg-[#1a1a1a] border-2 border-white/10 text-white font-mono text-xs px-3 py-2 outline-none focus:border-brand-pink h-24 resize-none"
                placeholder={"uuid-do-produto-1\nuuid-do-produto-2"}
                onChange={(e) => {
                  const ids = e.target.value.split("\n").map((s) => s.trim()).filter(Boolean);
                  setValue("applicable_product_ids", ids, { shouldValidate: true });
                }}
              />
              {errors.applicable_product_ids && (
                <p className="font-inter text-xs text-red-400 mt-1">
                  {errors.applicable_product_ids.message as string}
                </p>
              )}
            </div>
          )}
          {appliesTo === "categories" && (
            <div className="mt-2">
              <p className="font-inter text-xs text-gray-400 mb-1">
                Categorias (uma por linha — mesmo valor de products.category)
              </p>
              <textarea
                className="w-full bg-[#1a1a1a] border-2 border-white/10 text-white font-mono text-xs px-3 py-2 outline-none focus:border-brand-pink h-24 resize-none"
                placeholder={"solar\nreceituario"}
                onChange={(e) => {
                  const cats = e.target.value.split("\n").map((s) => s.trim()).filter(Boolean);
                  setValue("applicable_categories", cats, { shouldValidate: true });
                }}
              />
              {errors.applicable_categories && (
                <p className="font-inter text-xs text-red-400 mt-1">
                  {errors.applicable_categories.message as string}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Limites */}
        <div className="grid grid-cols-2 gap-4">
          <RHFNumberInput
            name="usage_limit_total"
            label="Limite total de usos"
            placeholder="Ilimitado"
            min={1}
            variant="admin"
          />
          <RHFNumberInput
            name="usage_limit_per_email"
            label="Limite por email"
            required
            min={1}
            variant="admin"
          />
        </div>

        {/* Validade */}
        <div className="grid grid-cols-2 gap-4">
          <RHFDateTimeInput
            name="valid_from"
            label="Válido de"
            variant="admin"
          />
          <RHFDateTimeInput
            name="valid_until"
            label="Válido até"
            variant="admin"
          />
        </div>

        {/* Flags */}
        <div className="flex flex-col gap-3">
          <RHFCheckboxInput name="first_purchase_only" label="Apenas primeira compra" />
          <RHFCheckboxInput name="free_shipping" label="Frete grátis (combina com desconto)" />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="self-start px-8 py-3 border-4 border-brand-pink bg-brand-pink text-white font-poppins font-black text-sm uppercase tracking-widest shadow-[4px_4px_0_#000] hover:translate-y-0.5 hover:shadow-[2px_2px_0_#000] transition-all disabled:opacity-60"
        >
          {isSubmitting ? "Criando..." : "Criar cupom"}
        </button>
      </form>
    </FormProvider>
  );
}
