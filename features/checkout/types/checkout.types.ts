import type { z } from "zod";
import type { buildCheckoutSchema } from "../schemas/checkout.schemas";

type InferredSchema = ReturnType<typeof buildCheckoutSchema>;

export type CheckoutFormData = z.infer<InferredSchema>;
export type IdentificationData = CheckoutFormData["identification"];
export type AddressData = CheckoutFormData["address"];
export type PaymentData = CheckoutFormData["payment"];

export type CheckoutPhase =
  | { status: "form" }
  | { status: "pix"; orderNumber: string; orderId: string; qrCodeBase64: string; pixCopyPaste: string; totalBRL: string }
  | { status: "boleto"; orderNumber: string; orderId: string; boletoUrl: string; barcode: string; totalBRL: string };
