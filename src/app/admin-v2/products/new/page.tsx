/**
 * Page: /admin-v2/products/new — formulário multi-tab de criação de produto.
 *
 * Server Component: busca categorias e passa para ProductCreateForm.
 */
import { requireAdmin } from "@shared/lib/auth/admin";
import { getCategoriesList } from "@features/admin/services/categoriesList.service";
import ProductCreateForm from "@features/admin-v2/components/products/ProductCreateForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AdminV2ProductNewPage() {
  await requireAdmin();
  const categories = await getCategoriesList();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin-v2/products"
          className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-white/25 hover:text-[#FF00B6]/60 transition-colors duration-150"
        >
          <ArrowLeft size={10} />
          Produtos
        </Link>
        <div className="flex-1 h-px bg-white/5" />
        <h1 className="font-shrikhand text-2xl text-white tracking-wide">NOVO PRODUTO</h1>
      </div>
      <ProductCreateForm categories={categories} />
    </div>
  );
}
