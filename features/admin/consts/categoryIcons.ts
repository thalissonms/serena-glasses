export const ALLOWED_CATEGORY_ICONS = [
  // Já em uso no projeto
  "Glasses", "Sparkles", "Stars", "Tag", "Percent", "Heart", "Gem",
  "ShoppingBag", "Search", "Eye",
  // Tipos / formatos de óculos
  "Sun", "Moon", "CloudSun", "Aperture", "Focus",
  // Estilo Y2K / lifestyle
  "Disc3", "Music", "Headphones", "Camera", "Wand2",
  // Comercial / destaque
  "Flame", "Zap", "Award", "Crown", "Gift",
  // Coleções / organização
  "Package", "Boxes", "Layers", "Palette", "Flower2",
] as const;

export type AllowedCategoryIcon = typeof ALLOWED_CATEGORY_ICONS[number];
