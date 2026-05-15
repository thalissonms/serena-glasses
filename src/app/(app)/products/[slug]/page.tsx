export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getProductBySlug } from "@features/products/services/productService";
import ProductPageContent from "@features/products/components/ProductPageContent";
import { ProductPageMobileContent } from "@features/products/components/mobile/ProductPageContentMobile";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <>
      <div className="hidden md:block">
        <ProductPageContent product={product} videoSrc={product.videoUrl} />
      </div>
      <div className="md:hidden">
        <ProductPageMobileContent product={product} />
      </div>
    </>
  );
}
