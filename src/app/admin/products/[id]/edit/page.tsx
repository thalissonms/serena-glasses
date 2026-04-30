import { requireAdmin } from "@shared/lib/auth/admin";
import { notFound } from "next/navigation";
import ProductEditForm from "@features/admin/components/ProductEditForm";
import { getProductForEdit } from "@features/admin/services/productEdit.service";
import {
  PRODUCT_CATEGORIES,
  FRAME_SHAPES,
  FRAME_MATERIALS,
  LENS_TYPES,
} from "@features/admin/schemas/productEdit.schema";

function asEnum<T extends readonly string[]>(
  list: T,
  value: string | null,
): T[number] | null {
  if (!value) return null;
  return (list as readonly string[]).includes(value) ? (value as T[number]) : null;
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminProductEditPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const product = await getProductForEdit(id);
  if (!product) notFound();

  return (
    <div className="p-8">
      <ProductEditForm
        productId={product.id}
        variants={product.variants}
        images={product.images}
        videoUrl={product.video_url}
        initial={{
          name: product.name,
          slug: product.slug,
          description: product.description ?? "",
          short_description: product.short_description ?? "",
          price: product.price,
          compare_at_price: product.compare_at_price ?? null,
          category: asEnum(PRODUCT_CATEGORIES, product.category) ?? "sunglasses",
          frame_shape: asEnum(FRAME_SHAPES, product.frame_shape),
          frame_material: asEnum(FRAME_MATERIALS, product.frame_material),
          lens_type: asEnum(LENS_TYPES, product.lens_type),
          uv_protection: product.uv_protection,
          weight: product.weight ?? null,
          dimensions: product.dimensions ?? null,
          tags: product.tags ?? [],
          included_accessories: product.included_accessories ?? [],
          seo_title: product.seo_title ?? null,
          seo_description: product.seo_description ?? null,
          seo_keywords: product.seo_keywords ?? [],
          video_url: product.video_url ?? null,
        }}
      />
    </div>
  );
}
