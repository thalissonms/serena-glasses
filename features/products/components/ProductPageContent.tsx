"use client";
import { useMemo, useState } from "react";
import type { Product } from "@features/products/types/product.types";
import ProductActions from "./ProductActions";
import ProductDelivery from "./ProductDelivery";
import ProductDescription from "./ProductDescription";
import ProductInfo from "./ProductInfo";
import ProductMediaViewer from "./ProductMediaViewer";

import type { ReviewItem } from "./ProductReviews";

interface ProductPageContentProps {
  product: Product;
  videoSrc?: string;
  reviews?: ReviewItem[];
}

export default function ProductPageContent({
  product,
  videoSrc,
  reviews,
}: ProductPageContentProps) {

  const initialColor = useMemo(() => {
    const idx = product.variants.findIndex((v) => v.inStock);
    return idx >= 0 ? idx : 0;
  }, [product.variants]);
  const [selectedColor, setSelectedColor] = useState(initialColor);

  const fallbackImageUrl =
    product.images.find((img) => img.isPrimary)?.url ?? product.images[0]?.url;

  return (
    <main
      className="min-h-screen w-full pb-10 text-brand-black transition-colors dark:text-brand-white"
    >
      <section className="mx-auto hidden max-w-[96vw] grid-cols-1 items-start px-4 py-6 md:grid md:grid-cols-[26.5rem_1fr] md:px-20 md:py-10">
        <ProductMediaViewer
          name={product.name}
          videoSrc={videoSrc}
          fallbackImageUrl={fallbackImageUrl}
        />

        <div className="flex flex-1 flex-col gap-3 pt-4 pl-0 md:py-2 md:pt-0 md:pl-20">
          <ProductInfo
            product={product}
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
          />
          <ProductActions
            product={product}
            selectedColorIndex={selectedColor}
          />
          <ProductDelivery />
        </div>
      </section>
      <ProductDescription product={product} reviews={reviews} />
    </main>
  );
}
