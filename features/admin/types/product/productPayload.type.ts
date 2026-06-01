import z from "zod";
import { productPatchSchema } from "../../schemas/product/payload/productEdit.schema";

export type ProductPayloadType = z.infer<typeof productPatchSchema >;