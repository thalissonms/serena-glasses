import z from "zod";
import { productDetailsFormSchema } from "../../schemas/product/form/productDetailsForm.schema.ts.js";

export type ProductDetailsFormData = z.infer<typeof productDetailsFormSchema >;