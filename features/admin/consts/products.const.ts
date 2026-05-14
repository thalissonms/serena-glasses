/** Status do pedido que reserva estoque (qualquer um EXCETO cancelled). */
export const STOCK_RESERVING_STATUSES = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
] as const;

/** Limite para considerar estoque baixo (warning visual). */
export const LOW_STOCK_THRESHOLD = 3;
