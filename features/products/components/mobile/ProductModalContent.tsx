"use client";

import PageInterceptTransition from "@shared/navigation/components/mobile/modals/PageInterceptTransition";
import ProductMobileContent from "./ProductMobileContent";
import type { Product } from "@features/products/types/product.types";
import type { ReviewItem } from "../ProductReviews";

export default function ProductModalContent({ product, reviews }: { product: Product; reviews?: ReviewItem[] }) {
  return (
    <PageInterceptTransition>
      <ProductMobileContent product={product} reviews={reviews} />
    </PageInterceptTransition>
  );
}
