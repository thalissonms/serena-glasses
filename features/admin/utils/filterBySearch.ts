export function filterBySearch<T>(
  items: T[],
  search: string,
  fields: (keyof T)[]
): T[] {
  if (!search.trim()) return items;

  const term = search.toLowerCase().replace("#", "");

  return items.filter((item) =>
    fields.some((field) => {
      const value = String(item[field] ?? "").toLowerCase();
      return value.includes(term);
    })
  );
}