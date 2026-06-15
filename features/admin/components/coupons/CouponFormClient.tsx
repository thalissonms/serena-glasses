"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  Tag,
  ChevronLeft,
  Save,
  Percent,
  DollarSign,
  Truck,
  Search,
  X,
  Package,
  FolderTree,
  AlertCircle,
} from "lucide-react";
import { Button } from "@features/admin/components/primitives/Button";
import { Input } from "@features/admin/components/primitives/Input";
import { toDatetimeLocal, toISO } from "../../utils/datetimeInputs";
import { centsToDisplay } from "../../utils/centToDisplay";

const codeRegex = /^[A-Z0-9_-]+$/;

const priceStringSchema = z.union([z.string(), z.number()]).refine((v) => {
  if (v === "" || v == null) return true;
  if (typeof v === "number") return v >= 0;
  const n = parseFloat(v.replace(",", "."));
  return !isNaN(n) && n >= 0;
}, "Valor inválido").transform(v => {
  if (v === "" || v == null) return 0;
  if (typeof v === "number") return v;
  return parseFloat(v.replace(",", "."));
});

const formSchema = z
  .object({
    code: z
      .string()
      .min(3, "Mínimo 3 caracteres")
      .max(40, "Máximo 40 caracteres")
      .regex(codeRegex, "Use apenas A-Z, 0-9, _ ou -"),
    description: z.string().max(200, "Máximo 200 caracteres").optional(),
    discount_type: z.enum(["percentage", "fixed", "free_shipping"]),
    discount_value: priceStringSchema,
    max_discount_cents: priceStringSchema.nullable().optional(),
    min_order_cents: priceStringSchema,
    first_purchase_only: z.boolean(),
    applies_to: z.enum(["all", "products", "categories"]),
    applicable_product_ids: z.array(z.string()).nullable().optional(),
    applicable_categories: z.array(z.string()).nullable().optional(),
    usage_limit_total: z.number().int().positive("Deve ser > 0").nullable().optional(),
    usage_limit_per_email: z.number().int().positive("Deve ser > 0"),
    valid_from: z.string().optional(),
    valid_until: z.string().nullable().optional(),
    active: z.boolean(),
  })
  .refine((d) => d.discount_type === "free_shipping" || d.discount_value > 0, {
    message: "Deve ser maior que 0",
    path: ["discount_value"],
  })
  .refine((d) => d.discount_type !== "percentage" || d.discount_value <= 100, {
    message: "Percentual não pode ser maior que 100",
    path: ["discount_value"],
  })
  .refine(
    (d) =>
      d.applies_to !== "products" ||
      (d.applicable_product_ids != null && d.applicable_product_ids.length > 0),
    { message: "Selecione ao menos um produto", path: ["applicable_product_ids"] },
  )
  .refine(
    (d) =>
      d.applies_to !== "categories" ||
      (d.applicable_categories != null && d.applicable_categories.length > 0),
    { message: "Informe ao menos uma categoria", path: ["applicable_categories"] },
  );

type FormData = z.infer<typeof formSchema>;

export interface ProductOption {
  id: string;
  name: string;
  code: string | null;
}

export interface CategoryOption {
  slug: string;
  name_pt: string;
}

export interface CouponInitialData {
  id?: string;
  code?: string;
  description?: string | null;
  discount_type?: "percentage" | "fixed" | "free_shipping";
  discount_value?: number;
  max_discount_cents?: number | null;
  min_order_cents?: number;
  first_purchase_only?: boolean;
  applies_to?: "all" | "products" | "categories";
  applicable_product_ids?: string[] | null;
  applicable_categories?: string[] | null;
  usage_limit_total?: number | null;
  usage_limit_per_email?: number;
  valid_from?: string | null;
  valid_until?: string | null;
  active?: boolean;
}

interface Props {
  mode: "create" | "edit";
  initialData?: CouponInitialData;
  products: ProductOption[];
  categories: CategoryOption[];
}


