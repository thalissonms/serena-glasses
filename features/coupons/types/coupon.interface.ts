export type CouponDiscountType = "percentage" | "fixed";
export type CouponAppliesTo = "all" | "products" | "categories";

export interface CouponInterface {
  id: string;
  code: string;
  description: string | null;
  discount_type: CouponDiscountType;
  discount_value: number;
  max_discount_cents: number | null;
  min_order_cents: number;
  first_purchase_only: boolean;
  free_shipping: boolean;
  applies_to: CouponAppliesTo;
  applicable_product_ids: string[] | null;
  applicable_categories: string[] | null;
  usage_limit_total: number | null;
  usage_limit_per_email: number;
  valid_from: string;
  valid_until: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AppliedCouponInterface {
  coupon_id: string;
  code: string;
  discount_type: CouponDiscountType;
  discount_value: number;
  discount_applied_cents: number;
}

export interface CouponWithUsageInterface extends CouponInterface {
  usage_count: number;
}
