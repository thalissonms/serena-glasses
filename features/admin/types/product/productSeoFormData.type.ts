import z from "zod";
import { productSeoSchema } from "../../schemas/product/form/productSeoForm.schema";

export type ProductSeoFormData = z.infer<typeof productSeoSchema>;
