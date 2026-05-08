"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { couponPatchSchema } from "@features/admin/schemas/couponCreate.schema";
import type { CouponWithUsageInterface } from "@features/coupons/types/coupon.interface";
import {
  RHFTextInput,
  RHFSelectInput,
  RHFNumberInput,
  RHFPriceInput,
  RHFDateTimeInput,
  RHFCheckboxInput,
} from "@shared/components/forms/rhf";

const labelClass = "font-poppins text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block";

export default function CouponEditForm({ coupon }: { coupon: CouponWithUsageInterface }) {
  const router = useRouter();

  const methods = useForm({
    resolver: zodResolver(couponPatchSchema),
    defaultValues: {
      description: coupon.description ?? undefined,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      max_discount_cents: coupon.max_discount_cents ?? undefined,
      min_order_cents: coupon.min_order_cents,
      first_purchase_only: coupon.first_purchase_only,
      free_shipping: coupon.free_shipping,
      applies_to: coupon.applies_to,
      applicable_product_ids: coupon.applicable_product_ids ?? undefined,
      applicable_categories: coupon.applicable_categories ?? undefined,
      usage_limit_total: coupon.usage_limit_total ?? undefined,
      usage_limit_per_email: coupon.usage_limit_per_email,
      valid_from: coupon.valid_from,
      valid_until: coupon.valid_until ?? undefined,
      active: coupon.active,
    },
  });

  const { handleSubmit, watch, setValue, register, formState: { errors, isSubmitting } } = methods;

  const discountType = watch("discount_type");
  const appliesTo = watch("applies_to");

  useEffect(() => {
    if (discountType === "free_shipping") {
      setValue("discount_value", 0, { shouldValidate: true });
      setValue("free_shipping", true);
    }
  }, [discountType, setValue]);

  async function onSubmit(data: unknown) {
    const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error ?? "Erro ao salvar");
      return;
    }
    toast.success("Cupom atualizado!");
    router.refresh();
  }

  async function handleDeactivate() {
    const res = await fetch(`/api/admin/coupons/${coupon.id}`, { method: "DELETE" });
    if (!res.ok) { toast.error("Erro ao desativar"); return; }
    toast.success("Cupom desativado");
    router.push("/admin/coupons");
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-2xl">
        {/* Código (imutável) */}
        <div>
          <label className={labelClass}>Código</label>
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-xl text-white">{coupon.code}</span>
            <span className="text-[10px] font-poppins text-gray-500 border border-white/10 px-2 py-0.5">imutável</span>
          </div>
          {coupon.usage_count > 0 && (
            <p className="font-inter text-xs text-gray-500 mt-1">
              Usado {coupon.usage_count} {coupon.usage_count === 1 ? "vez" : "vezes"}
            </p>
          )}
        </div>

        <RHFCheckboxInput name="active" label="Cupom ativo" />

        <RHFTextInput name="description" label="Descrição (interna)" variant="admin" />

        {/* Tipo de desconto */}
        <div>
          <label className={labelClass}>Tipo de desconto</label>
          <div className="flex gap-3 flex-wrap">
            {(["percentage", "fixed", "free_shipping"] as const).map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value={type} {...register("discount_type")} className="accent-brand-pink" />
                <span className="font-poppins text-sm text-white">
                  {type === "percentage" ? "Percentual (%)" : type === "fixed" ? "Valor fixo (R$)" : "Frete grátis"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {discountType === "percentage" && (
          <div className="grid grid-cols-2 gap-4">
            <RHFNumberInput
              name="discount_value"
              label="Desconto (%)"
              min={1}
              max={100}
              step={1}
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
          <RHFPriceInput name="discount_value" label="Desconto" variant="admin" />
        )}

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
                defaultValue={(coupon.applicable_product_ids ?? []).join("\n")}
                onChange={(e) => {
                  const ids = e.target.value.split("\n").map((s) => s.trim()).filter(Boolean);
                  setValue("applicable_product_ids", ids);
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
              <p className="font-inter text-xs text-gray-400 mb-1">Categorias (uma por linha)</p>
              <textarea
                className="w-full bg-[#1a1a1a] border-2 border-white/10 text-white font-mono text-xs px-3 py-2 outline-none focus:border-brand-pink h-24 resize-none"
                defaultValue={(coupon.applicable_categories ?? []).join("\n")}
                onChange={(e) => {
                  const cats = e.target.value.split("\n").map((s) => s.trim()).filter(Boolean);
                  setValue("applicable_categories", cats);
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
            min={1}
            variant="admin"
          />
        </div>

        {/* Validade */}
        <div className="grid grid-cols-2 gap-4">
          <RHFDateTimeInput name="valid_from" label="Válido de" variant="admin" />
          <RHFDateTimeInput name="valid_until" label="Válido até" variant="admin" />
        </div>

        {/* Flags */}
        <div className="flex flex-col gap-3">
          <RHFCheckboxInput name="first_purchase_only" label="Apenas primeira compra" />
          <RHFCheckboxInput name="free_shipping" label="Frete grátis (combina com desconto)" />
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 border-4 border-brand-pink bg-brand-pink text-white font-poppins font-black text-sm uppercase tracking-widest shadow-[4px_4px_0_#000] hover:translate-y-0.5 hover:shadow-[2px_2px_0_#000] transition-all disabled:opacity-60"
          >
            {isSubmitting ? "Salvando..." : "Salvar alterações"}
          </button>

          {coupon.active && (
            <button
              type="button"
              onClick={handleDeactivate}
              className="px-6 py-3 border-2 border-red-800 text-red-400 font-poppins font-bold text-xs uppercase tracking-wider hover:bg-red-900/20 transition-colors"
            >
              Desativar cupom
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
