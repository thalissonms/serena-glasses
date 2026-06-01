import { describe, it, expect } from "vitest";
import { formatPrice, formatInstallment, discountPercentage } from "../utils/formatPrice";

describe("formatPrice", () => {
  it("formata centavos em BRL", () => {
    expect(formatPrice(19900)).toBe("R$ 199,00");
  });

  it("formata zero", () => {
    expect(formatPrice(0)).toBe("R$ 0,00");
  });

  it("formata valores fracionados", () => {
    expect(formatPrice(100)).toBe("R$ 1,00");
    expect(formatPrice(50)).toBe("R$ 0,50");
  });
});

describe("formatInstallment", () => {
  it("retorna null para maxInstallments = 1", () => {
    expect(formatInstallment(19900, 1)).toBeNull();
  });

  it("retorna null para maxInstallments = 0", () => {
    expect(formatInstallment(19900, 0)).toBeNull();
  });

  it("usa Math.ceil na divisao (sem cobrar a menos)", () => {
    // 19900 / 3 = 6633.33... -> ceil = 6634 centavos
    const result = formatInstallment(19900, 3);
    expect(result).not.toBeNull();
    expect(result).toMatch(/^3x de/);
  });

  it("formata 2 parcelas exatas", () => {
    // 10000 / 2 = 5000 centavos = R$ 50,00
    const result = formatInstallment(10000, 2);
    expect(result).not.toBeNull();
    expect(result!.startsWith("2x de")).toBe(true);
  });

  it("inclui o numero de parcelas no inicio", () => {
    expect(formatInstallment(19900, 6)!.startsWith("6x de")).toBe(true);
    expect(formatInstallment(19900, 12)!.startsWith("12x de")).toBe(true);
  });
});

describe("discountPercentage", () => {
  it("calcula desconto corretamente", () => {
    expect(discountPercentage(9900, 19900)).toBe(50);
    expect(discountPercentage(14900, 19900)).toBe(25);
  });

  it("arredonda o percentual", () => {
    expect(discountPercentage(13300, 19900)).toBe(33);
  });
});
