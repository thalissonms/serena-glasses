import { requireAdmin } from "@shared/lib/auth/admin";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CouponCreateForm from "@features/admin/components/CouponCreateForm";

export default async function AdminCouponNewPage() {
  await requireAdmin();

  return (
    <div className="p-8 max-w-3xl">
      <Link
        href="/admin/coupons"
        className="flex items-center gap-1.5 font-poppins text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-brand-pink transition-colors mb-6"
      >
        <ArrowLeft size={12} /> Voltar aos cupons
      </Link>
      <h1 className="font-poppins font-black text-2xl text-white uppercase tracking-wide mb-8">
        Novo cupom
      </h1>
      <CouponCreateForm />
    </div>
  );
}
