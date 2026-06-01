/**
 * Util: pickLocale — escolhe nome localizado a partir de colunas name_pt/name_en/name_es.
 *
 * Faz fallback para name_pt quando o idioma alvo não tem tradução (null).
 * Match de idioma via prefixo (lang.startsWith) para aceitar variantes regionais.
 *
 * Usado em: NavPages, MobileNav, FilterCategories e demais consumidores de categoria/subcategoria.
 */
type LocaleNames = {
  name_pt: string;
  name_en: string | null;
  name_es: string | null;
};

export function pickLocale(ref: LocaleNames, lang: string): string {
  if (lang.startsWith("en") && ref.name_en) return ref.name_en;
  if (lang.startsWith("es") && ref.name_es) return ref.name_es;
  return ref.name_pt;
}
