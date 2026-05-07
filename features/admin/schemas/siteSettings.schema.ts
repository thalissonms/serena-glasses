import { z } from "zod";

export const freeShippingSchema = z.object({
  enabled: z.boolean(),
  threshold_cents: z.number().int().nonnegative(),
  label_pt: z.string().max(80),
  label_en: z.string().max(80).optional(),
  label_es: z.string().max(80).optional(),
});

export const maintenanceSchema = z.object({
  enabled: z.boolean(),
  message_pt: z.string().max(200),
  message_en: z.string().max(200).optional(),
  message_es: z.string().max(200).optional(),
  expected_return: z.string().datetime().nullable(),
});

export const pixelsSchema = z.object({
  meta_pixel_id: z.string().regex(/^\d+$/).nullable(),
  ga4_id: z.string().regex(/^G-[A-Z0-9]+$/).nullable(),
  tiktok_pixel_id: z.string().nullable(),
});

export const whatsappSchema = z.object({
  enabled: z.boolean(),
  phone: z.string().regex(/^\d{10,15}$/),
  message_pt: z.string().max(200),
  position: z.enum(["bottom-right", "bottom-left"]).default("bottom-right"),
});

export const popupCaptureSchema = z.object({
  enabled: z.boolean(),
  title_pt: z.string().max(60),
  description_pt: z.string().max(200),
  primary_label_pt: z.string().max(30),
  secondary_label_pt: z.string().max(30).optional(),
  trigger: z.enum(["exit_intent", "delay", "scroll", "manual"]),
  delay_ms: z.number().int().nonnegative().default(5000),
  coupon_code: z.string().max(40).nullable(),
  show_once_per_days: z.number().int().min(1).default(7),
});

export const SETTING_SCHEMAS = {
  free_shipping: freeShippingSchema,
  maintenance: maintenanceSchema,
  pixels: pixelsSchema,
  whatsapp: whatsappSchema,
  popup_capture: popupCaptureSchema,
} as const;

export type SettingKey = keyof typeof SETTING_SCHEMAS;
export type SettingValue<K extends SettingKey> = z.infer<(typeof SETTING_SCHEMAS)[K]>;
