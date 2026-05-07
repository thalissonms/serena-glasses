import { notFound } from "next/navigation";
import { getProductBySlug } from "@features/products/services/productService";
import ProductPageContent from "@features/products/components/ProductPageContent";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return <ProductPageContent product={product} videoSrc={product.videoUrl} />;
}
