export interface RawNavPage {
  href: string;
  key: string;
}

export const NAV_PAGES: RawNavPage[] = [
  { href: '/', key: 'home' },
  { href: '/sun-glasses', key: 'sunGlasses' },
  { href: '/mini-drop', key: 'miniDrop' },
  { href: '/accessories', key: 'accessories' },
  { href: '/outlet', key: 'outlet' },
  { href: '/promotions', key: 'promotions' },
];
