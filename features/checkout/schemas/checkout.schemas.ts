import { z } from "zod";
import { PaymentMethod } from "../enums/checkout.enum";
import { BrazilianState } from "@shared/location/location.enum";
import { isValidCPF, isValidBRPhone, isValidBirthDate } from "@shared/utils/validators";

export function buildCheckoutSchema(t: (key: string) => string) {
  const identification = z.object({
    fullName: z.string().min(2, t("checkout:validation.fullNameMin")),
    cpf: z
      .string()
      .length(14, t("checkout:validation.cpfInvalid"))
      .refine((v) => isValidCPF(v), t("checkout:validation.cpfInvalid")),
    birthDate: z
      .string()
      .min(1, t("checkout:validation.birthDateRequired"))
      .refine((v) => isValidBirthDate(v), t("checkout:validation.birthDateRequired")),
    email: z.string().email(t("checkout:validation.emailInvalid")),
    phone: z
      .string()
      .min(8, t("checkout:validation.phoneInvalid"))
      .refine((v) => isValidBRPhone(v), t("checkout:validation.phoneInvalid")),
  });

  const address = z.object({
    cep: z.string().length(9, t("checkout:validation.cepInvalid")),
    street: z.string().min(2, t("checkout:validation.streetRequired")),
    number: z.string().min(1, t("checkout:validation.numberRequired")),
    complement: z.string().optional(),
    neighborhood: z.string().min(2, t("checkout:validation.neighborhoodRequired")),
    city: z.string().min(2, t("checkout:validation.cityRequired")),
    state: z.enum(Object.values(BrazilianState) as [BrazilianState, ...BrazilianState[]], {
      message: t("checkout:validation.stateRequired"),
    }),
  });

  const payment = z
    .object({
      method: z.enum([PaymentMethod.Card, PaymentMethod.PIX, PaymentMethod.Boleto]),
      cardNumber: z.string().optional(),
      cardName: z.string().optional(),
      cardExpiry: z.string().optional(),
      cardCvv: z.string().optional(),
      installments: z.string().optional(),
    })
    .superRefine((d, ctx) => {
      if (d.method !== PaymentMethod.Card) return;
      const num = (d.cardNumber ?? "").replace(/\s/g, "");
      if (num.length < 13)
        ctx.addIssue({ code: "custom", path: ["cardNumber"], message: "Número do cartão inválido" });
      if (!(d.cardName ?? "").trim())
        ctx.addIssue({ code: "custom", path: ["cardName"], message: "Nome no cartão obrigatório" });
      if (!/^\d{2}\/\d{2}$/.test(d.cardExpiry ?? ""))
        ctx.addIssue({ code: "custom", path: ["cardExpiry"], message: "Validade inválida (MM/AA)" });
      const cvv = d.cardCvv ?? "";
      if (cvv.length < 3)
        ctx.addIssue({ code: "custom", path: ["cardCvv"], message: "CVV inválido" });
    });

  return z.object({ identification, address, payment });
}

// Static instance used only for type inference — never for validation
const _schemaShape = buildCheckoutSchema(() => "");
export type CheckoutSchemaType = typeof _schemaShape;
