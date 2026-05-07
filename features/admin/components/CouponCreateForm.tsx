"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { couponCreateSchema, type CouponCreateInput } from "@features/admin/schemas/couponCreate.schema";

const labelClass = "font-poppins text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block";
const inputClass = "w-full bg-[#1a1a1a] border-2 border-white/10 text-white font-inter text-sm px-3 py-2 outline-none focus:border-brand-pink transition-colors";
const errorClass = "font-inter text-xs text-red-400 mt-1";
const hintClass = "font-inter text-[11px] text-gray-500 mt-1";

export default function CouponCreateForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(couponCreateSchema),
    defaultValues: {
      discount_type: "percentage",
      applies_to: "all",
      min_order_cents: 0,
      usage_limit_per_email: 1,
      first_purchase_only: false,
      free_shipping: false,
    },
  });

  const discountType = watch("discount_type");
  const appliesTo = watch("applies_to");

  async function onSubmit(data: CouponCreateInput) {
    // Converte discount_value de R$ para centavos quando tipo é "fixed"
    const payload: CouponCreateInput = {
      ...data,
      discount_value:
        data.discount_type === "fixed"
          ? Math.round(data.discount_value * 100)
          : data.discount_value,
    };

    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.status === 409) { toast.error("Código já em uso"); return; }
    if (!res.ok) { toast.error("Erro ao criar cupom"); return; }

    const { id } = await res.json();
    toast.success("Cupom criado!");
    router.push(`/admin/coupons/${id}/edit`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-2xl">
      {/* Código — fix: onChange via register para não sobrescrever o handler do RHF */}
      <div>
        <label className={labelClass}>Código *</label>
        <input
          {...register("code", {
            onChange: (e) => setValue("code", e.target.value.toUpperCase()),
          })}
          className={inputClass}
          placeholder="EX: BEMVINDO10"
        />
        {errors.code && <p className={errorClass}>{errors.code.message}</p>}
      </div>

      {/* Descrição */}
      <div>
        <label className={labelClass}>Descrição (interna)</label>
        <input
          {...register("description")}
          className={inputClass}
          placeholder="Uso interno — não aparece para o cliente"
        />
      </div>

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

      {/* Valor do desconto — oculto quando free_shipping */}
      {discountType !== "free_shipping" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              {discountType === "percentage" ? "Desconto (%) *" : "Desconto (R$) *"}
            </label>
            <input
              type="number"
              min="1"
              step={discountType === "percentage" ? "1" : "0.01"}
              max={discountType === "percentage" ? "100" : undefined}
              {...register("discount_value", { valueAsNumber: true })}
              className={inputClass}
              placeholder={discountType === "percentage" ? "10" : "50,00"}
            />
            {discountType === "fixed" && (
              <p className={hintClass}>Digite o valor em reais. Ex: 50 = R$50,00</p>
            )}
            {errors.discount_value && (
              <p className={errorClass}>{errors.discount_value.message}</p>
            )}
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
              placeholder="Sem limite"
            />
            <p className={hintClass}>Teto para cupons percentuais</p>
          </div>
        </div>
      )}

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
          placeholder="0 = sem mínimo"
        />
      </div>

      {/* Aplica a */}
      <div>
        <label className={labelClass}>Aplica a *</label>
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
              placeholder={"uuid-do-produto-1\nuuid-do-produto-2"}
              onChange={(e) => {
                const ids = e.target.value.split("\n").map((s) => s.trim()).filter(Boolean);
                setValue("applicable_product_ids", ids, { shouldValidate: true });
              }}
            />
            {errors.applicable_product_ids && (
              <p className={errorClass}>{errors.applicable_product_ids.message}</p>
            )}
          </div>
        )}
        {appliesTo === "categories" && (
          <div className="mt-2">
            <p className="font-inter text-xs text-gray-400 mb-1">
              Categorias (uma por linha — mesmo valor de products.category)
            </p>
            <textarea
              className={`${inputClass} font-mono text-xs h-24 resize-none`}
              placeholder={"solar\nreceituario"}
              onChange={(e) => {
                const cats = e.target.value.split("\n").map((s) => s.trim()).filter(Boolean);
                setValue("applicable_categories", cats, { shouldValidate: true });
              }}
            />
            {errors.applicable_categories && (
              <p className={errorClass}>{errors.applicable_categories.message}</p>
            )}
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
          <label className={labelClass}>Limite por email *</label>
          {/* fix: sem defaultValue aqui — já está no defaultValues do RHF */}
          <input
            type="number"
            {...register("usage_limit_per_email", { valueAsNumber: true })}
            className={inputClass}
          />
        </div>
      </div>

      {/* Validade — fix: converte datetime-local para ISO com timezone */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Válido de</label>
          <input
            type="datetime-local"
            {...register("valid_from", {
              setValueAs: (v) => (v ? new Date(v).toISOString() : undefined),
            })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Válido até</label>
          <input
            type="datetime-local"
            {...register("valid_until", {
              setValueAs: (v) => (v ? new Date(v).toISOString() : null),
            })}
            className={inputClass}
          />
        </div>
      </div>

      {/* Flags */}
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register("first_purchase_only")}
            className="accent-brand-pink w-4 h-4"
          />
          <span className="font-poppins text-sm text-white">Apenas primeira compra</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register("free_shipping")}
            className="accent-brand-pink w-4 h-4"
          />
          <span className="font-poppins text-sm text-white">Frete grátis</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="self-start px-8 py-3 border-4 border-brand-pink bg-brand-pink text-white font-poppins font-black text-sm uppercase tracking-widest shadow-[4px_4px_0_#000] hover:translate-y-0.5 hover:shadow-[2px_2px_0_#000] transition-all disabled:opacity-60"
      >
        {isSubmitting ? "Criando..." : "Criar cupom"}
      </button>
    </form>
  );
}
