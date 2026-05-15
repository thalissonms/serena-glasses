import { describe, it, expect } from "vitest";
import {
  freeShippingSchema,
  maintenanceSchema,
  installmentsBulkSchema,
} from "../schemas/siteSettings.schema";

describe("installmentsBulkSchema", () => {
  const valid = { enabled: true, threshold_cents: 10000, installments: 3 };

  it("aceita configuracao valida", () => {
    expect(installmentsBulkSchema.safeParse(valid).success).toBe(true);
    expect(installmentsBulkSchema.safeParse({ ...valid, enabled: false }).success).toBe(true);
  });

  it("aceita parcelas nos limites (1 e 12)", () => {
    expect(installmentsBulkSchema.safeParse({ ...valid, installments: 1 }).success).toBe(true);
    expect(installmentsBulkSchema.safeParse({ ...valid, installments: 12 }).success).toBe(true);
  });

  it("rejeita parcelas fora do intervalo 1-12", () => {
    expect(installmentsBulkSchema.safeParse({ ...valid, installments: 0 }).success).toBe(false);
    expect(installmentsBulkSchema.safeParse({ ...valid, installments: 13 }).success).toBe(false);
    expect(installmentsBulkSchema.safeParse({ ...valid, installments: -1 }).success).toBe(false);
  });

  it("rejeita parcelas fracionadas", () => {
    expect(installmentsBulkSchema.safeParse({ ...valid, installments: 1.5 }).success).toBe(false);
  });

  it("rejeita threshold negativo", () => {
    expect(installmentsBulkSchema.safeParse({ ...valid, threshold_cents: -1 }).success).toBe(false);
  });

  it("aceita threshold zero (sem minimo)", () => {
    expect(installmentsBulkSchema.safeParse({ ...valid, threshold_cents: 0 }).success).toBe(true);
  });

  it("rejeita campos ausentes", () => {
    expect(installmentsBulkSchema.safeParse({ enabled: true, threshold_cents: 100 }).success).toBe(false);
    expect(installmentsBulkSchema.safeParse({ enabled: true, installments: 3 }).success).toBe(false);
  });
});

describe("freeShippingSchema", () => {
  const valid = { enabled: false, threshold_cents: 20000, label_pt: "Frete gratis acima de R$ 200" };

  it("aceita configuracao valida", () => {
    expect(freeShippingSchema.safeParse(valid).success).toBe(true);
  });

  it("aceita com labels opcionais", () => {
    expect(freeShippingSchema.safeParse({ ...valid, label_en: "Free shipping", label_es: "Envio gratis" }).success).toBe(true);
  });

  it("rejeita threshold negativo", () => {
    expect(freeShippingSchema.safeParse({ ...valid, threshold_cents: -1 }).success).toBe(false);
  });

  it("rejeita label_pt acima de 80 chars", () => {
    expect(freeShippingSchema.safeParse({ ...valid, label_pt: "a".repeat(81) }).success).toBe(false);
  });

  it("rejeita campo enabled ausente", () => {
    const { enabled: _e, ...rest } = valid;
    expect(freeShippingSchema.safeParse(rest).success).toBe(false);
  });
});

describe("maintenanceSchema", () => {
  const valid = { enabled: false, message_pt: "Voltamos em breve", expected_return: null };

  it("aceita configuracao valida", () => {
    expect(maintenanceSchema.safeParse(valid).success).toBe(true);
  });

  it("aceita expected_return como ISO 8601", () => {
    expect(maintenanceSchema.safeParse({ ...valid, expected_return: "2026-01-01T00:00:00Z" }).success).toBe(true);
  });

  it("rejeita expected_return como data simples (sem hora)", () => {
    expect(maintenanceSchema.safeParse({ ...valid, expected_return: "2026-01-01" }).success).toBe(false);
  });

  it("rejeita message_pt acima de 200 chars", () => {
    expect(maintenanceSchema.safeParse({ ...valid, message_pt: "a".repeat(201) }).success).toBe(false);
  });

  it("rejeita campo enabled ausente", () => {
    const { enabled: _e, ...rest } = valid;
    expect(maintenanceSchema.safeParse(rest).success).toBe(false);
  });
});
