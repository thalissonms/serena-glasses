import z from "zod";
import { productCreateSchema } from "../../schemas/product/payload/productCreate.schema";

export type ProductCreateInput = z.infer<typeof productCreateSchema>;