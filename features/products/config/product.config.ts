import type { ProductColor } from "../types/product.types";

/**
 * Cores disponíveis no catálogo Serena Glasses.
 * Cada cor tem nome, hex e slug para filtros/URL.
 */
export const PRODUCT_COLORS: Record<string, ProductColor> = {
  "rosa-neon": { name: "Rosa Neon", hex: "#FF00B6", slug: "rosa-neon" },
  "rosa-claro": { name: "Rosa Claro", hex: "#FEB6DE", slug: "rosa-claro" },
  "preto": { name: "Preto", hex: "#000000", slug: "preto" },
  "branco": { name: "Branco", hex: "#FFFFFF", slug: "branco" },
  "dourado": { name: "Dourado", hex: "#D4AF37", slug: "dourado" },
  "prata": { name: "Prata", hex: "#C0C0C0", slug: "prata" },
  "tartaruga": { name: "Tartaruga", hex: "#8B4513", slug: "tartaruga" },
  "azul": { name: "Azul", hex: "#31CFE9", slug: "azul" },
  "vermelho": { name: "Vermelho", hex: "#DC143C", slug: "vermelho" },
  "transparente": { name: "Transparente", hex: "#E8E8E8", slug: "transparente" },
  "lavanda": { name: "Lavanda", hex: "#B57EDC", slug: "lavanda" },
  "caramelo": { name: "Caramelo", hex: "#C68E17", slug: "caramelo" },
} as const;

