"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, Save, Trash2, ArrowLeft, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import VariantStockEditor from "./VariantStockEditor";
import VariantCreateForm from "./VariantCreateForm";
import ImageUploader from "./ImageUploader";
import VideoUploader from "./VideoUploader";
import { CATEGORY_LABEL } from "../consts/products.const";
import type { VariantWithStockInterface } from "../types/productVariant.interface";
import type { ProductImageInterface } from "../types/productImage.interface";
import {
  productPatchSchema,
  type ProductPatchInput,
  PRODUCT_CATEGORIES,
  FRAME_SHAPES,
  FRAME_MATERIALS,
  LENS_TYPES,
} from "@features/admin/schemas/productEdit.schema";

interface Props {
  productId: string;
  initial: ProductPatchInput & { name: string; slug: string };
  variants: VariantWithStockInterface[];
  images: ProductImageInterface[];
  videoUrl: string | null;
}

export default function ProductEditForm({ productId, initial, variants, images, videoUrl }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProductPatchInput>({
    resolver: zodResolver(productPatchSchema),
    defaultValues: initial,
  });

  async function onSubmit(values: ProductPatchInput) {
    setSubmitting(true);

    const payload: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(values)) {
      if (v === "" || v === undefined) continue;
      payload[k] = v;
    }

    const res = await fetch(`/api/admin/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success("Produto salvo");
      reset(values);
      router.refresh();
    } else {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error ?? "Falha ao salvar");
    }

    setSubmitting(false);
  }

  async function handleDelete() {
    if (!confirm("Desativar este produto? Ele deixará de aparecer na loja.")) return;
    setDeleting(true);

    const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });

    if (res.ok) {
      router.replace("/admin/products");
    } else {
      toast.error("Falha ao desativar produto");
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/products"
            className="flex items-center gap-1.5 font-poppins text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-brand-pink transition-colors mb-3"
          >
            <ArrowLeft size={12} /> Voltar aos produtos
          </Link>
          <h1 className="font-poppins font-black text-2xl text-white uppercase tracking-wide">
            {initial.name}
          </h1>
          <Link
            href={`/products/${initial.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1 font-inter text-xs text-gray-500 hover:text-brand-pink mt-1"
          >
            /{initial.slug} <ExternalLink size={10} />
          </Link>
        </div>
      </div>

      {/* Básico */}
      <Section title="Informações básicas">
        <Field label="Nome" error={errors.name?.message}>
          <input {...register("name")} className={inputCls} />
        </Field>
        <Field label="Slug (URL)" error={errors.slug?.message} hint="apenas a-z, 0-9, hífens">
          <input {...register("slug")} className={inputCls} />
        </Field>
        <Field label="Categoria" error={errors.category?.message}>
          <select {...register("category")} className={inputCls}>
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-[#0f0f0f]">
                {CATEGORY_LABEL[c] ?? c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Descrição curta" error={errors.short_description?.message}>
          <input {...register("short_description")} className={inputCls} />
        </Field>
        <Field label="Descrição longa" error={errors.description?.message}>
          <textarea {...register("description")} rows={5} className={inputCls} />
        </Field>
      </Section>

      {/* Preço */}
      <Section title="Preço">
        <Field label="Preço (centavos)" error={errors.price?.message} hint="ex: 19900 = R$199,00">
          <input
            type="number"
            {...register("price", { valueAsNumber: true })}
            className={inputCls}
          />
        </Field>
        <Field label="Preço riscado (centavos)" error={errors.compare_at_price?.message} hint="opcional">
          <input
            type="number"
            {...register("compare_at_price", { setValueAs: (v) => (v === "" ? null : Number(v)) })}
            className={inputCls}
          />
        </Field>
      </Section>

      {/* Detalhes */}
      <Section title="Detalhes técnicos">
        <Field label="Forma do aro" error={errors.frame_shape?.message}>
          <select
            {...register("frame_shape", { setValueAs: (v) => (v === "" ? null : v) })}
            className={inputCls}
          >
            <option value="">—</option>
            {FRAME_SHAPES.map((f) => (
              <option key={f} value={f} className="bg-[#0f0f0f]">{f}</option>
            ))}
          </select>
        </Field>
        <Field label="Material" error={errors.frame_material?.message}>
          <select
            {...register("frame_material", { setValueAs: (v) => (v === "" ? null : v) })}
            className={inputCls}
          >
            <option value="">—</option>
            {FRAME_MATERIALS.map((f) => (
              <option key={f} value={f} className="bg-[#0f0f0f]">{f}</option>
            ))}
          </select>
        </Field>
        <Field label="Tipo de lente" error={errors.lens_type?.message}>
          <select
            {...register("lens_type", { setValueAs: (v) => (v === "" ? null : v) })}
            className={inputCls}
          >
            <option value="">—</option>
            {LENS_TYPES.map((f) => (
              <option key={f} value={f} className="bg-[#0f0f0f]">{f}</option>
            ))}
          </select>
        </Field>
        <Field label="Peso (gramas)" error={errors.weight?.message}>
          <input
            type="number"
            step="0.1"
            {...register("weight", { setValueAs: (v) => (v === "" ? null : Number(v)) })}
            className={inputCls}
          />
        </Field>
        <Field label="Dimensões" error={errors.dimensions?.message}>
          <input {...register("dimensions")} className={inputCls} placeholder="140mm x 50mm x 145mm" />
        </Field>
        <Field label="Proteção UV" error={errors.uv_protection?.message}>
          <label className="inline-flex items-center gap-2 mt-2">
            <input type="checkbox" {...register("uv_protection")} className="accent-brand-pink" />
            <span className="font-inter text-sm text-gray-300">Possui proteção UV</span>
          </label>
        </Field>
      </Section>

      {/* Imagens */}
      <Section title="Imagens">
        <ImageUploader productId={productId} initialImages={images} />
      </Section>

      {/* Vídeo */}
      <Section title="Vídeo do produto">
        <VideoUploader productId={productId} initialVideoUrl={videoUrl} />
      </Section>

      {/* Variantes / Estoque */}
      <Section title={`Variantes (${variants.length})`}>
        {variants.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {variants.map((v) => (
              <VariantStockEditor key={v.id} variant={v} />
            ))}
          </div>
        )}
        <VariantCreateForm productId={productId} />
      </Section>

      {/* SEO */}
      <Section title="SEO">
        <Field label="SEO title" error={errors.seo_title?.message}>
          <input {...register("seo_title")} className={inputCls} />
        </Field>
        <Field label="SEO description" error={errors.seo_description?.message}>
          <textarea {...register("seo_description")} rows={2} className={inputCls} />
        </Field>
      </Section>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4 sticky bottom-0 bg-[#1a1a1a] py-4 border-t-2 border-white/10">
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-1.5 font-poppins text-xs font-black uppercase tracking-wider border-2 border-red-500/50 text-red-300 px-4 py-2.5 hover:bg-red-500/10 transition-colors disabled:opacity-50"
        >
          {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
          Desativar produto
        </button>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting || !isDirty}
            className="flex items-center gap-2 font-poppins text-xs font-black uppercase tracking-wider border-2 border-brand-pink bg-brand-pink text-white px-5 py-2.5 shadow-[3px_3px_0_rgba(255,255,255,0.1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0_rgba(255,255,255,0.1)] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {submitting ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            Salvar alterações
          </button>
        </div>
      </div>
    </form>
  );
}

const inputCls =
  "w-full bg-[#0f0f0f] border-2 border-white/20 px-3 py-2 font-inter text-sm text-white placeholder:text-gray-600 outline-none focus:border-brand-pink transition-colors";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#0f0f0f] border-2 border-white/10 p-5 flex flex-col gap-4">
      <h2 className="font-poppins font-black text-xs text-gray-400 uppercase tracking-widest">
        {title}
      </h2>
      {children}
    </div>
  );
}

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
        {hint && <span className="ml-2 text-gray-600 normal-case font-normal tracking-normal">— {hint}</span>}
      </label>
      {children}
      {error && (
        <p className="font-inter text-[11px] text-red-400">{error}</p>
      )}
    </div>
  );
}
