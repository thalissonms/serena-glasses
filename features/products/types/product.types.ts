// ─── Enums / Literais ───────────────────────────────────────────────

export type ProductCategory =
  | "sunglasses"
  | "accessories"
  | "miniDrop";

export type FrameShape =
  | "round"
  | "square"
  | "cat-eye"
  | "aviator"
  | "rectangle"
  | "oversized"
  | "geometric"
  | "butterfly";

export type FrameMaterial =
  | "acetate"
  | "metal"
  | "mixed"
  | "plastic"
  | "titanium";

export type LensType =
  | "polarized"
  | "gradient"
  | "mirrored"
  | "solid"
  | "photochromic";

export type ProductStatus =
  | "active"
  | "draft"
  | "archived";

// ─── Subdocumentos ──────────────────────────────────────────────────

export interface ProductColor {
  name: string;    // "Rosa Neon"
  hex: string;     // "#FF00B6"
  slug: string;    // "rosa-neon"
}

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  color: ProductColor;
  price?: number;          // override do preço base (em centavos)
  compareAtPrice?: number; // preço riscado (em centavos)
  inStock: boolean;
  stockQuantity: number;
  images: string[];        // URLs específicas desta variante
}

export interface ProductRating {
  average: number;  // 0-5
  count: number;    // total de avaliações
}

export interface ProductSeo {
  title: string;
  description: string;
  keywords: string[];
}

// ─── Documento Principal ────────────────────────────────────────────

export interface Product {
  /** ID único do documento (gerado pelo banco) */
  id: string;

  /** Slug URL-friendly (único) */
  slug: string;

  /** Nome do produto */
  name: string;

  /** Descrição longa (pode conter markdown) */
  description: string;

  /** Descrição curta para cards/listagens */
  shortDescription: string;

  /** Preço base em centavos (BRL) — ex: 19900 = R$199,00 */
  price: number;

  /** Preço original riscado em centavos (quando em promoção) */
  compareAtPrice?: number;

  /** Moeda */
  currency: "BRL";

  // ── Classificação ──

  category: ProductCategory;
  frameShape: FrameShape;
  frameMaterial: FrameMaterial;
  lensType: LensType;
  tags: string[];

  // ── Subdocumentos embutidos (NoSQL) ──

  images: ProductImage[];
  variants: ProductVariant[];
  rating: ProductRating;
  seo: ProductSeo;

  // ── Estoque ──

  inStock: boolean;
  stockQuantity: number;

  // ── Flags ──

  status: ProductStatus;
  featured: boolean;
  isNew: boolean;
  isOnSale: boolean;
  isOutlet: boolean;
  outletReason?: string;  // "Pequeno arranhão na haste direita"

  // ── Detalhes ──

  uvProtection: boolean;
  weight?: number;           // em gramas
  dimensions?: string;       // "140mm x 50mm x 145mm"
  includedAccessories?: string[]; // ["Case de couro", "Flanela"]

  // ── Mídia ──

  videoUrl?: string;

  // ── Timestamps (ISO 8601) ──

  createdAt: string;
  updatedAt: string;
}

// ─── Types Auxiliares ───────────────────────────────────────────────

/** Produto resumido para cards/listagens (projeção do documento) */
export interface ProductCard {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  currency: "BRL";
  category: ProductCategory;
  primaryImage: ProductImage;
  rating: ProductRating;
  inStock: boolean;
  featured: boolean;
  isNew: boolean;
  isOnSale: boolean;
  isOutlet: boolean;
  colors: ProductColor[];
}

/** Filtros de busca de produtos */
export interface ProductFilters {
  category?: ProductCategory;
  frameShape?: FrameShape;
  frameMaterial?: FrameMaterial;
  lensType?: LensType;
  color?: string;          // slug da cor
  minPrice?: number;       // em centavos
  maxPrice?: number;       // em centavos
  inStock?: boolean;
  isOnSale?: boolean;
  isOutlet?: boolean;
  isNew?: boolean;
  featured?: boolean;
  tags?: string[];
  search?: string;         // busca textual
}

/** Opções de ordenação */
export type ProductSortBy =
  | "price-asc"
  | "price-desc"
  | "newest"
  | "rating"
  | "name-asc"
  | "name-desc"
  | "featured";
