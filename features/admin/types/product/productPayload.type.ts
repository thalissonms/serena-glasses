import z from "zod";
import { productPatchSchema } from "../../schemas/zodSchemas/productEdit.schema";

export type ProductPayloadType = z.infer<typeof productPatchSchema >;