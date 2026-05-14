import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const productCreateSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().regex(slugRegex, "Slug inválido (use apenas a-z, 0-9 e -)").max(120),
  price: z.number().int().positive("Preço deve ser maior que zero"),
  weight: z.number().int().min(1, "Peso deve ser maior que 0"),
  category_id: z.string().uuid().optional(),
  subcategory_ids: z.array(z.string().uuid()).optional(),
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
