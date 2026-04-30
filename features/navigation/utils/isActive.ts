export function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  if (pathname === href) return true;
  return pathname.startsWith(href + '/');
}

export function isNavActive(
  pathname: string,
  searchParams: { get: (key: string) => string | null },
  href: string,
): boolean {
  const [hrefPath, hrefQuery] = href.split('?');
  if (!hrefQuery) return isActive(pathname, hrefPath);
  if (pathname !== hrefPath) return false;
  const hrefParams = new URLSearchParams(hrefQuery);
  for (const [key, value] of hrefParams.entries()) {
    if (searchParams.get(key) !== value) return false;
  }
  return true;
}
