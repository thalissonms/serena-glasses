export function parsePrice(v: string): number {
  return Math.round(parseFloat(v.replace(",", ".")) * 100);
}
