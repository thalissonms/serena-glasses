import MercadoPagoConfig, { Payment, PaymentRefund } from "mercadopago";

if (!process.env.MP_ACCESS_TOKEN) {
  throw new Error("MP_ACCESS_TOKEN environment variable is required");
}

const token = process.env.MP_ACCESS_TOKEN;

const mpConfig = new MercadoPagoConfig({
  accessToken: token,
  options: { timeout: 5000 },
});

export const mpPayment = new Payment(mpConfig);
export const mpRefund = new PaymentRefund(mpConfig);
