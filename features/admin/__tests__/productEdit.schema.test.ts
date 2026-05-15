import { describe, it, expect } from "vitest";
import { productPatchSchema } from "../schemas/productEdit.schema";

describe("productPatchSchema — max_installments", () => {
  it("aceita max_installments nos limites (1 e 12)", () => {
    expect(productPatchSchema.safeParse({ max_installments: 1 }).success).toBe(true);
    expect(productPatchSchema.safeParse({ max_installments: 12 }).success).toBe(true);
    expect(productPatchSchema.safeParse({ max_installments: 6 }).success).toBe(true);
  });

  it("rejeita max_installments fora de 1–12", () => {
    expect(productPatchSchema.safeParse({ max_installments: 0 }).success).toBe(false);
    expect(productPatchSchema.safeParse({ max_installments: 13 }).success).toBe(false);
    expect(productPatchSchema.safeParse({ max_installments: -1 }).success).toBe(false);
  });

  it("rejeita max_installments fracionado", () => {
    expect(productPatchSchema.safeParse({ max_installments: 1.5 }).success).toBe(false);
  });

  it("aceita patch sem max_installments (campo opcional)", () => {
    expect(productPatchSchema.safeParse({ name: "Óculos Rosa" }).success).toBe(true);
    expect(productPatchSchema.safeParse({}).success).toBe(true);
  });
});

describe("productPatchSchema — preço", () => {
  it("aceita price e compare_at_price válidos", () => {
    expect(productPatchSchema.safeParse({ price: 19900 }).success).toBe(true);
    expect(productPatchSchema.safeParse({ price: 19900, compare_at_price: 29900 }).success).toBe(true);
  });

  it("rejeita price negativo", () => {
    expect(productPatchSchema.safeParse({ price: -100 }).success).toBe(false);
  });

  it("aceita compare_at_price null (remover preço riscado)", () => {
    expect(productPatchSchema.safeParse({ compare_at_price: null }).success).toBe(true);
  });
});

describe("productPatchSchema — slug", () => {
  it("aceita slug válido", () => {
    expect(productPatchSchema.safeParse({ slug: "oculos-rosa-neon" }).success).toBe(true);
    expect(productPatchSchema.safeParse({ slug: "produto-123" }).success).toBe(true);
  });

  it("rejeita slug com maiúsculas ou espaços", () => {
    expect(productPatchSchema.safeParse({ slug: "Oculos-Rosa" }).success).toBe(false);
    expect(productPatchSchema.safeParse({ slug: "oculos rosa" }).success).toBe(false);
    expect(productPatchSchema.safeParse({ slug: "oculos_rosa" }).success).toBe(false);
  });
});
