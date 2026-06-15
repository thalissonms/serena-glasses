import z from "zod";

export const variantAddSchema = z.object({
  color_name: z.string().min(1, "Obrigatório").max(60),
  color_hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Formato: #RRGGBB"),
  in_stock: z.boolean(),
});