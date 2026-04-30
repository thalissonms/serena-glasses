import { z } from "zod";

export const variantCreateSchema = z.object({
  color_name: z.string().min(1).max(60),
  color_hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Hex inválido (#RRGGBB)"),
  in_stock: z.boolean().default(true),
});

export type VariantCreateInput = z.infer<typeof variantCreateSchema>;
