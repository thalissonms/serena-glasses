import { z } from "zod";

export const variantPatchSchema = z.object({
  stock_quantity: z.number().int().nonnegative().optional(),
  in_stock: z.boolean().optional(),
  color_name: z.string().min(1).max(60).optional(),
  color_hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Hex inválido (#RRGGBB)").optional(),
});

export type VariantPatchInput = z.infer<typeof variantPatchSchema>;
