import { NextRequest, NextResponse } from "next/server";
import { couponApplySchema } from "@features/checkout/schemas/couponApply.schema";
import { validateCoupon } from "@features/coupons/services/couponValidation.service";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });

  const parsed = couponApplySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Dados inválidos" }, { status: 400 });
  }

  const result = await validateCoupon(parsed.data);

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error });
  }

  return NextResponse.json({
    ok: true,
    code: result.coupon.code,
    discount_applied_cents: result.coupon.discount_applied_cents,
    discount_type: result.coupon.discount_type,
    discount_value: result.coupon.discount_value,
  });
}
