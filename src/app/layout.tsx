import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { headers } from "next/headers";
import "../../styles/tailwind.css";
import {
  allFontVariablesClassNames,
  localFontVariablesClassNames,
} from "@shared/utils/typography";

import i18n from "@i18n/i18n";

import I18nProvider from "@i18n/i18nProvider";

import { siteConfig } from "@shared/config";
import { QueryProvider } from "@shared/providers/QueryProvider";
import { ThemeProvider } from "@shared/providers/ThemeProvider";
import { getSetting } from "@features/admin/services/siteSettings.service";
import ModalPresence from "@features/navigation/components/mobile/modals/ModalPresence";

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('serena-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = stored === 'dark' || ((stored === 'system' || !stored) && prefersDark);
    if (isDark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: siteConfig.siteName,
  description: siteConfig.siteDescription,
  keywords: siteConfig.siteKeywords,
  authors: [{ name: siteConfig.author }],
  robots: "index, follow",
  metadataBase: new URL(siteConfig.openGraph.url),

  icons: {
    icon: "/favicon/favicon.ico",
  },

  openGraph: {
    title: siteConfig.openGraph.title,
    description: siteConfig.openGraph.description,
    url: siteConfig.openGraph.url,
    siteName: siteConfig.openGraph.siteName,
    images: [...siteConfig.openGraph.images],
    locale: siteConfig.openGraph.locale,
    type: siteConfig.openGraph.type,
  },
  twitter: {
    card: siteConfig.twitter.card,
    site: siteConfig.twitter.site,
    creator: siteConfig.twitter.creator,
    title: siteConfig.twitter.title,
    description: siteConfig.twitter.description,
    images: [...siteConfig.openGraph.images],
  },
};

export default async function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const initialLang =
    typeof i18n.language === "string"
      ? i18n.language
      : typeof i18n.options.fallbackLng === "string"
        ? i18n.options.fallbackLng
        : undefined;

  const [headersList, pixels] = await Promise.all([
    headers(),
    getSetting("pixels").catch(() => null),
  ]);
  const nonce = headersList.get("x-nonce") ?? undefined;

  return (
    <html
      lang={initialLang}
      className={`${allFontVariablesClassNames} ${localFontVariablesClassNames} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <script
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <Script
          src="https://sdk.mercadopago.com/js/v2"
          strategy="afterInteractive"
          nonce={nonce}
        />

        {pixels?.meta_pixel_id && (
          <Script id="meta-pixel" strategy="afterInteractive" nonce={nonce}>{`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
            document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init','${pixels.meta_pixel_id}');fbq('track','PageView');
          `}</Script>
        )}

        {pixels?.ga4_id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${pixels.ga4_id}`}
              strategy="afterInteractive"
              nonce={nonce}
            />
            <Script id="ga4" strategy="afterInteractive" nonce={nonce}>{`
              window.dataLayer=window.dataLayer||[];
              function gtag(){dataLayer.push(arguments);}
              gtag('js',new Date());
              gtag('config','${pixels.ga4_id}');
            `}</Script>
          </>
        )}

        {pixels?.tiktok_pixel_id && (
          <Script id="tiktok-pixel" strategy="afterInteractive" nonce={nonce}>{`
            !function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
            ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
            ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
            for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
            ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
            ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
            ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;
            ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=document.createElement("script");
            o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;
            var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
            ttq.load('${pixels.tiktok_pixel_id}');ttq.page();}(window,document,'ttq');
          `}</Script>
        )}
      </head>
      <body>
        <ThemeProvider>
          <QueryProvider>
            <I18nProvider>
              <main className="min-h-screen">{children}</main>
              <ModalPresence modal={modal} />
            </I18nProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
