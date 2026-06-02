import { z } from "zod";
import { homeSectionCreateSchema, homeSectionUpdateSchema } from "../../schemas/homeSection.schema";

export type HomeSectionType =
  | "manual"
  | "subcategory"
  | "category"
  | "is_new"
  | "is_sale"
  | "is_outlet"
  | "featured";

export interface HomeSection {
  id: string;
  title_pt: string;
  type: HomeSectionType;
  subcategory_id?: string | null;
  category_id?: string | null;
  display_order: number;
  is_special_component: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
  // Relacionamentos vindos do banco
  subcategories?: { name_pt: string } | null;
  categories?: { name_pt: string } | null;
  home_section_products?: { product_id: string; position: number }[] | null;
}

export type HomeSectionCreateInput = z.infer<typeof homeSectionCreateSchema>;
export type HomeSectionUpdateInput = z.infer<typeof homeSectionUpdateSchema>;
