export interface CategoryRow {
  id: string;
  slug: string;
  name_pt: string;
  name_en: string | null;
  name_es: string | null;
  icon_name: string;
  kind: "category" | "flag";
  href_override: string | null;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubcategoryRow {
  id: string;
  category_id: string;
  slug: string;
  name_pt: string;
  name_en: string | null;
  name_es: string | null;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryWithSubs extends CategoryRow {
  subcategories: SubcategoryRow[];
}
