"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { clsx } from "clsx";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";

import type { ProductEditData } from "@features/admin/services/productEdit.service";
import type { CategoryWithSubs } from "@features/categories/types/category.types";
import { TabId } from "../../types/product/tabId.type";
import { TABS_EDIT } from "../../consts/tabs.const";

import { Button } from "@features/admin/components/primitives/Button";
import { Modal } from "@features/admin/components/primitives/Modal";

import { DetailsTab } from "./ProductDatailTab";
import { VariantsTab } from "./ProductVariantsTab";
import { ImagesTab } from "./ProductImagesTab";
import { VideoTab } from "./ProductVideoTab";
import { SeoTab } from "./ProductSeoTab";

interface Props {
  product: ProductEditData;
  categories: CategoryWithSubs[];
}

export default function ProductEditClient({ product, categories }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("details");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDeleteProduct() {
    setDeleting(true);
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "DELETE",
    });
    setDeleting(false);
    if (!res.ok) {
      toast.error("Erro ao desativar produto");
      return;
    }
    toast.success("Produto desativado");
    router.push("/admin/products");
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Modal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Desativar Produto"
        description="O produto será ocultado da loja. Esta ação pode ser revertida pelo suporte."
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDeleteOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={deleting}
              onClick={handleDeleteProduct}
            >
              <Trash2 size={14} />
              Desativar
            </Button>
          </>
        }
      >
        <p className="font-mono text-[13px] text-white/60">
          Desativar <span className="text-white font-bold">{product.name}</span>
          ?
        </p>
      </Modal>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex flex-col gap-1.5">
          <Link
            href="/admin/products"
            className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-white/25 hover:text-brand-pink/60 transition-colors w-fit"
          >
            <ArrowLeft size={13} />
            Produtos
          </Link>
          <h1 className="font-poppins font-black text-2xl text-white tracking-wide leading-tight">
            {product.name}
          </h1>
          {product.code && (
            <p className="font-mono text-[12px] uppercase tracking-[0.25em] text-brand-pink/50">{"// "}SKU: {product.code}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          className={clsx(
            "flex items-center gap-1.5 px-4 py-2 border border-red-500/20",
            "font-mono text-[11px] uppercase tracking-widest text-red-500/40",
            "hover:text-red-400 hover:border-red-400/40 transition-all duration-150",
          )}
        >
          <Trash2 size={14} />
          Desativar
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-white/8 bg-[#0a0a0a]">
        {TABS_EDIT.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              "relative px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-150",
              "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5",
              "after:bg-brand-pink after:transition-transform after:duration-200 after:origin-left",
              "outline-none",
              activeTab === tab.id
                ? "text-white after:scale-x-100"
                : "text-white/30 hover:text-white/60 after:scale-x-0",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* All panels always mounted — hidden via CSS to preserve form state */}
      <div className="bg-[#0a0a0a] border border-white/5 border-t-0 p-6">
        <div className={clsx(activeTab !== "details" && "hidden")}>
          <DetailsTab product={product} categories={categories} />
        </div>
        <div className={clsx(activeTab !== "variants" && "hidden")}>
          <VariantsTab
            productId={product.id}
            initialVariants={product.variants}
          />
        </div>
        <div className={clsx(activeTab !== "images" && "hidden")}>
          <ImagesTab productId={product.id} initialImages={product.images} />
        </div>
        <div className={clsx(activeTab !== "video" && "hidden")}>
          <VideoTab
            productId={product.id}
            initialVideoUrl={product.video_url}
          />
        </div>
        <div className={clsx(activeTab !== "seo" && "hidden")}>
          <SeoTab
            productId={product.id}
            initialData={{
              seo_title: product.seo_title,
              seo_description: product.seo_description,
              seo_keywords: product.seo_keywords,
            }}
          />
        </div>
      </div>
    </div>
  );
}
