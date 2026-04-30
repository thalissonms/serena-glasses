import { describe, it, expect } from "vitest";
import {
  productCategoryEnum,
  frameShapeEnum,
  frameMaterialEnum,
  lensTypeEnum,
  productStatusEnum,
  productColorSchema,
  productImageSchema,
  productVariantSchema,
  productRatingSchema,
  productSeoSchema,
  productSchema,
  productFiltersSchema,
} from "../schemas/product.schema";
import { MOCK_PRODUCTS } from "../mock/products.mock";

// ─── Enums ──────────────────────────────────────────────────────────

describe("Product Enums", () => {
  it("productCategoryEnum aceita categorias válidas", () => {
    expect(productCategoryEnum.safeParse("sunglasses").success).toBe(true);
    expect(productCategoryEnum.safeParse("accessories").success).toBe(true);
    expect(productCategoryEnum.safeParse("miniDrop").success).toBe(true);
  });

  it("productCategoryEnum rejeita categorias inválidas", () => {
    expect(productCategoryEnum.safeParse("invalid").success).toBe(false);
    expect(productCategoryEnum.safeParse("").success).toBe(false);
  });

  it("frameShapeEnum aceita todos os formatos", () => {
    const shapes = ["round", "square", "cat-eye", "aviator", "rectangle", "oversized", "geometric", "butterfly"];
    shapes.forEach((s) => expect(frameShapeEnum.safeParse(s).success).toBe(true));
  });

  it("frameMaterialEnum aceita todos os materiais", () => {
    const materials = ["acetate", "metal", "mixed", "plastic", "titanium"];
    materials.forEach((m) => expect(frameMaterialEnum.safeParse(m).success).toBe(true));
  });

  it("lensTypeEnum aceita todos os tipos de lente", () => {
    const lenses = ["polarized", "gradient", "mirrored", "solid", "photochromic"];
    lenses.forEach((l) => expect(lensTypeEnum.safeParse(l).success).toBe(true));
  });

  it("productStatusEnum aceita status válidos", () => {
    const statuses = ["active", "draft", "archived"];
    statuses.forEach((s) => expect(productStatusEnum.safeParse(s).success).toBe(true));
  });
});

// ─── Subdocumentos ──────────────────────────────────────────────────

describe("ProductColor Schema", () => {
  it("aceita cor válida", () => {
    const result = productColorSchema.safeParse({ name: "Rosa Neon", hex: "#FF00B6", slug: "rosa-neon" });
    expect(result.success).toBe(true);
  });

  it("rejeita hex inválido", () => {
    expect(productColorSchema.safeParse({ name: "Rosa", hex: "FF00B6", slug: "rosa" }).success).toBe(false);
    expect(productColorSchema.safeParse({ name: "Rosa", hex: "#GG00B6", slug: "rosa" }).success).toBe(false);
    expect(productColorSchema.safeParse({ name: "Rosa", hex: "#FF00B", slug: "rosa" }).success).toBe(false);
  });

  it("rejeita slug com maiúsculas ou espaços", () => {
    expect(productColorSchema.safeParse({ name: "Rosa", hex: "#FF00B6", slug: "Rosa-Neon" }).success).toBe(false);
    expect(productColorSchema.safeParse({ name: "Rosa", hex: "#FF00B6", slug: "rosa neon" }).success).toBe(false);
  });
});

describe("ProductImage Schema", () => {
  it("aceita imagem válida", () => {
    const result = productImageSchema.safeParse({ url: "/products/1.png", alt: "Produto", isPrimary: true, order: 0 });
    expect(result.success).toBe(true);
  });

  it("rejeita order negativo", () => {
    expect(productImageSchema.safeParse({ url: "/img.png", alt: "Alt", isPrimary: false, order: -1 }).success).toBe(false);
  });

  it("rejeita campos vazios", () => {
    expect(productImageSchema.safeParse({ url: "", alt: "Alt", isPrimary: false, order: 0 }).success).toBe(false);
    expect(productImageSchema.safeParse({ url: "/img.png", alt: "", isPrimary: false, order: 0 }).success).toBe(false);
  });
});

