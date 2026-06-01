import z from "zod";
import { variantAddSchema } from "../../schemas/product/form/productVariantAddForm.schema";

export type VariantAddData = z.infer<typeof variantAddSchema>;