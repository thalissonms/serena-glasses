import { z } from "zod";

const datetimeOptional = z.preprocess((v) => {
  if (v === "" || v === null || v === undefined) return undefined;
  if (typeof v === "string") {
    const d = new Date(v);
    if (isNaN(d.getTime())) return v;
    return d.toISOString();
  }
  return v;
}, z.string().datetime().optional());

const baseSchema = z.object({
  display_order: z.number().int().nonnegative().default(0),
  active: z.boolean().default(true),
  starts_at: datetimeOptional,
  ends_at: datetimeOptional,
});

const productStorySchema = baseSchema.extend({
  kind: z.literal("product"),
  product_code: z.string().min(1).max(40),
});

const manualStorySchema = baseSchema.extend({
  kind: z.literal("manual"),
  media_type: z.enum(["image", "video"]),
  media_url: z.string().url(),
  cta_url: z.string().url().nullable().optional(),
  cta_label_pt: z.string().max(40).optional(),
  cta_label_en: z.string().max(40).optional(),
  cta_label_es: z.string().max(40).optional(),
  title_pt: z.string().max(80).optional(),
  title_en: z.string().max(80).optional(),
  title_es: z.string().max(80).optional(),
  subtitle_pt: z.string().max(120).optional(),
  subtitle_en: z.string().max(120).optional(),
  subtitle_es: z.string().max(120).optional(),
  avatar_label: z.string().max(4).default("NEW"),
});

export const homeStoryCreateSchema = z.discriminatedUnion("kind", [
  productStorySchema,
  manualStorySchema,
]);

export const homeStoryPatchSchema = z.object({
  active: z.boolean().optional(),
  display_order: z.number().int().nonnegative().optional(),
  starts_at: datetimeOptional,
  ends_at: datetimeOptional,
  cta_url: z.string().url().nullable().optional(),
  cta_label_pt: z.string().max(40).optional(),
  title_pt: z.string().max(80).optional(),
  subtitle_pt: z.string().max(120).optional(),
  avatar_label: z.string().max(4).optional(),
  media_url: z.string().url().optional(),
});

export const homeStoryReorderSchema = z.object({
  ids: z.array(z.string().uuid()).min(1),
});

export type HomeStoryCreateInput = z.infer<typeof homeStoryCreateSchema>;
export type HomeStoryPatchInput = z.infer<typeof homeStoryPatchSchema>;
