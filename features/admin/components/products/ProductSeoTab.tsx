"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { clsx } from "clsx";
import { Save, X } from "lucide-react";

import { isApiError } from "../../utils/isApiError";
import { useUpdateSeo } from "../../hooks/product/useProductSeo.hook";
import { productSeoSchema } from "../../schemas/product/form/productSeoForm.schema";
import type { ProductSeoFormData } from "../../types/product/productSeoFormData.type";
import { Button } from "../primitives/Button";
import { Input } from "../primitives/Input";
import Textarea from "../primitives/inputs/Textarea";

export function SeoTab({
  productId,
  initialData,
}: {
  productId: string;
  initialData: {
    seo_title: string | null;
    seo_description: string | null;
    seo_keywords: string[] | null;
  };
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductSeoFormData>({
    resolver: zodResolver(productSeoSchema),
    defaultValues: {
      seo_title: initialData.seo_title ?? "",
      seo_description: initialData.seo_description ?? "",
    },
  });

  const [keywords, setKeywords] = useState<string[]>(
    initialData.seo_keywords ?? [],
  );
  const [kwInput, setKwInput] = useState("");

  const seoMutation = useUpdateSeo(productId);

  function addKeyword(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "Enter" || e.key === ",") && kwInput.trim()) {
      e.preventDefault();
      const kw = kwInput.trim().replace(/,$/, "");
      if (kw && !keywords.includes(kw) && keywords.length < 30) {
        setKeywords((prev) => [...prev, kw]);
      }
      setKwInput("");
    }
  }

  function removeKeyword(kw: string) {
    setKeywords((prev) => prev.filter((k) => k !== kw));
  }

  async function onSubmit(data: ProductSeoFormData) {
    try {
      await seoMutation.mutateAsync({
        seo_title: data.seo_title || null,
        seo_description: data.seo_description || null,
        seo_keywords: keywords.length > 0 ? keywords : null,
      });
      toast.success("SEO atualizado");
    } catch (err: unknown) {
      if (isApiError(err)) {
        toast.error(err.message);
        return;
      }
      toast.error("Erro inesperado ao salvar SEO");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 max-w-xl"
    >
      <Input
        label="Título SEO"
        placeholder="Título para motores de busca (máx. 200)"
        {...register("seo_title")}
        error={errors.seo_title?.message}
      />

      <Textarea
        label="Meta Descrição"
        rows={4}
        placeholder="Descrição para resultados de busca (máx. 500)..."
        {...register("seo_description")}
        error={errors.seo_description?.message}
      />

      <div className="flex flex-col gap-1.5">
        <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">{"// "}Keywords
        </label>
        <div
          className={clsx(
            "flex flex-wrap gap-1.5 p-2 bg-[#0a0a0a] border-2 border-brand-pink/20",
            "focus-within:border-brand-pink focus-within:shadow-[0_0_8px_rgba(255,0,182,0.2)]",
            "transition-all duration-150 min-h-10.5",
          )}
        >
          {keywords.map((kw) => (
            <span
              key={kw}
              className="flex items-center gap-1 px-2 py-0.5 bg-brand-pink/10 border border-brand-pink/20 font-mono text-[11px] text-brand-pink/80"
            >{"// "}{kw}
              <button
                type="button"
                onClick={() => removeKeyword(kw)}
                className="text-brand-pink/50 hover:text-brand-pink transition-colors"
              >
                <X size={11} />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={kwInput}
            onChange={(e) => setKwInput(e.target.value)}
            onKeyDown={addKeyword}
            placeholder={
              keywords.length === 0 ? "Digite e pressione Enter ou ," : ""
            }
            className="flex-1 min-w-24 bg-transparent font-mono text-[13px] text-white placeholder:text-white/20 outline-none py-0.5 px-1"
          />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-wider text-white/20">{"// "}Enter ou vírgula para adicionar — máx. 30 keywords
        </p>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={isSubmitting || seoMutation.isPending}
        >
          <Save size={15} />
          Salvar SEO
        </Button>
      </div>
    </form>
  );
}
