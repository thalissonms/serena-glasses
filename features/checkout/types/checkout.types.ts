import type { z } from "zod";
import type { buildCheckoutSchema } from "../schemas/checkout.schemas";

type InferredSchema = ReturnType<typeof buildCheckoutSchema>;

export type CheckoutFormData = z.infer<InferredSchema>;
export type IdentificationData = CheckoutFormData["identification"];
export type AddressData = CheckoutFormData["address"];
export type PaymentData = CheckoutFormData["payment"];
