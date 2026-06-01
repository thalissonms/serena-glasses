export interface HomeStory {
  id: string;
  kind: "product" | "manual";

  mediaType: "image" | "video";
  mediaUrl: string;
  posterUrl?: string;
  ctaUrl: string;
  ctaLabel: string;
  title: string;
  subtitle?: string;

  avatarKind: "icon" | "label";
  avatarIconName?: string;
  avatarLabel?: string;

  productId?: string;
  productSlug?: string;
  productName?: string;
  productShortDescription?: string;
  productInStock?: boolean;
}

export interface HomeStoryRow {
  id: string;
  kind: "product" | "manual";
  product_id: string | null;
  media_type: "image" | "video" | null;
  media_url: string | null;
  cta_url: string | null;
  cta_label_pt: string | null;
  cta_label_en: string | null;
  cta_label_es: string | null;
  title_pt: string | null;
  title_en: string | null;
  title_es: string | null;
  subtitle_pt: string | null;
  subtitle_en: string | null;
  subtitle_es: string | null;
  avatar_label: string | null;
  display_order: number;
  active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
}
