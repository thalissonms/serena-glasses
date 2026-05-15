export interface InstallmentsBulkConfig {
  enabled: boolean;
  threshold_cents: number;
  installments: number;
}

export interface InstallmentsItem {
  price: number;
  quantity: number;
  maxInstallments: number;
}

const HARD_CAP = 12;

export function computeEffectiveInstallments(
  items: InstallmentsItem[],
  bulk: InstallmentsBulkConfig | null,
): number {
  if (items.length === 0) return 1;

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const maxItem = items.reduce((m, i) => Math.max(m, i.maxInstallments), 1);

  const maxBulk =
    bulk?.enabled && subtotal >= bulk.threshold_cents ? bulk.installments : 1;

  return Math.min(HARD_CAP, Math.max(maxItem, maxBulk));
}
