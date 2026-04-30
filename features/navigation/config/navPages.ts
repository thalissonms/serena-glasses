export interface RawNavPage {
  href: string;
  key: string;
}

export const NAV_PAGES: RawNavPage[] = [
  { href: '/', key: 'home' },
  { href: '/products?category=sunglasses', key: 'sunGlasses' },
  { href: '/products?category=miniDrop', key: 'miniDrop' },
  { href: '/products?category=accessories', key: 'accessories' },
  { href: '/products?outlet=true', key: 'outlet' },
  { href: '/products?sale=true', key: 'promotions' },
];
