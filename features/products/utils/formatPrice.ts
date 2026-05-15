const formatters = new Map<string, Intl.NumberFormat>();

/**
 * Formata preço de centavos para moeda brasileira.
 * @param cents Preço em centavos (ex: 24900)
 * @returns String formatada (ex: "R$ 249,00")
 */
export function formatPrice(cents: number, locale = "pt-BR", currency = "BRL"): string {
  const key = `${locale}:${currency}`;
  let fmt = formatters.get(key);
  if (!fmt) {
    fmt = new Intl.NumberFormat(locale, { style: "currency", currency });
    formatters.set(key, fmt);
  }
  return fmt.format(cents / 100);
}

/**
 * Formata parcelas. Retorna null se maxInstallments <= 1.
 * @example formatInstallment(19900, 3) => "3x de R$ 66,34"
 */
export function formatInstallment(cents: number, maxInstallments: number): string | null {
  if (maxInstallments <= 1) return null;
  return `${maxInstallments}x de ${formatPrice(Math.ceil(cents / maxInstallments))}`;
}

/**
 * Calcula a porcentagem de desconto.
 * @returns Inteiro arredondado (ex: 42 para 42% off)
 */
export function discountPercentage(price: number, compareAtPrice: number): number {
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}
