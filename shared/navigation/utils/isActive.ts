export function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  if (pathname === href) return true;
  return pathname.startsWith(href + '/');
}

const hrefParamsCache = new Map<string, URLSearchParams>();

export function isNavActive(
  pathname: string,
  searchParams: { get: (key: string) => string | null },
  href: string,
): boolean {
  const [hrefPath, hrefQuery] = href.split('?');
  if (!hrefQuery) return isActive(pathname, hrefPath);
  if (pathname !== hrefPath) return false;
  let hrefParams = hrefParamsCache.get(hrefQuery);
  if (!hrefParams) {
    hrefParams = new URLSearchParams(hrefQuery);
    hrefParamsCache.set(hrefQuery, hrefParams);
  }
  for (const [key, value] of hrefParams.entries()) {
    if (searchParams.get(key) !== value) return false;
  }
  return true;
}
