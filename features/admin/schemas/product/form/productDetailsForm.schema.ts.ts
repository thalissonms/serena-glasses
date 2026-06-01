import z from "zod";

export const productDetailsFormSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(120),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Apenas a-z, 0-9 e hífens")
    .max(120),
  price: z.string().refine((v) => {
    const n = parseFloat(v.replace(",", "."));
    return !isNaN(n) && n > 0;
  }, "Preço inválido — ex: 199,90"),
  compare_at_price: z
    .string()
    .optional()
    .refine((v) => {
      if (!v || v === "") return true;
      const n = parseFloat(v.replace(",", "."));
      return !isNaN(n) && n >= 0;
    }, "Valor inválido"),
  weight: z
    .string()
    .optional()
    .refine((v) => {
      if (!v || v === "") return true;
      const n = parseInt(v, 10);
      return !isNaN(n) && n >= 1;
    }, "Mínimo 1 grama"),
  category_id: z.string().optional(),
  subcategory_ids: z.array(z.string()).optional(),
  max_installments: z.string().optional(),
  frame_shape: z.string().optional(),
  frame_material: z.string().optional(),
  lens_type: z.string().optional(),
  uv_protection: z.boolean(),
  featured: z.boolean(),
  is_new: z.boolean(),
  is_sale: z.boolean(),
  is_outlet: z.boolean(),
  dimensions: z.string().max(100).optional(),
  short_description: z.string().max(500).optional(),
  description: z.string().max(5000).optional(),
});

