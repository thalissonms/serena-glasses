export interface SiteBannerRow {
  id: string;
  message_pt: string;
  message_en: string | null;
  message_es: string | null;
  link_url: string | null;
  bg_color: string;
  text_color: string;
  starts_at: string | null;
  ends_at: string | null;
  active: boolean;
  dismissible: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}
