/**
 * Service: paymentRetry — classifica erros do Mercado Pago e gera mensagens de retry.
 *
 * Código puro, sem side-effects. Separa erros em data_error (pode tentar de novo)
 * ou definitive_rejection (cancela imediatamente). Desconhecidos → data_error (conservador).
 *
 * Usado em: src/app/api/checkout/route.ts.
 */

export const MAX_ATTEMPTS = 4;

export type PaymentErrorKind = "data_error" | "definitive_rejection";

export const DATA_ERROR_CODES = new Set<string>([
  "cc_rejected_bad_filled_card_number",
  "cc_rejected_bad_filled_date",
  "cc_rejected_bad_filled_security_code",
  "cc_rejected_bad_filled_other",
  "cc_rejected_other_reason",
  "cc_rejected_invalid_installments",
]);

export const DEFINITIVE_REJECTION_CODES = new Set<string>([
  "cc_rejected_high_risk",
  "cc_rejected_blacklist",
  "cc_rejected_max_attempts",
  "cc_rejected_card_disabled",
  "cc_rejected_insufficient_amount",
  "cc_rejected_call_for_authorize",
  "cc_rejected_duplicated_payment",
]);

export function classifyMpError(statusDetail: string): PaymentErrorKind {
  if (DEFINITIVE_REJECTION_CODES.has(statusDetail)) return "definitive_rejection";
  return "data_error";
}

export function userMessageFor(kind: PaymentErrorKind, attempt: number): string {
  if (kind === "definitive_rejection") {
    return "Pagamento recusado pelo banco. Tente outro cartão.";
  }
  return `Tentativa ${attempt} de ${MAX_ATTEMPTS}. Verifique os dados do cartão.`;
}
