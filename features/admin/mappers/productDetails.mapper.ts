import { ProductDetailsFormData } from "../types/product/productDetailsFormData.type";
import { parsePrice } from "../utils/parsePrice";

export function mapProductDetailsPayload(
  data: ProductDetailsFormData,
) {
  const payload: Record<string, unknown> = {
    name: data.name,
    slug: data.slug,
    price: parsePrice(data.price),
    uv_protection: data.uv_protection,
    featured: data.featured,
    is_new: data.is_new,
    is_sale: data.is_sale,
    is_outlet: data.is_outlet,
    compare_at_price: data.compare_at_price
      ? parsePrice(data.compare_at_price)
      : null,
    weight: data.weight ? parseInt(data.weight, 10) : null,
    dimensions: data.dimensions || null,
    short_description: data.short_description || null,
    description: data.description || null,
    frame_shape: data.frame_shape || null,
    frame_material: data.frame_material || null,
    lens_type: data.lens_type || null,
  };

  if (data.category_id) {
    payload.category_id = data.category_id;
  }

  if (data.subcategory_ids) {
    payload.subcategory_ids = data.subcategory_ids;
  }

  if (data.max_installments) {
    payload.max_installments = parseInt(
      data.max_installments,
      10,
    );
  }

  return payload;
}