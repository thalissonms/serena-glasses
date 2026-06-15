import { z } from "zod";

export const HomeSectionType = z.enum([
  "manual",
  "subcategory",
  "category",
  "is_new",
  "is_sale",
  "is_outlet",
  "featured"
]);

export const homeSectionCreateSchema = z.object({
  title_pt: z.string().min(1, "O título é obrigatório"),
  type: HomeSectionType,
  subcategory_id: z.string().nullable().optional(),
  category_id: z.string().nullable().optional(),
  is_special_component: z.boolean(),
  active: z.boolean(),
  display_order: z.number().int(),
  product_ids: z.array(z.string()).optional(),
});

export const homeSectionUpdateSchema = homeSectionCreateSchema.partial();

export const homeSectionReorderSchema = z.array(
  z.object({
    id: z.string().uuid(),
    display_order: z.number().int(),
  })
);

export const homeSectionProductCreateSchema = z.object({
  product_id: z.string(),
  position: z.number().int().default(0),
});

export const homeSectionProductsUpdateSchema = z.array(homeSectionProductCreateSchema);
