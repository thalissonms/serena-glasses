/**
 * Formata preço de centavos para moeda brasileira.
 * @param cents Preço em centavos (ex: 24900)
 * @returns String formatada (ex: "R$ 249,00")
 */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

/**
 * Calcula a porcentagem de desconto.
 * @returns Inteiro arredondado (ex: 42 para 42% off)
 */
export function discountPercentage(price: number, compareAtPrice: number): number {
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}
