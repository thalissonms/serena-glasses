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

const linkUrlOptional = z.preprocess((v) => {
  if (v === "" || v === null || v === undefined) return undefined;
  return v;
}, z.string().url().optional());

const optionalText = (max: number) =>
  z.preprocess((v) => (v === "" || v === null || v === undefined ? undefined : v), z.string().max(max).optional());

export const siteBannerCreateSchema = z.object({
  message_pt: z.string().min(1).max(200),
  message_en: optionalText(200),
  message_es: optionalText(200),
  link_url: linkUrlOptional,
  bg_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#FF00B6"),
  text_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#FFFFFF"),
  starts_at: datetimeOptional,
  ends_at: datetimeOptional,
  active: z.boolean().default(true),
  dismissible: z.boolean().default(true),
  display_order: z.number().int().nonnegative().default(0),
});

export const siteBannerPatchSchema = siteBannerCreateSchema.partial();

export type SiteBannerCreateInput = z.infer<typeof siteBannerCreateSchema>;
export type SiteBannerPatchInput = z.infer<typeof siteBannerPatchSchema>;
