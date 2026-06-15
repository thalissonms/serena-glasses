import { getSupabaseServer } from "@shared/lib/supabase/server";
import { Product } from "@features/products/types/product.types";
import {
  getNewProducts,
  getPromotionProducts,
  getFeaturedProducts,
  getAllProducts,
} from "@features/products/services/productService";

export type PublicHomeSection = {
  id: string;
  title_pt: string;
  title_en?: string;
  title_es?: string;
  type: "manual" | "subcategory" | "category" | "is_new" | "is_sale" | "is_outlet" | "featured";
  is_special_component: boolean;
  products: Product[];
};

export type DbHomeSection = {
  id: string;
  title_pt: string;
  title_en: string | null;
  title_es: string | null;
  type: "manual" | "subcategory" | "category" | "is_new" | "is_sale" | "is_outlet" | "featured";
  is_special_component: boolean;
  category_id: string | null;
  subcategory_id: string | null;
};

export async function getPublicHomeSections(): Promise<PublicHomeSection[]> {
  const supabase = getSupabaseServer();

  // 1. Fetch active sections
  const { data: sections, error } = await supabase
    .from("home_sections")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error || !sections) {
    console.error("Error fetching home sections:", error);
    return [];
  }

  // 2. Resolve products for each section
  const resolvedSections = await Promise.all(
    sections.map(async (section: DbHomeSection) => {
      let products: Product[] = [];

      try {
        switch (section.type) {
          case "manual":
            // Fetch manual products
            const { data: manualLinks, error: manualErr } = await supabase
              .from("home_section_products")
              .select("product_id")
              .eq("section_id", section.id)
              .order("position", { ascending: true });

            if (manualErr) {
              console.error("Error fetching manual links for section", section.id, manualErr);
            }

            if (manualLinks && manualLinks.length > 0) {
              const productIds = manualLinks.map((l: { product_id: string }) => l.product_id);
              // We need a way to fetch multiple products by IDs.
              // For now, we fetch all and filter, or we can use Supabase directly,
              // but we want the enriched products with stock.
              // We can fetch all active products and filter by IDs to preserve order.
              const allProducts = await getAllProducts();
              products = productIds
                .map((id: string) => allProducts.find((p) => p.id === id))
                .filter(Boolean) as Product[];
            }
            break;
          case "is_new":
            products = await getNewProducts();
            break;
          case "is_outlet":
            products = await getPromotionProducts(); // is_outlet in the current service
            break;
          case "is_sale":
            // To do: fetch sale products, for now fallback to promotion
            products = await getPromotionProducts();
            break;
          case "featured":
            products = await getFeaturedProducts();
            break;
          case "category":
            // We need a function to get by category, fallback to search/all
            if (section.category_id) {
              const allProducts = await getAllProducts();
              products = allProducts.filter((p) => p.category?.id === section.category_id);
            }
            break;
          case "subcategory":
            if (section.subcategory_id) {
              const allProducts = await getAllProducts();
              products = allProducts.filter((p) =>
                p.subcategories?.some(sub => sub.id === section.subcategory_id)
              );
            }
            break;
        }
      } catch (e) {
        console.error(`Error resolving products for section ${section.id}`, e);
      }

      return {
        id: section.id,
        title_pt: section.title_pt,
        title_en: section.title_en,
        title_es: section.title_es,
        type: section.type,
        is_special_component: section.is_special_component,
        products,
      } as PublicHomeSection;
    })
  );

  return resolvedSections;
}
