import z from "zod";
import { hrefSchema, labelEnum, navPagesSchema } from "../schemas/navPages.schema";

export type navPagesHrefType = z.infer<typeof hrefSchema>;
export type navPagesLabelType = z.infer<typeof labelEnum>;
export type navPagesType = z.infer<typeof navPagesSchema>;

export {}; // garante que o arquivo é tratado como módulo
