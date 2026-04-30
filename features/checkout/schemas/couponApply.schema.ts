import { z } from "zod";

export const couponApplySchema = z.object({
  code: z.string().min(1).max(40),
  items: z.array(
    z.object({
      variantId: z.string().uuid(),
      productId: z.string().uuid().optional(),
      quantity: z.number().int().positive(),
    }),
  ),
  email: z.string().email().optional(),
});

export type CouponApplyInput = z.infer<typeof couponApplySchema>;
