import z from "zod";

// ─── Enums ──────────────────────────────────────────────────────────

export const productCategoryEnum = z.enum([
  "sunglasses",
  "accessories",
  "miniDrop",
]);

export const frameShapeEnum = z.enum([
  "round",
  "square",
  "cat-eye",
  "aviator",
  "rectangle",
  "oversized",
  "geometric",
  "butterfly",
]);

export const frameMaterialEnum = z.enum([
  "acetate",
  "metal",
  "mixed",
  "plastic",
  "titanium",
]);

export const lensTypeEnum = z.enum([
  "polarized",
  "gradient",
  "mirrored",
  "solid",
  "photochromic",
]);

export const productStatusEnum = z.enum([
  "active",
  "draft",
  "archived",
]);

export const productSortByEnum = z.enum([
  "price-asc",
  "price-desc",
  "newest",
  "rating",
  "name-asc",
  "name-desc",
  "featured",
]);

// ─── Subdocumentos ──────────────────────────────────────────────────

export const productColorSchema = z.object({
  name: z.string().min(1),
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, { message: "hex must be #RRGGBB" }),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, { message: "slug must be lowercase with hyphens" }),
});

export const productImageSchema = z.object({
  url: z.string().min(1),
  alt: z.string().min(1),
  isPrimary: z.boolean(),
  order: z.number().int().min(0),
});

export const productVariantSchema = z.object({
  id: z.string().min(1),
  sku: z.string().min(1),
  color: productColorSchema,
  price: z.number().int().positive().optional(),
  compareAtPrice: z.number().int().positive().optional(),
  inStock: z.boolean(),
  stockQuantity: z.number().int().min(0),
  images: z.array(z.string().min(1)),
});

export const productRatingSchema = z.object({
  average: z.number().min(0).max(5),
  count: z.number().int().min(0),
});

export const productSeoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  keywords: z.array(z.string().min(1)),
});

// ─── Documento Principal ────────────────────────────────────────────

export const productSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, { message: "slug must be lowercase with hyphens" }),
  name: z.string().min(1),
  description: z.string().min(1),
  shortDescription: z.string().min(1),
  price: z.number().int().positive(),
  compareAtPrice: z.number().int().positive().optional(),
  currency: z.literal("BRL"),

  category: productCategoryEnum,
  frameShape: frameShapeEnum,
  frameMaterial: frameMaterialEnum,
  lensType: lensTypeEnum,
  tags: z.array(z.string().min(1)),

  images: z.array(productImageSchema).min(1),
  variants: z.array(productVariantSchema),
  rating: productRatingSchema,
  seo: productSeoSchema,

  inStock: z.boolean(),
  stockQuantity: z.number().int().min(0),

  status: productStatusEnum,
  featured: z.boolean(),
  isNew: z.boolean(),
  isOnSale: z.boolean(),
  isOutlet: z.boolean(),
  outletReason: z.string().optional(),

  uvProtection: z.boolean(),
  weight: z.number().positive().optional(),
  dimensions: z.string().optional(),
  includedAccessories: z.array(z.string().min(1)).optional(),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// ─── Filtros ────────────────────────────────────────────────────────

export const productFiltersSchema = z.object({
  category: productCategoryEnum.optional(),
  frameShape: frameShapeEnum.optional(),
  frameMaterial: frameMaterialEnum.optional(),
  lensType: lensTypeEnum.optional(),
  color: z.string().optional(),
  minPrice: z.number().int().min(0).optional(),
  maxPrice: z.number().int().positive().optional(),
  inStock: z.boolean().optional(),
  isOnSale: z.boolean().optional(),
  isOutlet: z.boolean().optional(),
  isNew: z.boolean().optional(),
  featured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().optional(),
});
