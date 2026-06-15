"use client";

import { useState, useMemo } from "react";
import { Modal } from "../primitives/Modal";
import { Button } from "../primitives/Button";
import { Input } from "../primitives/Input";
import { Search } from "lucide-react";
import { useProducts } from "../../hooks/product/useProducts.hook";

import { formatPrice } from "@features/products/utils/formatPrice";

interface Props {
  open: boolean;
  onClose: () => void;
  selectedIds: string[];
  onConfirm: (ids: string[]) => void;
}

export function ManualProductsModal({ open, onClose, selectedIds, onConfirm }: Props) {
  const { data: products = [], isLoading } = useProducts();
  const [localSelected, setLocalSelected] = useState<string[]>(selectedIds);
  const [search, setSearch] = useState("");

  const activeProducts = useMemo(() => {
    return products.filter((p) => p.active);
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!search) return activeProducts;
    const lowerSearch = search.toLowerCase();
    return activeProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerSearch) ||
        (p.code && p.code.toLowerCase().includes(lowerSearch))
    );
  }, [activeProducts, search]);

  function handleToggle(id: string) {
    setLocalSelected((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  }

  function handleConfirm() {
    onConfirm(localSelected);
    onClose();
  }

  return (
    <Modal
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
      title="Gerenciar Produtos Manuais"
      description="Selecione os produtos que devem aparecer nesta seção da home."
      size="md"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" size="sm" onClick={handleConfirm}>
            Salvar ({localSelected.length})
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="relative">
          <Input
            placeholder="Buscar por nome ou código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute right-3 top-3 text-white/30" size={19} />
        </div>

        <div className="h-96 overflow-y-auto border border-white/10 bg-[#050505] p-2 space-y-1">
          {isLoading && (
            <p className="text-center font-mono text-[12px] text-white/40 p-4">
              Carregando produtos...
            </p>
          )}

          {!isLoading && filteredProducts.length === 0 && (
            <p className="text-center font-mono text-[12px] text-white/40 p-4">
              Nenhum produto encontrado.
            </p>
          )}

          {filteredProducts.map((p) => {
            const isSelected = localSelected.includes(p.id);
            return (
              <label
                key={p.id}
                className={`flex items-center gap-3 p-3 cursor-pointer transition-colors border ${
                  isSelected
                    ? "border-brand-pink/30 bg-brand-pink/5"
                    : "border-transparent hover:bg-white/5"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggle(p.id)}
                  className="w-4 h-4 rounded-none border-white/20 bg-transparent text-brand-pink focus:ring-0 focus:ring-offset-0"
                />
                <div>
                  <p className="font-poppins text-[15px] font-semibold text-white">
                    {p.name}
                  </p>
                  <p className="font-mono text-[12px] text-white/40">
                    SKU: {p.code || "N/A"} · {formatPrice(p.price)}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
