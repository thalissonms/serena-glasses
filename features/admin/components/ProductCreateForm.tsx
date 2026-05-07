"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, Plus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import {
  productCreateSchema,
  type ProductCreateInput,
} from "@features/admin/schemas/productCreate.schema";
import { useCategories } from "@features/categories/hooks/useCategories";

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ProductCreateForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [slugManual, setSlugManual] = useState(false);
  const { data: categories = [] } = useCategories();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductCreateInput>({
    resolver: zodResolver(productCreateSchema),
    defaultValues: { price: 0 },
  });

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value;
    if (!slugManual) setValue("slug", slugify(name), { shouldValidate: false });
  }

  async function onSubmit(values: ProductCreateInput) {
    setSubmitting(true);

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      toast.error(body.error ?? "Falha ao criar produto");
      setSubmitting(false);
      return;
    }

    toast.success("Produto criado");
    router.push(`/admin/products/${body.id}/edit`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link
          href="/admin/products"
          className="flex items-center gap-1.5 font-poppins text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-brand-pink transition-colors mb-3"
        >
          <ArrowLeft size={12} /> Voltar aos produtos
        </Link>
        <h1 className="font-poppins font-black text-2xl text-white uppercase tracking-wide">
          Novo produto
        </h1>
        <p className="font-inter text-xs text-gray-500 mt-1">
          Preencha os dados básicos. Imagens, variantes e detalhes podem ser adicionados depois.
        </p>
      </div>

      <div className="bg-[#0f0f0f] border-2 border-white/10 p-5 flex flex-col gap-4">
        <Field label="Nome" error={errors.name?.message}>
          <input
            {...register("name", { onChange: handleNameChange })}
            className={inputCls}
            placeholder="Ex: Óculos Butterfly Acetato Preto"
            autoFocus
          />
        </Field>

        <Field label="Slug (URL)" error={errors.slug?.message} hint="auto-gerado do nome">
          <input
            {...register("slug", {
              onChange: () => setSlugManual(true),
            })}
            className={inputCls}
            placeholder="oculos-butterfly-acetato-preto"
          />
        </Field>

        <Field label="Categoria" error={errors.category_id?.message}>
          <select {...register("category_id")} className={inputCls}>
            <option value="">Sem categoria</option>
            {categories
              .filter((c) => c.kind === "category")
              .map((c) => (
                <option key={c.id} value={c.id} className="bg-[#0f0f0f]">
                  {c.name_pt}
                </option>
              ))}
          </select>
        </Field>

        <Field label="Preço (centavos)" error={errors.price?.message} hint="ex: 19900 = R$199,00">
          <input
            type="number"
            min={1}
            {...register("price", { valueAsNumber: true })}
            className={inputCls}
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="self-start flex items-center gap-2 font-poppins text-xs font-black uppercase tracking-wider border-2 border-brand-pink bg-brand-pink text-white px-5 py-2.5 shadow-[3px_3px_0_rgba(255,255,255,0.1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0_rgba(255,255,255,0.1)] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {submitting ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
        Criar produto
      </button>
    </form>
  );
}

const inputCls =
  "w-full bg-[#0f0f0f] border-2 border-white/20 px-3 py-2 font-inter text-sm text-white placeholder:text-gray-600 outline-none focus:border-brand-pink transition-colors";

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-poppins text-[10px] font-bold uppercase tracking-wider text-gray-400">
        {label}
        {hint && (
          <span className="ml-2 text-gray-600 normal-case font-normal tracking-normal">
            — {hint}
          </span>
        )}
      </label>
      {children}
      {error && <p className="font-inter text-[11px] text-red-400">{error}</p>}
    </div>
  );
}
