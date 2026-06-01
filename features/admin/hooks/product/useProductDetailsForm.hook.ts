import { ProductEditData } from "../../services/productEdit.service";
import { ProductDetailsFormData } from "../../types/product/productDetailsFormData.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { productDetailsFormSchema } from "../../schemas/product/form/productDetailsForm.schema.ts";
import { centsToDisplay } from "../../utils/centToDisplay";
import { useForm } from "react-hook-form";

export function useProductDetailsForm(product: ProductEditData) {
  return useForm<ProductDetailsFormData>({
    resolver: zodResolver(productDetailsFormSchema),
    defaultValues: {
      name: product.name,
      slug: product.slug,
      price: centsToDisplay(product.price),
      compare_at_price: product.compare_at_price
        ? centsToDisplay(product.compare_at_price)
        : "",
      weight: product.weight != null ? String(product.weight) : "",
      category_id: product.category_id ?? "",
      subcategory_ids: product.subcategory_ids ?? [],
      max_installments: String(product.max_installments),
      frame_shape: product.frame_shape ?? "",
      frame_material: product.frame_material ?? "",
      lens_type: product.lens_type ?? "",
      uv_protection: product.uv_protection,
      featured: product.featured,
      is_new: product.is_new,
      is_sale: product.is_sale,
      is_outlet: product.is_outlet,
      dimensions: product.dimensions ?? "",
      short_description: product.short_description ?? "",
      description: product.description ?? "",
    },
  });
}