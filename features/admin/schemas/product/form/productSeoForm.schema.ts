import { z } from "zod";

export const productSeoSchema = z.object({
  seo_title: z.string().max(200, "Máximo 200 caracteres").optional(),
  seo_description: z.string().max(500, "Máximo 500 caracteres").optional(),
});
