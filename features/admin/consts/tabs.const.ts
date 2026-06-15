import { TabId } from "../types/product/tabId.type";


export const TABS_EDIT: { id: TabId; label: string }[] = [
  { id: "details", label: "Detalhes" },
  { id: "variants", label: "Variantes" },
  { id: "images", label: "Imagens" },
  { id: "video", label: "Vídeo" },
  { id: "seo", label: "SEO" },
];

export const TABS_CREATE: { id: TabId; label: string }[] = [
  { id: "details", label: "Detalhes" },
  { id: "texts", label: "Textos & SEO" },
  { id: "media", label: "Mídia" },
];

