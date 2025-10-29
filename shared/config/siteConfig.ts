export const siteConfig = {
  siteName: "Serena Glasses",
  siteDescription: "Serana Glasses - Boutique de Óculos Solar",
  siteKeywords: "óculos, moda, estilo, música, rosa, loja, design, boutique",
  author: "Thalisson M. Silva",
  locale: "pt-BR",
  socialLinks: {
    instagram: "https://www.instagram.com/serenaglasses",
    facebook: "https://www.facebook.com/serenaglasses",
    tiktok: "https://www.tiktok.com/@serenaglasses",
  },
  openGraph: {
    title: "Serana Glasses - Boutique de Óculos Solar",
    description: "Serana Glasses - Boutique de Óculos Solar",
    url: "https://www.serenaglasses.com",
    siteName: "Serena Glasses",
    images: [
      {
        url: "/logo/logo-pink.svg",
        alt: "Logo Serena Glasses",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image", 
    site: "@serenatt",
    creator: "@D3CO08",
    title: "Serana Glasses - Boutique de Óculos Solar",
    description: "Serana Glasses - Boutique de Óculos Solar",
    images: ["/logo/logo-pink.svg"],
  },
} as const;