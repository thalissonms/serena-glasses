"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { couponPatchSchema, type CouponPatchInput } from "@features/admin/schemas/couponCreate.schema";
import type { CouponWithUsageInterface } from "@features/coupons/types/coupon.interface";

const labelClass = "font-poppins text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block";
const inputClass = "w-full bg-[#1a1a1a] border-2 border-white/10 text-white font-inter text-sm px-3 py-2 outline-none focus:border-brand-pink transition-colors";
const errorClass = "font-inter text-xs text-red-400 mt-1";

export default function CouponEditForm({ coupon }: { coupon: CouponWithUsageInterface }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CouponPatchInput>({
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

  const discountType = watch("discount_type");
  const appliesTo = watch("applies_to");

  async function onSubmit(data: CouponPatchInput) {
    const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) { toast.error("Erro ao salvar"); return; }
    toast.success("Cupom atualizado!");
  }

  async function handleDeactivate() {
    const res = await fetch(`/api/admin/coupons/${coupon.id}`, { method: "DELETE" });
    if (!res.ok) { toast.error("Erro ao desativar"); return; }
    toast.success("Cupom desativado");
    router.push("/admin/coupons");
  }

  return (
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

      {/* Status toggle */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" {...register("active")} className="accent-brand-pink w-4 h-4" />
          <span className="font-poppins text-sm text-white">Cupom ativo</span>
        </label>
      </div>

      {/* Descrição */}
      <div>
        <label className={labelClass}>Descrição (interna)</label>
        <input {...register("description")} className={inputClass} />
      </div>

      {/* Tipo de desconto */}
      <div>
        <label className={labelClass}>Tipo de desconto</label>
        <div className="flex gap-3">
          {(["percentage", "fixed"] as const).map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value={type} {...register("discount_type")} className="accent-brand-pink" />
              <span className="font-poppins text-sm text-white">
                {type === "percentage" ? "Percentual (%)" : "Valor fixo (R$)"}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Valor */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>{discountType === "percentage" ? "Desconto (%)" : "Desconto (R$)"}</label>
          <input
            type="number"
            step={discountType === "percentage" ? "1" : "0.01"}
            {...register("discount_value", { valueAsNumber: true })}
            className={inputClass}
          />
          {errors.discount_value && <p className={errorClass}>{errors.discount_value.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Desconto máximo (R$)</label>
          <input
            type="number"
            step="0.01"
            {...register("max_discount_cents", {
              setValueAs: (v) => (v === "" || v == null ? null : Math.round(parseFloat(v) * 100)),
            })}
            className={inputClass}
          />
        </div>
      </div>

      {/* Pedido mínimo */}
      <div>
        <label className={labelClass}>Valor mínimo do pedido (R$)</label>
        <input
          type="number"
          step="0.01"
          {...register("min_order_cents", {
            setValueAs: (v) => (v === "" ? 0 : Math.round(parseFloat(v) * 100)),
          })}
          className={inputClass}
        />
      </div>

      {/* Aplica a */}
      <div>
        <label className={labelClass}>Aplica a</label>
        <select {...register("applies_to")} className={inputClass}>
          <option value="all">Todos os produtos</option>
          <option value="products">Produtos específicos</option>
          <option value="categories">Categorias específicas</option>
        </select>
        {appliesTo === "products" && (
          <div className="mt-2">
            <p className="font-inter text-xs text-gray-400 mb-1">IDs dos produtos (um por linha)</p>
            <textarea
              className={`${inputClass} font-mono text-xs h-24 resize-none`}
              defaultValue={(coupon.applicable_product_ids ?? []).join("\n")}
              onChange={(e) => {
                const ids = e.target.value.split("\n").map((s) => s.trim()).filter(Boolean);
                setValue("applicable_product_ids", ids);
              }}
            />
          </div>
        )}
        {appliesTo === "categories" && (
          <div className="mt-2">
            <p className="font-inter text-xs text-gray-400 mb-1">Categorias (uma por linha)</p>
            <textarea
              className={`${inputClass} font-mono text-xs h-24 resize-none`}
              defaultValue={(coupon.applicable_categories ?? []).join("\n")}
              onChange={(e) => {
                const cats = e.target.value.split("\n").map((s) => s.trim()).filter(Boolean);
                setValue("applicable_categories", cats);
              }}
            />
          </div>
        )}
      </div>

      {/* Limites */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Limite total de usos</label>
          <input
            type="number"
            {...register("usage_limit_total", {
              setValueAs: (v) => (v === "" || v == null ? null : parseInt(v, 10)),
            })}
            className={inputClass}
            placeholder="Ilimitado"
          />
        </div>
        <div>
          <label className={labelClass}>Limite por email</label>
          <input
            type="number"
            {...register("usage_limit_per_email", { valueAsNumber: true })}
            className={inputClass}
          />
        </div>
      </div>

      {/* Validade */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Válido de</label>
          <input type="datetime-local" {...register("valid_from")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Válido até</label>
          <input
            type="datetime-local"
            {...register("valid_until", {
              setValueAs: (v) => (v === "" ? null : v),
            })}
            className={inputClass}
          />
        </div>
      </div>

      {/* Flags */}
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" {...register("first_purchase_only")} className="accent-brand-pink w-4 h-4" />
          <span className="font-poppins text-sm text-white">Apenas primeira compra</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" {...register("free_shipping")} className="accent-brand-pink w-4 h-4" />
          <span className="font-poppins text-sm text-white">Frete grátis</span>
        </label>
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
  );
}