describe("ProductVariant Schema", () => {
  it("aceita variante válida", () => {
    const variant = {
      id: "var_001",
      sku: "SRN-TEST-001",
      color: { name: "Preto", hex: "#000000", slug: "preto" },
      inStock: true,
      stockQuantity: 10,
      images: ["/products/1.png"],
    };
    expect(productVariantSchema.safeParse(variant).success).toBe(true);
  });

  it("aceita variante com preço override", () => {
    const variant = {
      id: "var_002",
      sku: "SRN-TEST-002",
      color: { name: "Preto", hex: "#000000", slug: "preto" },
      price: 19900,
      compareAtPrice: 29900,
      inStock: true,
      stockQuantity: 5,
      images: [],
    };
    expect(productVariantSchema.safeParse(variant).success).toBe(true);
  });

  it("rejeita preço negativo", () => {
    const variant = {
      id: "var_003",
      sku: "SRN-TEST-003",
      color: { name: "Preto", hex: "#000000", slug: "preto" },
      price: -100,
      inStock: true,
      stockQuantity: 5,
      images: [],
    };
    expect(productVariantSchema.safeParse(variant).success).toBe(false);
  });

  it("rejeita stockQuantity negativo", () => {
    const variant = {
      id: "var_004",
      sku: "SRN-TEST-004",
      color: { name: "Preto", hex: "#000000", slug: "preto" },
      inStock: false,
      stockQuantity: -1,
      images: [],
    };
    expect(productVariantSchema.safeParse(variant).success).toBe(false);
  });
});

describe("ProductRating Schema", () => {
  it("aceita rating válido", () => {
    expect(productRatingSchema.safeParse({ average: 4.5, count: 10 }).success).toBe(true);
    expect(productRatingSchema.safeParse({ average: 0, count: 0 }).success).toBe(true);
    expect(productRatingSchema.safeParse({ average: 5, count: 100 }).success).toBe(true);
  });

  it("rejeita average fora de 0-5", () => {
    expect(productRatingSchema.safeParse({ average: -1, count: 0 }).success).toBe(false);
    expect(productRatingSchema.safeParse({ average: 5.1, count: 0 }).success).toBe(false);
  });

  it("rejeita count negativo", () => {
    expect(productRatingSchema.safeParse({ average: 4, count: -1 }).success).toBe(false);
  });
});

describe("ProductSeo Schema", () => {
  it("aceita SEO válido", () => {
    const seo = { title: "Título", description: "Descrição", keywords: ["óculos", "serena"] };
    expect(productSeoSchema.safeParse(seo).success).toBe(true);
  });

  it("rejeita campos vazios", () => {
    expect(productSeoSchema.safeParse({ title: "", description: "Desc", keywords: [] }).success).toBe(false);
    expect(productSeoSchema.safeParse({ title: "T", description: "", keywords: [] }).success).toBe(false);
  });
});

// ─── Documento Principal ────────────────────────────────────────────

