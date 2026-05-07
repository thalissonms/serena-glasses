import { requireAdmin } from "@shared/lib/auth/admin";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CouponEditForm from "@features/admin/components/CouponEditForm";
import type { CouponWithUsageInterface } from "@features/coupons/types/coupon.interface";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminCouponEditPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const [{ data: coupon }, { count: usageCount }] = await Promise.all([
    getSupabaseServer().from("coupons").select("*").eq("id", id).single(),
    getSupabaseServer()
      .from("coupon_usages")
      .select("*", { count: "exact", head: true })
      .eq("coupon_id", id),
  ]);

  if (!coupon) notFound();

  const couponWithUsage: CouponWithUsageInterface = {
    ...coupon,
    usage_count: usageCount ?? 0,
  };

  return (
    <div className="p-8 max-w-3xl">
      <Link
        href="/admin/coupons"
        className="flex items-center gap-1.5 font-poppins text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-brand-pink transition-colors mb-6"
      >
        <ArrowLeft size={12} /> Voltar aos cupons
      </Link>
      <div className="flex items-center gap-4 mb-8">
        <h1 className="font-poppins font-black text-2xl text-white uppercase tracking-wide">
          Editar cupom
        </h1>
        {!coupon.active && (
          <span className="text-xs font-poppins font-black uppercase bg-red-900/50 text-red-400 border border-red-800 px-2 py-1">
            Inativo
          </span>
        )}
      </div>
      <CouponEditForm coupon={couponWithUsage} />
    </div>
  );
}
