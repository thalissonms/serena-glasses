import type { Metadata } from "next";
import "../../styles/tailwind.css";
import { allFontVariablesClassNames, localFontVariablesClassNames } from "@shared/utils/typography";
import { Footer } from "@shared/components/layout";

import i18n from "@i18n/i18n";

import I18nProvider from "@i18n/i18nProvider";

import { siteConfig } from "@shared/config";
import { Nav } from "@features/navigation/components/Nav";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialLang =
    typeof i18n.language === "string"
      ? i18n.language
      : typeof i18n.options.fallbackLng === "string"
      ? i18n.options.fallbackLng
      : undefined;

  return (
    <html lang={initialLang} className={`${allFontVariablesClassNames} ${localFontVariablesClassNames}`}>
      <head />
      <body>
        <I18nProvider>
          <Nav />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