describe("Product Schema", () => {
  it("aceita produto mínimo válido", () => {
    const product = {
      id: "prod_test",
      slug: "test-product",
      name: "Test Product",
      description: "Descrição do test product",
      shortDescription: "Test product",
      price: 9900,
      currency: "BRL" as const,
      category: "sunglasses" as const,
      frameShape: "round" as const,
      frameMaterial: "metal" as const,
      lensType: "solid" as const,
      tags: ["test"],
      images: [{ url: "/img.png", alt: "Test", isPrimary: true, order: 0 }],
      variants: [],
      rating: { average: 0, count: 0 },
      seo: { title: "Test", description: "Test desc", keywords: ["test"] },
      inStock: true,
      stockQuantity: 1,
      status: "draft" as const,
      featured: false,
      isNew: false,
      isOnSale: false,
      isOutlet: false,
      uvProtection: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    expect(productSchema.safeParse(product).success).toBe(true);
  });

  it("rejeita produto sem imagens", () => {
    const product = {
      id: "prod_no_img",
      slug: "no-img",
      name: "No Image",
      description: "Sem imagem",
      shortDescription: "Sem img",
      price: 9900,
      currency: "BRL",
      category: "sunglasses",
      frameShape: "round",
      frameMaterial: "metal",
      lensType: "solid",
      tags: [],
      images: [],
      variants: [],
      rating: { average: 0, count: 0 },
      seo: { title: "T", description: "D", keywords: ["t"] },
      inStock: false,
      stockQuantity: 0,
      status: "draft",
      featured: false,
      isNew: false,
      isOnSale: false,
      isOutlet: false,
      uvProtection: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    expect(productSchema.safeParse(product).success).toBe(false);
  });

  it("rejeita preço zero ou negativo", () => {
    const base = {
      id: "prod_price",
      slug: "bad-price",
      name: "Bad Price",
      description: "Preço inválido",
      shortDescription: "Bad",
      currency: "BRL",
      category: "sunglasses",
      frameShape: "round",
      frameMaterial: "metal",
      lensType: "solid",
      tags: [],
      images: [{ url: "/img.png", alt: "T", isPrimary: true, order: 0 }],
      variants: [],
      rating: { average: 0, count: 0 },
      seo: { title: "T", description: "D", keywords: ["t"] },
      inStock: false,
      stockQuantity: 0,
      status: "draft",
      featured: false,
      isNew: false,
      isOnSale: false,
      isOutlet: false,
      uvProtection: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(productSchema.safeParse({ ...base, price: 0 }).success).toBe(false);
    expect(productSchema.safeParse({ ...base, price: -100 }).success).toBe(false);
  });

  it("rejeita slug com caracteres inválidos", () => {
    const base = {
      id: "prod_slug",
      slug: "Invalid Slug!",
      name: "Bad Slug",
      description: "Slug inválido",
      shortDescription: "Bad",
      price: 9900,
      currency: "BRL",
      category: "sunglasses",
      frameShape: "round",
      frameMaterial: "metal",
      lensType: "solid",
      tags: [],
      images: [{ url: "/img.png", alt: "T", isPrimary: true, order: 0 }],
      variants: [],
      rating: { average: 0, count: 0 },
      seo: { title: "T", description: "D", keywords: ["t"] },
      inStock: false,
      stockQuantity: 0,
      status: "draft",
      featured: false,
      isNew: false,
      isOnSale: false,
      isOutlet: false,
      uvProtection: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    expect(productSchema.safeParse(base).success).toBe(false);
  });
});

// ─── Mock Data Validation ───────────────────────────────────────────

describe("MOCK_PRODUCTS", () => {
  it("tem pelo menos 6 produtos", () => {
    expect(MOCK_PRODUCTS.length).toBeGreaterThanOrEqual(6);
  });

  it("todos os produtos passam na validação do schema", () => {
    MOCK_PRODUCTS.forEach((product) => {
      const result = productSchema.safeParse(product);
      if (!result.success) {
        console.error(`Produto ${product.slug} falhou:`, result.error.issues);
      }
      expect(result.success).toBe(true);
    });
  });

  it("todos os slugs são únicos", () => {
    const slugs = MOCK_PRODUCTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("todos os IDs são únicos", () => {
    const ids = MOCK_PRODUCTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("todos os SKUs de variantes são únicos globalmente", () => {
    const skus = MOCK_PRODUCTS.flatMap((p) => p.variants.map((v) => v.sku));
    expect(new Set(skus).size).toBe(skus.length);
  });

  it("tem pelo menos 1 produto featured", () => {
    expect(MOCK_PRODUCTS.some((p) => p.featured)).toBe(true);
  });

  it("tem pelo menos 1 produto outlet", () => {
    expect(MOCK_PRODUCTS.some((p) => p.isOutlet)).toBe(true);
  });

  it("tem pelo menos 1 produto em promoção", () => {
    expect(MOCK_PRODUCTS.some((p) => p.isOnSale)).toBe(true);
  });

  it("tem pelo menos 1 produto miniDrop", () => {
    expect(MOCK_PRODUCTS.some((p) => p.category === "miniDrop")).toBe(true);
  });

  it("produto outlet tem outletReason", () => {
    MOCK_PRODUCTS.filter((p) => p.isOutlet).forEach((p) => {
      expect(p.outletReason).toBeTruthy();
    });
  });

  it("produto em promoção tem compareAtPrice maior que price", () => {
    MOCK_PRODUCTS.filter((p) => p.isOnSale && p.compareAtPrice).forEach((p) => {
      expect(p.compareAtPrice!).toBeGreaterThan(p.price);
    });
  });

  it("cada produto tem pelo menos 1 imagem primária", () => {
    MOCK_PRODUCTS.forEach((p) => {
      expect(p.images.some((img) => img.isPrimary)).toBe(true);
    });
  });

  it("todos os produtos têm uvProtection true", () => {
    MOCK_PRODUCTS.forEach((p) => {
      expect(p.uvProtection).toBe(true);
    });
  });
});

// ─── Filtros ────────────────────────────────────────────────────────

describe("ProductFilters Schema", () => {
  it("aceita filtros vazios", () => {
    expect(productFiltersSchema.safeParse({}).success).toBe(true);
  });

  it("aceita filtro por categoria", () => {
    expect(productFiltersSchema.safeParse({ category: "sunglasses" }).success).toBe(true);
  });

  it("aceita filtros combinados", () => {
    const filters = {
      category: "sunglasses",
      frameShape: "cat-eye",
      minPrice: 10000,
      maxPrice: 50000,
      inStock: true,
      isOnSale: false,
    };
    expect(productFiltersSchema.safeParse(filters).success).toBe(true);
  });

  it("rejeita categoria inválida", () => {
    expect(productFiltersSchema.safeParse({ category: "invalid" }).success).toBe(false);
  });

  it("rejeita minPrice negativo", () => {
    expect(productFiltersSchema.safeParse({ minPrice: -100 }).success).toBe(false);
  });

  it("aceita busca textual", () => {
    expect(productFiltersSchema.safeParse({ search: "cat eye rosa" }).success).toBe(true);
  });
});
