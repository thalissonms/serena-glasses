import { describe, it, expect } from "vitest";
import {
  computeEffectiveInstallments,
  type InstallmentsBulkConfig,
  type InstallmentsItem,
} from "../effectiveInstallments";

const bulk12: InstallmentsBulkConfig = {
  enabled: true,
  threshold_cents: 50000,
  installments: 12,
};

const item = (price: number, qty: number, max: number): InstallmentsItem => ({
  price,
  quantity: qty,
  maxInstallments: max,
});

describe("computeEffectiveInstallments", () => {
  it("carrinho vazio retorna 1", () => {
    expect(computeEffectiveInstallments([], bulk12)).toBe(1);
  });

  it("1 item max 1, sem bulk → 1", () => {
    expect(computeEffectiveInstallments([item(20000, 1, 1)], null)).toBe(1);
  });

  it("1 item max 6, sem bulk → 6", () => {
    expect(computeEffectiveInstallments([item(20000, 1, 6)], null)).toBe(6);
  });

  it("2 itens (max 4 e max 2), subtotal abaixo do threshold → 4", () => {
    const items = [item(20000, 1, 4), item(10000, 1, 2)];
    expect(computeEffectiveInstallments(items, bulk12)).toBe(4);
  });

  it("2 itens (max 4 e max 2), subtotal acima do threshold → 12", () => {
    const items = [item(20000, 3, 4), item(10000, 1, 2)];
    expect(computeEffectiveInstallments(items, bulk12)).toBe(12);
  });

  it("bulk disabled ignora threshold mesmo se subtotal passar", () => {
    const disabledBulk: InstallmentsBulkConfig = { ...bulk12, enabled: false };
    const items = [item(20000, 3, 4), item(10000, 1, 2)];
    expect(computeEffectiveInstallments(items, disabledBulk)).toBe(4);
  });

  it("resultado nunca passa de 12 (hard cap)", () => {
    const bigBulk: InstallmentsBulkConfig = {
      enabled: true,
      threshold_cents: 100,
      installments: 99,
    };
    expect(computeEffectiveInstallments([item(200, 1, 1)], bigBulk)).toBe(12);
  });
});
