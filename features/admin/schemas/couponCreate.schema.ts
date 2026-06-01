import { z } from "zod";

const codeRegex = /^[A-Z0-9_-]+$/;

const couponBaseSchema = z.object({
  code: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(40, "Máximo 40 caracteres")
    .regex(codeRegex, "Use apenas A-Z, 0-9, _ ou -"),
  description: z.string().max(200).nullable().optional(),
  discount_type: z.enum(["percentage", "fixed", "free_shipping"]),
  discount_value: z.number().int().nonnegative("Deve ser ≥ 0"),
  max_discount_cents: z.number().int().nonnegative().nullable().optional(),
  min_order_cents: z.number().int().nonnegative().default(0),
  first_purchase_only: z.boolean().default(false),
  free_shipping: z.boolean().default(false),
  applies_to: z.enum(["all", "products", "categories"]).default("all"),
  applicable_product_ids: z.array(z.string().uuid()).nullable().optional(),
  applicable_categories: z.array(z.string()).nullable().optional(),
  usage_limit_total: z.number().int().positive().nullable().optional(),
  usage_limit_per_email: z.number().int().positive().default(1),
  valid_from: z.string().datetime().optional(),
  valid_until: z.string().datetime().nullable().optional(),
});

export const couponCreateSchema = couponBaseSchema
  .refine(
    (d) => d.discount_type === "free_shipping" || d.discount_value > 0,
    { message: "Deve ser maior que 0", path: ["discount_value"] },
  )
  .refine(
    (d) => d.discount_type !== "percentage" || d.discount_value <= 100,
    { message: "Percentual não pode ser maior que 100", path: ["discount_value"] },
  )
  .refine(
    (d) =>
      d.applies_to !== "products" ||
      (d.applicable_product_ids != null && d.applicable_product_ids.length > 0),
    { message: "Selecione ao menos um produto", path: ["applicable_product_ids"] },
  )
  .refine(
    (d) =>
      d.applies_to !== "categories" ||
      (d.applicable_categories != null && d.applicable_categories.length > 0),
    { message: "Informe ao menos uma categoria", path: ["applicable_categories"] },
  );

export type CouponCreateInput = z.infer<typeof couponCreateSchema>;

// .partial() precisa ser aplicado no schema base (sem refine) — depois adicionamos active
export const couponPatchSchema = couponBaseSchema.partial().extend({
  active: z.boolean().optional(),
});

export type CouponPatchInput = z.infer<typeof couponPatchSchema>;