function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 border-b border-brand-pink/10 pb-2 font-mono text-[11px] tracking-[0.35em] text-brand-pink/70 uppercase">{"// "}{children}
    </h3>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 font-mono text-[11px] tracking-wider text-red-400 uppercase">
      <AlertCircle size={12} />
      {message}
    </p>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="group flex items-center gap-3"
    >
      <span
        className={`relative w-10 h-5 border transition-all duration-200 shrink-0 ${checked ? "bg-brand-pink/15 border-brand-pink/50" : "bg-white/4 border-white/10"
          }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 transition-all duration-200 ${checked
              ? "left-5 bg-brand-pink shadow-[0_0_8px_rgba(255,0,182,0.5)]"
              : "left-0.5 bg-white/20"
            }`}
        />
      </span>
      <span className="font-mono text-[12px] tracking-wider text-white/60 uppercase transition-colors group-hover:text-white/80">{"// "}{label}
      </span>
    </button>
  );
}

function RadioOption<T extends string>({
  value,
  current,
  onSelect,
  label,
  icon,
  description,
}: {
  value: T;
  current: T;
  onSelect: (v: T) => void;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}) {
  const selected = value === current;
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`flex items-center gap-3 px-4 py-3 border text-left transition-all duration-150 ${selected
          ? "border-brand-pink/50 bg-brand-pink/6 shadow-[inset_1px_1px_0_rgba(255,0,182,0.12)]"
          : "border-white/8 hover:border-white/20 bg-white/2"
        }`}
    >
      <span
        className={`shrink-0 w-3 h-3 border rounded-none transition-all duration-150 ${selected
            ? "border-brand-pink bg-brand-pink shadow-[0_0_6px_rgba(255,0,182,0.5)]"
            : "border-white/20"
          }`}
      />
      {icon && (
        <span className={`shrink-0 ${selected ? "text-brand-pink" : "text-white/25"}`}>
          {icon}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p
          className={`font-mono text-[12px] uppercase tracking-wider ${selected ? "text-white" : "text-white/50"}`}
        >
          {label}
        </p>
        {description && (
          <p className="mt-0.5 font-mono text-[10px] text-white/25">{"// "}{description}</p>
        )}
      </div>
    </button>
  );
}

