export type SearchResult = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  images: { url: string; alt: string | null; isPrimary?: boolean }[];
  category?: { label_pt: string; label_en?: string; label_es?: string };
  subcategories?: { slug: string; label_pt: string; label_en?: string; label_es?: string }[];
  variants?: { color: { name: string; hex: string; slug: string } }[];
  inStock?: boolean;
};

export type SearchFilters = {
  subcategory?: string;
  shape?: string;
  color?: string;
};

export type SearchFacets = {
  subcategories: { slug: string; label_pt: string; label_en?: string; label_es?: string }[];
  shapes: { slug: string; label_pt: string }[];
  colors: { name: string; hex: string }[];
};
