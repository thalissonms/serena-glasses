import z from "zod";

export const hrefSchema = z.string().regex(/^(\/|https?:\/\/)/, {
  message: "href must start with / or http(s)://"
});

export const labelEnum = z.enum([
  "home",
  "sunGlasses",
  "miniDrop",
  "accessories",
  "outlet",
  "promotions",
  "about"
]);

export const navPageSchema = z.object({
  href: hrefSchema,
  label: labelEnum,
});

export const navPagesSchema = z.array(navPageSchema);
