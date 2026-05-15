import { z } from "zod";

export const FRAME_SHAPES = ["round", "square", "cat-eye", "aviator", "rectangle", "oversized", "geometric", "butterfly"] as const;
export const FRAME_MATERIALS = ["acetate", "metal", "mixed", "plastic", "titanium"] as const;
export const LENS_TYPES = ["polarized", "gradient", "mirrored", "solid", "photochromic"] as const;

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Schema de edição de produto. Todos os campos são opcionais (PATCH parcial).
 * Reusado no formulário de criar (campos required no form, validação no submit).
 */
export const productPatchSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  slug: z.string().regex(slugRegex, "Slug inválido (use apenas a-z, 0-9 e -)").max(120).optional(),
  description: z.string().max(5000).optional(),
  short_description: z.string().max(500).optional(),

  price: z.number().int().nonnegative().optional(),
  compare_at_price: z.number().int().nonnegative().nullable().optional(),

  category_id: z.string().uuid().optional(),
  subcategory_ids: z.array(z.string().uuid()).optional(),
  frame_shape: z.enum(FRAME_SHAPES).nullable().optional(),
  frame_material: z.enum(FRAME_MATERIALS).nullable().optional(),
  lens_type: z.enum(LENS_TYPES).nullable().optional(),

  active: z.boolean().optional(),
  featured: z.boolean().optional(),
  is_new: z.boolean().optional(),
  is_sale: z.boolean().optional(),
  is_outlet: z.boolean().optional(),

  uv_protection: z.boolean().optional(),
  weight: z.number().nonnegative().nullable().optional(),
  dimensions: z.string().max(100).nullable().optional(),

  tags: z.array(z.string().max(50)).max(30).optional(),
  included_accessories: z.array(z.string().max(100)).max(20).optional(),

  seo_title: z.string().max(200).nullable().optional(),
  seo_description: z.string().max(500).nullable().optional(),
  seo_keywords: z.array(z.string().max(50)).max(30).optional(),

  max_installments: z.number().int().min(1).max(12).optional(),

  video_url: z.string().url().nullable().optional(),
});

export type ProductPatchInput = z.infer<typeof productPatchSchema>;
