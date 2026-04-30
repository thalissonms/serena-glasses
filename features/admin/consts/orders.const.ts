export const ORDER_STATUSES = ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "payment_failed", "refunded"] as const;
export type OrderStatus = typeof ORDER_STATUSES[number];

export const STATUS_LABEL: Record<string, string> = {
  pending: "Aguardando",
  paid: "Pago",
  processing: "Processando",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
  payment_failed: "Falha no pagamento",
  refunded: "Reembolsado",
};

export const STATUS_COLOR: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  paid: "bg-green-500/20 text-green-300 border-green-500/40",
  processing: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  shipped: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  delivered: "bg-green-500/20 text-green-300 border-green-500/40",
  cancelled: "bg-red-500/20 text-red-300 border-red-500/40",
};

export const PAYMENT_LABEL: Record<string, string> = {
  card: "Cartão",
  pix: "PIX",
  boleto: "Boleto",
};
