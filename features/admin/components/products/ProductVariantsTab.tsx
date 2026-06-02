"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { clsx } from "clsx";
import { Trash2, Plus, ToggleLeft, ToggleRight } from "lucide-react";

import type { VariantWithStockInterface } from "../../types/product/productVariant.interface";
import type { VariantAddData } from "../../types/product/productVariantAdd.type";
import { variantAddSchema } from "../../schemas/product/form/productVariantAddForm.schema";
import { isApiError } from "../../utils/isApiError";

import { useAddVariant, useDeleteVariant } from "../../hooks/product/useProductVariant.hook";
import { Button } from "../primitives/Button";
import { Input } from "../primitives/Input";
import { Modal } from "../primitives/Modal";
import VariantCard from "./ProductVariantCard";

export function VariantsTab({
  productId,
  initialVariants,
}: {
  productId: string;
  initialVariants: VariantWithStockInterface[];
}) {
  const [variants, setVariants] = useState<VariantWithStockInterface[]>(initialVariants);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const addMutation = useAddVariant(productId);
  const deleteMutation = useDeleteVariant();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<VariantAddData>({
    resolver: zodResolver(variantAddSchema),
    defaultValues: { color_name: "", color_hex: "#000000", in_stock: true },
  });

  async function onAddVariant(data: VariantAddData) {
    try {
      const created = await addMutation.mutateAsync(data);
      setVariants((prev) => [
        ...prev,
        {
          id: created.id,
          color_name: created.color_name,
          color_hex: created.color_hex,
          in_stock: created.in_stock,
          stock: { total: 0, reserved: 0, available: 0 },
        },
      ]);
      reset({ color_name: "", color_hex: "#000000", in_stock: true });
      setShowAddForm(false);
      toast.success("Variante adicionada");
    } catch (err: unknown) {
      if (isApiError(err)) {
        toast.error(err.message);
        return;
      }
      toast.error("Erro ao adicionar variante");
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;

    try {
      await deleteMutation.mutateAsync(deleteId);
      setVariants((prev) => prev.filter((v) => v.id !== deleteId));
      setDeleteId(null);
      toast.success("Variante excluída");
    } catch (err: unknown) {
      if (isApiError(err)) {
        toast.error(err.message);
        setDeleteId(null);
        return;
      }
      toast.error("Erro ao excluir variante");
      setDeleteId(null);
    }
  }

  function handleUpdate(id: string, patch: Partial<VariantWithStockInterface>) {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...patch } : v)),
    );
  }

  const variantToDelete = variants.find((v) => v.id === deleteId);

  return (
    <div className="space-y-4">
      <Modal
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Excluir Variante"
        description="Esta ação é permanente e não pode ser desfeita."
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDeleteId(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={deleteMutation.isPending}
              onClick={confirmDelete}
            >
              <Trash2 size={14} />
              Excluir
            </Button>
          </>
        }
      >
        <p className="font-mono text-[13px] text-white/60">
          Excluir a variante{" "}
          <span
            className="font-bold"
            style={{ color: variantToDelete?.color_hex }}
          >
            {variantToDelete?.color_name}
          </span>
          ?
        </p>
      </Modal>

      {variants.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border border-dashed border-white/10">
          <p className="font-mono text-[11px] uppercase tracking-widest text-white/20">{"// "}Nenhuma variante cadastrada
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {variants.map((v) => (
            <VariantCard
              key={v.id}
              variant={v}
              onDelete={setDeleteId}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}

      {showAddForm ? (
        <form
          onSubmit={handleSubmit(onAddVariant)}
          noValidate
          className="border border-brand-pink/20 bg-[#050505] p-4 space-y-4"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-pink/60">{"// "}Nova Variante
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <Input
              label="Nome da Cor *"
              placeholder="Ex: Azul Marinho"
              {...register("color_name")}
              error={errors.color_name?.message}
            />
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">{"// "}Hex da Cor *
              </label>
              <div
                className={clsx(
                  "flex items-center bg-[#0a0a0a] border-2 transition-all duration-150",
                  errors.color_hex
                    ? "border-red-500/60"
                    : "border-brand-pink/20 focus-within:border-brand-pink",
                )}
              >
                <Controller
                  name="color_hex"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        type="color"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-8 h-9 cursor-pointer bg-transparent border-0 outline-none p-0.5"
                      />
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="#000000"
                        className="flex-1 bg-transparent px-2 py-2.5 font-mono text-[14px] text-white outline-none placeholder:text-white/20"
                      />
                    </>
                  )}
                />
              </div>
              {errors.color_hex && (
                <p className="font-mono text-[11px] uppercase tracking-wider text-red-400">{"// "}{errors.color_hex.message}
                </p>
              )}
            </div>
            <Controller
              name="in_stock"
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() => field.onChange(!field.value)}
                  className={clsx(
                    "flex items-center gap-2 px-4 py-2.5 border-2 transition-all duration-150",
                    "font-mono text-[11px] uppercase tracking-widest h-10.5",
                    field.value
                      ? "border-brand-pink/40 text-brand-pink bg-brand-pink/8"
                      : "border-white/10 text-white/30 hover:border-white/20",
                  )}
                >
                  {field.value ? (
                    <ToggleRight size={17} />
                  ) : (
                    <ToggleLeft size={17} />
                  )}
                  Em estoque
                </button>
              )}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={isSubmitting || addMutation.isPending}
            >
              <Plus size={14} />
              Adicionar
            </Button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                reset();
              }}
              className="font-mono text-[11px] uppercase tracking-widest text-white/25 hover:text-white/40 transition-colors"
            >{"// "}Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className={clsx(
            "w-full flex items-center justify-center gap-2 py-3",
            "border border-dashed border-brand-pink/20",
            "font-mono text-[11px] uppercase tracking-widest text-brand-pink/40",
            "hover:text-brand-pink/70 hover:border-brand-pink/40 transition-all duration-150",
          )}
        >
          <Plus size={14} />
          Adicionar Cor
        </button>
      )}
    </div>
  );
}
