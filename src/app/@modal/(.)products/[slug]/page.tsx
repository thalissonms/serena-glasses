import ProductPageContentMobile from "@features/products/components/mobile/ProductPageContentMobile";
import { getProductBySlug } from "@features/products/services/productService";
import { notFound } from "next/navigation";

export default async function ProductModal({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return <ProductPageContentMobile product={product} />;
}