function MultiSelectProducts({
  selected,
  onChange,
  products,
  error,
}: {
  selected: string[];
  onChange: (ids: string[]) => void;
  products: ProductOption[];
  error?: string;
}) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || (p.code?.toLowerCase().includes(q) ?? false),
    );
  }, [products, search]);

  function toggle(id: string) {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  }

  return (
    <div className={`border ${error ? "border-red-500/40" : "border-white/8"}`}>
      <div className="border-b border-white/5 p-2">
        <div className="relative">
          <Search size={13} className="absolute top-1/2 left-3 -translate-y-1/2 text-white/25" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar produto..."
            className="w-full bg-transparent py-1.5 pr-3 pl-8 font-mono text-[12px] text-white outline-none placeholder:text-white/20"
          />{"// "}{search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-white/20 hover:text-white/50"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>
      <div className="max-h-48 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="p-4 text-center font-mono text-[11px] text-white/20">{"// "}Nenhum produto</p>
        ) : (
          filtered.map((p) => {
            const isSel = selected.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => toggle(p.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-100 border-b border-white/3 last:border-b-0 ${isSel ? "bg-brand-pink/6" : "hover:bg-white/2"
                  }`}
              >
                <span
                  className={`shrink-0 w-3 h-3 border transition-all ${isSel
                      ? "border-brand-pink bg-brand-pink shadow-[0_0_6px_rgba(255,0,182,0.4)]"
                      : "border-white/15"
                    }`}
                />
                <span
                  className={`font-poppins text-[13px] flex-1 min-w-0 truncate ${isSel ? "text-white" : "text-white/50"}`}
                >
                  {p.name}
                </span>
                {p.code && (
                  <span className="shrink-0 font-mono text-[10px] text-white/20">{"// "}{p.code}</span>
                )}
              </button>
            );
          })
        )}
      </div>
      {selected.length > 0 && (
        <div className="border-t border-white/5 bg-white/1 p-2">
          <p className="font-mono text-[10px] tracking-wider text-brand-pink/60 uppercase">{"// "}{selected.length} produto{selected.length !== 1 ? "s" : ""} selecionado
            {selected.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
      {error && <FieldError message={error} />}
    </div>
  );
}

function MultiSelectCategories({
  selected,
  onChange,
  categories,
  error,
}: {
  selected: string[];
  onChange: (slugs: string[]) => void;
  categories: CategoryOption[];
  error?: string;
}) {
  function toggle(slug: string) {
    onChange(
      selected.includes(slug) ? selected.filter((s) => s !== slug) : [...selected, slug],
    );
  }

  return (
    <div className={`border ${error ? "border-red-500/40" : "border-white/8"}`}>
      <div className="max-h-48 overflow-y-auto">
        {categories.length === 0 ? (
          <p className="p-4 text-center font-mono text-[11px] text-white/20">{"// "}Nenhuma categoria
          </p>
        ) : (
          categories.map((cat) => {
            const isSel = selected.includes(cat.slug);
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => toggle(cat.slug)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-100 border-b border-white/3 last:border-b-0 ${isSel ? "bg-brand-pink/6" : "hover:bg-white/2"
                  }`}
              >
                <span
                  className={`shrink-0 w-3 h-3 border transition-all ${isSel
                      ? "border-brand-pink bg-brand-pink shadow-[0_0_6px_rgba(255,0,182,0.4)]"
                      : "border-white/15"
                    }`}
                />
                <span
                  className={`font-poppins text-[13px] flex-1 min-w-0 truncate ${isSel ? "text-white" : "text-white/50"}`}
                >
                  {cat.name_pt}
                </span>
                <span className="shrink-0 font-mono text-[10px] text-white/20">{"// "}{cat.slug}
                </span>
              </button>
            );
          })
        )}
      </div>
      {selected.length > 0 && (
        <div className="border-t border-white/5 bg-white/1 p-2">
          <p className="font-mono text-[10px] tracking-wider text-brand-pink/60 uppercase">{"// "}{selected.length} categoria{selected.length !== 1 ? "s" : ""} selecionada
            {selected.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
      {error && <FieldError message={error} />}
    </div>
  );
}

export function CouponFormClient({ mode, initialData, products, categories }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: initialData?.code ?? "",
      description: initialData?.description ?? "",
      discount_type: initialData?.discount_type ?? "percentage",
      discount_value: initialData?.discount_type === "fixed" && initialData?.discount_value
        ? centsToDisplay(initialData.discount_value)
        : (initialData?.discount_value?.toString() ?? "10"),
      max_discount_cents: initialData?.max_discount_cents
        ? centsToDisplay(initialData.max_discount_cents)
        : "",
      min_order_cents: initialData?.min_order_cents
        ? centsToDisplay(initialData.min_order_cents)
        : "0,00",
      first_purchase_only: initialData?.first_purchase_only ?? false,
      applies_to: initialData?.applies_to ?? "all",
      applicable_product_ids: initialData?.applicable_product_ids ?? [],
      applicable_categories: initialData?.applicable_categories ?? [],
      usage_limit_total: initialData?.usage_limit_total ?? null,
      usage_limit_per_email: initialData?.usage_limit_per_email ?? 1,
      valid_from: toDatetimeLocal(initialData?.valid_from),
      valid_until: toDatetimeLocal(initialData?.valid_until),
      active: initialData?.active ?? true,
    },
  });

  const discountType = watch("discount_type");
  const appliesTo = watch("applies_to");

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        code: data.code.toUpperCase().trim(),
        discount_value: data.discount_type === "free_shipping" ? 0 : data.discount_type === "fixed" ? Math.round(Number(data.discount_value) * 100) : Number(data.discount_value),
        max_discount_cents: data.discount_type === "percentage" && data.max_discount_cents ? Math.round(Number(data.max_discount_cents) * 100) : null,
        min_order_cents: data.min_order_cents ? Math.round(Number(data.min_order_cents) * 100) : 0,
        applicable_product_ids:
          data.applies_to === "products" ? data.applicable_product_ids : null,
        applicable_categories:
          data.applies_to === "categories" ? data.applicable_categories : null,
        valid_from: toISO(data.valid_from),
        valid_until: toISO(data.valid_until) ?? null,
      };

      const url =
        mode === "create"
          ? "/api/admin/coupons"
          : `/api/admin/coupons/${initialData!.id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 409) {
        toast.error("Código de cupom já está em uso");
        return;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error((body as { error?: string }).error ?? "Erro ao salvar cupom");
        return;
      }

      const result = (await res.json()) as { id?: string };
      toast.success(mode === "create" ? "Cupom criado!" : "Cupom atualizado!");

      if (mode === "create" && result.id) {
        router.push(`/admin/coupons/${result.id}`);
      } else {
        router.refresh();
      }
    } catch {
      toast.error("Erro inesperado ao salvar");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/coupons")}
            className="border border-white/8 p-2 text-white/25 transition-all hover:border-white/20 hover:text-white/70"
          >
            <ChevronLeft size={17} />
          </button>
          <div>
            <div className="mb-0.5 flex items-center gap-2">
              <Tag size={19} className="text-brand-pink" />
              <h1 className="font-poppins font-black text-xl tracking-wide text-white">
                {mode === "create" ? "NOVO CUPOM" : `EDITAR: ${initialData?.code}`}
              </h1>
            </div>
            <p className="font-mono text-[11px] tracking-widest text-white/25 uppercase">{"// "}{mode === "create"
                ? "Criar novo cupom de desconto"
                : "Editar configurações do cupom"}
            </p>
          </div>
        </div>
        <Button type="submit" variant="primary" size="md" loading={isSubmitting}>
          <Save size={15} />
          {mode === "create" ? "Criar Cupom" : "Salvar"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <div className="border border-white/8 bg-[#111] p-5 shadow-[4px_4px_0_rgba(255,0,182,0.12)]">
            <SectionLabel>Identificação</SectionLabel>
            <div className="flex flex-col gap-4">
              {mode === "edit" ? (
                <div>
                  <label className="mb-2 block font-mono text-[11px] tracking-wider text-white/40 uppercase">{"// "}Código do cupom</label>
                  <div className="flex w-full items-center border border-brand-pink/20 bg-brand-pink/5 px-4 py-2.5">
                    <p className="font-poppins text-[13px] font-black tracking-widest text-brand-pink uppercase">{initialData?.code}</p>
                  </div>
                  <p className="mt-1.5 font-mono text-[10px] tracking-wider text-white/30 uppercase">{"// "}Código imutável após criação</p>
                </div>
              ) : (
                <Input
                  label="Código do cupom"
                  placeholder="DESCONTO20"
                  {...register("code")}
                  onChange={(e) => {
                    const upper = e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, "");
                    setValue("code", upper);
                  }}
                  error={errors.code?.message}
                  hint="Apenas A-Z, 0-9, _ ou -"
                />
              )}
              <Input
                label="Descrição (opcional)"
                placeholder="Ex: 20% off na primeira compra"
                {...register("description")}
                error={errors.description?.message}
              />
            </div>
          </div>

          <div className="border border-white/8 bg-[#111] p-5 shadow-[4px_4px_0_rgba(255,0,182,0.12)]">
            <SectionLabel>Tipo de Desconto</SectionLabel>
            <div className="flex flex-col gap-2">
              <Controller
                control={control}
                name="discount_type"
                render={({ field }) => (
                  <>
                    <RadioOption
                      value="percentage"
                      current={field.value}
                      onSelect={(v) => {
                        field.onChange(v);
                      }}
                      label="Percentual"
                      icon={<Percent size={15} />}
                      description="Ex: 20% de desconto sobre o subtotal"
                    />
                    <RadioOption
                      value="fixed"
                      current={field.value}
                      onSelect={(v) => {
                        field.onChange(v);
                      }}
                      label="Valor fixo"
                      icon={<DollarSign size={15} />}
                      description="Ex: R$50,00 de desconto (informe em centavos)"
                    />
                    <RadioOption
                      value="free_shipping"
                      current={field.value}
                      onSelect={(v) => {
                        field.onChange(v);
                        setValue("discount_value", 0);
                      }}
                      label="Frete grátis"
                      icon={<Truck size={15} />}
                      description="Zera o valor do frete no checkout"
                    />
                  </>
                )}
              />
            </div>

            {discountType !== "free_shipping" && (
              <div className="mt-4">
                    <Input
                      label={discountType === "percentage" ? "Valor do desconto" : "Valor do desconto (R$)"}
                      placeholder="0,00"
                      inputMode={discountType === "percentage" ? "numeric" : "decimal"}
                      {...register("discount_value")}
                      error={errors.discount_value?.message}
                      hint={
                        discountType === "percentage"
                          ? "Informe o percentual (ex: 20 para 20%)"
                          : "Informe em reais (ex: 50,00)"
                      }
                      suffix={
                        <span className="pr-3 font-mono text-[12px] text-white/30">{"// "}{discountType === "percentage" ? "%" : "R$"}
                        </span>
                      }
                    />
              </div>
            )}

            {discountType === "percentage" && (
              <div className="mt-3">
                    <Input
                      label="Desconto máximo (R$) (opcional)"
                      placeholder="0,00"
                      inputMode="decimal"
                      {...register("max_discount_cents")}
                      error={errors.max_discount_cents?.message}
                      hint="Teto em reais (ex: 100,00). Vazio = sem teto."
                      suffix={<span className="pr-3 font-mono text-[12px] text-white/30">{"// "}R$</span>}
                    />
              </div>
            )}
          </div>

          <div className="border border-white/8 bg-[#111] p-5 shadow-[4px_4px_0_rgba(255,0,182,0.12)]">
            <SectionLabel>Aplicação</SectionLabel>
            <div className="flex flex-col gap-2">
              <Controller
                control={control}
                name="applies_to"
                render={({ field }) => (
                  <>
                    <RadioOption
                      value="all"
                      current={field.value}
                      onSelect={field.onChange}
                      label="Todos os produtos"
                      description="Aplica-se a qualquer produto no carrinho"
                    />
                    <RadioOption
                      value="products"
                      current={field.value}
                      onSelect={field.onChange}
                      label="Produtos específicos"
                      icon={<Package size={15} />}
                      description="Selecione os produtos elegíveis abaixo"
                    />
                    <RadioOption
                      value="categories"
                      current={field.value}
                      onSelect={field.onChange}
                      label="Categorias específicas"
                      icon={<FolderTree size={15} />}
                      description="Selecione as categorias elegíveis abaixo"
                    />
                  </>
                )}
              />
            </div>

            {appliesTo === "products" && (
              <div className="mt-4">
                <p className="mb-2 font-mono text-[11px] tracking-wider text-white/40 uppercase">{"// "}Produtos elegíveis
                </p>
                <Controller
                  control={control}
                  name="applicable_product_ids"
                  render={({ field }) => (
                    <MultiSelectProducts
                      selected={field.value ?? []}
                      onChange={field.onChange}
                      products={products}
                      error={errors.applicable_product_ids?.message}
                    />
                  )}
                />
              </div>
            )}

            {appliesTo === "categories" && (
              <div className="mt-4">
                <p className="mb-2 font-mono text-[11px] tracking-wider text-white/40 uppercase">{"// "}Categorias elegíveis
                </p>
                <Controller
                  control={control}
                  name="applicable_categories"
                  render={({ field }) => (
                    <MultiSelectCategories
                      selected={field.value ?? []}
                      onChange={field.onChange}
                      categories={categories}
                      error={errors.applicable_categories?.message}
                    />
                  )}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="border border-white/8 bg-[#111] p-5 shadow-[4px_4px_0_rgba(255,0,182,0.12)]">
            <SectionLabel>Condições</SectionLabel>
            <div className="flex flex-col gap-4">
                  <Input
                    label="Pedido mínimo (R$)"
                    placeholder="0,00"
                    inputMode="decimal"
                    {...register("min_order_cents")}
                    error={errors.min_order_cents?.message}
                    hint="0 = sem valor mínimo · Ex: 100,00"
                    suffix={<span className="pr-3 font-mono text-[12px] text-white/30">{"// "}R$</span>}
                  />
              <Controller
                control={control}
                name="first_purchase_only"
                render={({ field }) => (
                  <Toggle
                    checked={field.value}
                    onChange={field.onChange}
                    label="Apenas primeira compra"
                  />
                )}
              />
            </div>
          </div>

          <div className="border border-white/8 bg-[#111] p-5 shadow-[4px_4px_0_rgba(255,0,182,0.12)]">
            <SectionLabel>Limites de Uso</SectionLabel>
            <div className="flex flex-col gap-4">
              <Controller
                control={control}
                name="usage_limit_total"
                render={({ field }) => (
                  <Input
                    label="Limite total de usos (opcional)"
                    type="number"
                    min={1}
                    step={1}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? null : e.target.valueAsNumber,
                      )
                    }
                    error={errors.usage_limit_total?.message}
                    hint="Vazio = sem limite de usos totais"
                  />
                )}
              />
              <Controller
                control={control}
                name="usage_limit_per_email"
                render={({ field }) => (
                  <Input
                    label="Limite por e-mail"
                    type="number"
                    min={1}
                    step={1}
                    value={field.value ?? 1}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || 1)}
                    error={errors.usage_limit_per_email?.message}
                    hint="Quantas vezes o mesmo e-mail pode usar este cupom"
                  />
                )}
              />
            </div>
          </div>

          <div className="border border-white/8 bg-[#111] p-5 shadow-[4px_4px_0_rgba(255,0,182,0.12)]">
            <SectionLabel>Validade</SectionLabel>
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-2 block font-mono text-[11px] tracking-wider text-white/40 uppercase">{"// "}Válido a partir de (opcional)
                </label>
                <input
                  type="datetime-local"
                  {...register("valid_from")}
                  className="w-full border border-brand-pink/15 bg-transparent px-3 py-2.5 font-mono text-[13px] text-white [color-scheme:dark] transition-all duration-150 outline-none focus:border-brand-pink focus:shadow-[0_0_8px_rgba(255,0,182,0.2)]"
                />
              </div>
              <div>
                <label className="mb-2 block font-mono text-[11px] tracking-wider text-white/40 uppercase">{"// "}Válido até (opcional)
                </label>
                <input
                  type="datetime-local"
                  {...register("valid_until")}
                  className="w-full border border-brand-pink/15 bg-transparent px-3 py-2.5 font-mono text-[13px] text-white [color-scheme:dark] transition-all duration-150 outline-none focus:border-brand-pink focus:shadow-[0_0_8px_rgba(255,0,182,0.2)]"
                />
              </div>
            </div>
          </div>

          <div className="border border-white/8 bg-[#111] p-5 shadow-[4px_4px_0_rgba(255,0,182,0.12)]">
            <SectionLabel>Status</SectionLabel>
            <Controller
              control={control}
              name="active"
              render={({ field }) => (
                <Toggle
                  checked={field.value}
                  onChange={field.onChange}
                  label={field.value ? "Cupom ativo" : "Cupom inativo"}
                />
              )}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 border border-white/8 bg-white/1 p-4">
        <button
          type="button"
          onClick={() => router.push("/admin/coupons")}
          className="font-mono text-[11px] tracking-widest text-white/25 uppercase transition-colors hover:text-white/60"
        >{"// "}← Voltar para cupons
        </button>
        <Button type="submit" variant="primary" size="md" loading={isSubmitting}>
          <Save size={15} />
          {mode === "create" ? "Criar Cupom" : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  );
}
