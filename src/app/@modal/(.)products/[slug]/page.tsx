import ProductModalContent from "@features/products/components/mobile/ProductModalContent";
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

  return <ProductModalContent product={product} />;
}
