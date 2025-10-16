import localFont from 'next/font/local';

// Espelha variáveis já usadas anteriormente (--font-jocham, --font-aisha, --font-routhers)
export const jocham = localFont({
  src: [
    { path: '../../public/fonts/jocham-italic-webfont.ttf', style: 'italic', weight: '400' }
  ],
  variable: '--font-jocham',
  display: 'swap'
});

export const aisha = localFont({
  src: [
    { path: '../../public/fonts/Aisha-Script.otf', weight: '400', style: 'normal' }
  ],
  variable: '--font-aisha',
  display: 'swap'
});

export const routhers = localFont({
  src: [
    { path: '../../public/fonts/routhers.ttf', weight: '400', style: 'normal' }
  ],
  variable: '--font-routhers',
  display: 'swap'
});

export const localFontVariablesClassNames = `${jocham.variable} ${aisha.variable} ${routhers.variable}`;
