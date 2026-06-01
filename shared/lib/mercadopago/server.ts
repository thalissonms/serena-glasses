import MercadoPagoConfig, { Payment, PaymentRefund } from "mercadopago";

let _payment: Payment | null = null;
let _refund: PaymentRefund | null = null;

function getMpConfig(): MercadoPagoConfig {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) throw new Error("MP_ACCESS_TOKEN environment variable is required");
  return new MercadoPagoConfig({ accessToken: token, options: { timeout: 15000 } });
}

export function getMpPayment(): Payment {
  if (!_payment) _payment = new Payment(getMpConfig());
  return _payment;
}

export function getMpRefund(): PaymentRefund {
  if (!_refund) _refund = new PaymentRefund(getMpConfig());
  return _refund;
}
