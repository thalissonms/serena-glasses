import { z } from "zod";
import { productCreateFormSchema } from "../../schemas/product/form/productCreateForm.schema";

export type ProductCreateFormData = z.infer<typeof productCreateFormSchema>;
