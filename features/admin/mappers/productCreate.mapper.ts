import type { ProductCreateFormData } from "../types/product/productCreateFormData.type";
import { parsePrice } from "../utils/parsePrice";

export interface MappedCreatePayload {
  postPayload: Record<string, unknown>;
  patchPayload: Record<string, unknown>;
}

export function mapProductCreateFormDataToPayload(
  data: ProductCreateFormData,
): MappedCreatePayload {
  const priceInt = parsePrice(data.price);
  const weightInt = parseInt(data.weight, 10);

  const postPayload: Record<string, unknown> = {
    name: data.name,
    slug: data.slug,
    price: priceInt,
    weight: weightInt,
  };
  
  if (data.category_id) {
    postPayload.category_id = data.category_id;
  }

  const patchPayload: Record<string, unknown> = {};

  if (data.compare_at_price) {
    patchPayload.compare_at_price = parsePrice(data.compare_at_price);
  }
  if (data.description) patchPayload.description = data.description;
  if (data.short_description) patchPayload.short_description = data.short_description;
  
  if (data.max_installments && data.max_installments !== "1") {
    patchPayload.max_installments = parseInt(data.max_installments, 10);
  }
  
  if (data.featured) patchPayload.featured = true;
  if (data.is_new) patchPayload.is_new = true;
  if (data.is_sale) patchPayload.is_sale = true;
  if (data.is_outlet) patchPayload.is_outlet = true;
  
  if (data.frame_shape) patchPayload.frame_shape = data.frame_shape;
  if (data.frame_material) patchPayload.frame_material = data.frame_material;
  if (data.lens_type) patchPayload.lens_type = data.lens_type;
  
  if (data.seo_title) patchPayload.seo_title = data.seo_title;
  if (data.seo_description) patchPayload.seo_description = data.seo_description;

  return { postPayload, patchPayload };
}
