"use client";
import Image from "next/image";
import { Eye, Ruler, Shield, Weight, Zap } from "lucide-react";
import type { Product } from "@features/products/types/product.types";
import {
  FRAME_MATERIAL_LABELS,
  FRAME_SHAPE_LABELS,
  LENS_TYPE_LABELS,
} from "@features/products/config/product.config";
import ProductEditorial from "./ProductEditorial";
import ProductLookbook, { type LookbookItem } from "./ProductLookbook";
import ProductReviews, { type ReviewItem } from "./ProductReviews";
import ProductSpecs, { type SpecItem } from "./ProductSpecs";

const LOOKBOOK: LookbookItem[] = [
  { id: 1, label: "Look 01 — Urbano" },
  { id: 2, label: "Look 02 — Praia" },
  { id: 3, label: "Look 03 — Night" },
  { id: 4, label: "Look 04 — Studio" },
];

const REVIEWS: ReviewItem[] = [
  {
    name: "Mariana S.",
    city: "Sete Lagoas",
    stars: 5,
    text: "Apaixonada! Chegou super rápido e o acabamento é incrível. Já recebi vários elogios.",
    date: "Abr 2025",
    verified: true,
  },
  {
    name: "Camila R.",
    city: "Contagem",
    stars: 5,
    text: "Melhor compra do mês. A lente é escura na medida certa e a armação é levíssima.",
    date: "Mar 2025",
    verified: true,
  },
  {
    name: "Letícia P.",
    city: "BH",
    stars: 4,
    text: "Amei o modelo, ficou perfeito no rosto oval. Só esperava a embalagem um pouco maior.",
    date: "Mar 2025",
    verified: true,
  },
  {
    name: "Júlia M.",
    city: "Belo Horizonte",
    stars: 5,
    text: "Comprei na cor Rosa e é TUDO. Parece óculos de marca gringa por uma fração do preço.",
    date: "Fev 2025",
    verified: true,
  },
  {
    name: "Ana B.",
    city: "Sete Lagoas",
    stars: 5,
    text: "Segunda compra aqui, e continua excelente. Recomendo demais pra quem quer estilo sem gastar muito.",
    date: "Fev 2025",
    verified: true,
  },
];

function buildSpecs(product: Product): SpecItem[] {
  const width = product.dimensions?.split(" x ")[0] ?? "–";
  return [
    {
      icon: Ruler,
      labelKey: "description.specs.format",
      value: FRAME_SHAPE_LABELS[product.frameShape],
    },
    {
      icon: Shield,
      labelKey: "description.specs.protection",
      value: product.uvProtection ? "UV400 — bloqueio total" : "Sem proteção UV",
    },
    {
      icon: Zap,
      labelKey: "description.specs.lensMaterial",
      value: LENS_TYPE_LABELS[product.lensType],
    },
    {
      icon: Eye,
      labelKey: "description.specs.frame",
      value: FRAME_MATERIAL_LABELS[product.frameMaterial],
    },
    {
      icon: Weight,
      labelKey: "description.specs.weight",
      value: product.weight ? `≈ ${product.weight} g` : "–",
    },
    {
      icon: Ruler,
      labelKey: "description.specs.totalWidth",
      value: width,
    },
  ];
}

interface ProductDescriptionProps {
  product: Product;
}

export default function ProductDescription({ product }: ProductDescriptionProps) {
  const specs = buildSpecs(product);

  return (
    <section className="w-full max-w-[96vw] mx-auto px-4 pb-12 md:px-20 md:pb-24 flex flex-col gap-10 md:gap-20 bg-white dark:bg-[#0a0a0a] py-10 transition-colors">
      <div className="flex items-center gap-4">
        <div className="flex-1 h-0.75 bg-black dark:bg-brand-pink" />
        <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-pink px-2">
          {product.name}
        </span>
        <div className="flex-1 h-0.75 bg-black dark:bg-brand-pink" />
      </div>

     

      <ProductEditorial product={product} />
      <ProductSpecs specs={specs} />
      <ProductLookbook items={LOOKBOOK} />
      <ProductReviews reviews={REVIEWS} />
    </section>
  );
}
