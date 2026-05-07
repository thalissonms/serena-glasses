import { z } from "zod";
import { ALLOWED_CATEGORY_ICONS } from "../consts/categoryIcons";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const categoryCreateSchema = z.object({
  slug: z.string().regex(slugRegex, "Apenas letras minúsculas, números e hífens").max(40),
  name_pt: z.string().min(1).max(60),
  name_en: z.string().max(60).optional(),
  name_es: z.string().max(60).optional(),
  icon_name: z.enum(ALLOWED_CATEGORY_ICONS),
  kind: z.enum(["category", "flag"]).default("category"),
  href_override: z.string().max(200).nullable().optional(),
});

export const categoryPatchSchema = categoryCreateSchema.partial().extend({
  active: z.boolean().optional(),
  display_order: z.number().int().nonnegative().optional(),
});

export const categoryReorderSchema = z.object({
  ids: z.array(z.string().uuid()).min(1),
});

export const subcategoryCreateSchema = z.object({
  slug: z.string().regex(slugRegex, "Apenas letras minúsculas, números e hífens").max(40),
  name_pt: z.string().min(1).max(60),
  name_en: z.string().max(60).optional(),
  name_es: z.string().max(60).optional(),
});

export const subcategoryPatchSchema = subcategoryCreateSchema.partial().extend({
  active: z.boolean().optional(),
  display_order: z.number().int().nonnegative().optional(),
});

export const subcategoryReorderSchema = z.object({
  ids: z.array(z.string().uuid()).min(1),
});

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryPatchInput = z.infer<typeof categoryPatchSchema>;
export type SubcategoryCreateInput = z.infer<typeof subcategoryCreateSchema>;
export type SubcategoryPatchInput = z.infer<typeof subcategoryPatchSchema>;
