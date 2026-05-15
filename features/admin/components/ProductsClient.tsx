"use client";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import ProductFlagToggle from "./ProductFlagToggle";
import StockBadge from "./StockBadge";
import { sumProductStock } from "../utils/sumProductStock";
import type { ProductType } from "../types/products.type";
import { formatPrice } from "@features/products/utils/formatPrice";

export default function ProductsClient({ products }: { products: ProductType[] }) {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-poppins font-black text-2xl text-white uppercase tracking-wide">
            Produtos
          </h1>
          <p className="font-inter text-sm text-gray-400 mt-1">
            {products.length} produto{products.length !== 1 ? "s" : ""}{" "}
            cadastrado{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 font-poppins text-xs font-black uppercase tracking-wider border-2 border-brand-pink bg-brand-pink text-white px-4 py-2.5 shadow-[3px_3px_0_rgba(255,255,255,0.1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0_rgba(255,255,255,0.1)] transition-all"
        >
          <Plus size={14} />
          Novo produto
        </Link>
      </div>

      <div className="bg-[#0f0f0f] border-2 border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {["Produto", "Código", "Cores", "Categoria", "Preço", "Estoque", "Status", "Flags", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left font-poppins text-[10px] font-bold uppercase tracking-widest text-gray-500"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((product) => {
                const images = [...(product.product_images ?? [])].sort(
                  (a, b) => a.position - b.position,
                );
                const image = images[0];
                const stock = sumProductStock(product.product_variants);

                return (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {image ? (
                          <div className="relative w-10 h-10 border border-white/10 bg-pink-50/10 shrink-0 overflow-hidden">
                            <Image
                              src={image.url}
                              alt={image.alt ?? product.name}
                              fill
                              sizes="40px"
                              className="object-contain p-1"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 border border-white/10 bg-white/5 shrink-0" />
                        )}
                        <div>
                          <p className="font-poppins font-bold text-sm text-white leading-tight">
                            {product.name}
                          </p>
                          <p className="font-inter text-[10px] text-gray-600 mt-0.5">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px] text-gray-400 whitespace-nowrap">
                      {product.code ?? <span className="text-gray-700">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      {product.product_variants.length > 0 ? (
                        <div className="flex items-center gap-1.5">
                          {product.product_variants.slice(0, 5).map((v) => (
                            <span
                              key={v.id}
                              className="w-4 h-4 border border-white/20 shrink-0"
                              style={{ backgroundColor: v.color_hex }}
                              title={v.color_name}
                            />
                          ))}
                          {product.product_variants.length > 5 && (
                            <span className="font-inter text-[10px] text-gray-600">
                              +{product.product_variants.length - 5}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="font-inter text-[10px] text-gray-700">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-poppins text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      {product.category?.name_pt ?? "—"}
                    </td>
                    <td className="px-5 py-4 font-poppins font-semibold text-sm text-white whitespace-nowrap">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-5 py-4">
                      <StockBadge stock={stock} />
                    </td>
                    <td className="px-5 py-4">
                      <ProductFlagToggle
                        productId={product.id}
                        field="active"
                        initialValue={product.active}
                        label={product.active ? "Ativo" : "Inativo"}
                        tone="green"
                      />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        <ProductFlagToggle
                          productId={product.id}
                          field="featured"
                          initialValue={product.featured}
                          label="Destaque"
                          tone="pink"
                        />
                        <ProductFlagToggle
                          productId={product.id}
                          field="is_new"
                          initialValue={product.is_new}
                          label="New"
                          tone="pink"
                        />
                        <ProductFlagToggle
                          productId={product.id}
                          field="is_sale"
                          initialValue={product.is_sale}
                          label="Sale"
                          tone="orange"
                        />
                        <ProductFlagToggle
                          productId={product.id}
                          field="is_outlet"
                          initialValue={product.is_outlet}
                          label="Outlet"
                          tone="blue"
                        />
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="flex items-center gap-1.5 font-poppins text-[10px] font-black uppercase tracking-wider text-white border border-white/20 px-3 py-1.5 hover:border-brand-pink hover:text-brand-pink transition-colors whitespace-nowrap"
                        >
                          <Pencil size={10} /> Editar
                        </Link>
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          className="font-poppins text-[10px] font-black uppercase tracking-wider text-gray-500 border border-white/10 px-3 py-1.5 hover:border-brand-pink hover:text-brand-pink transition-colors whitespace-nowrap"
                        >
                          Ver ↗
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-5 py-12 text-center font-inter text-sm text-gray-600"
                  >
                    Nenhum produto encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
