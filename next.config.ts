import type { NextConfig } from "next";
import type { Header } from "next/dist/lib/load-custom-routes";

/**
 * === Variáveis de ambiente em build ===
 * Tudo que começa com NEXT_PUBLIC_ fica disponível no client.
 * Valores usados aqui são lidos em tempo de build (necessário rebuild se mudar).
 */

// NOTA:
// App Router (Next 13+) não usa mais o bloco i18n do next.config para roteamento automático.
// Em vez disso: criar pastas app/(pt-BR)/..., app/(en-US)/... ou usar middlewares dinâmicos / libs custom.
// Mantemos envs para reutilização interna.
const DEFAULT_LOCALE =
  process.env.NEXT_PUBLIC_I18N_DEFAULT_LOCALE || "pt-BR";

const SUPPORTED_LOCALES = (
  process.env.NEXT_PUBLIC_I18N_LOCALES || "pt-BR,en-US,es-ES"
)
  .split(",")
  .map((l) => l.trim())
  .filter(Boolean);

const isProd = process.env.NODE_ENV === "production";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

const supabaseHostname = supabaseUrl
  ? new URL(supabaseUrl).hostname
  : "";

/**
 * CSP dinâmica é gerenciada em src/proxy.ts (nonce-based).
 * Aqui ficam apenas headers estáticos de segurança.
 */
const securityHeaders = isProd
  ? [
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "X-Frame-Options",
        value: "SAMEORIGIN",
      },
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "X-DNS-Prefetch-Control",
        value: "on",
      },
      {
        key: "Permissions-Policy",
        value:
          "camera=(), microphone=(), geolocation=(), fullscreen=(self)",
      },
      {
        key: "Strict-Transport-Security",
        value:
          "max-age=63072000; includeSubDomains; preload",
      },
      {
        key: "Cross-Origin-Opener-Policy",
        value: "same-origin-allow-popups",
      },
      {
        key: "Cross-Origin-Resource-Policy",
        value: "same-site",
      },
    ]
  : [];

const nextConfig: NextConfig = {
  /**
   * Imagens
   * remotePatterns substitui images.domains
   */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },

      {
        protocol: "https",
        hostname: "cdn.example.com",
        pathname: "/**",
      },

      // Host específico do projeto Supabase
      ...(supabaseHostname
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHostname,
              pathname: "/**",
            },
          ]
        : []),

      // Fallback wildcard para Supabase Storage
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],

    deviceSizes: [
      640,
      750,
      828,
      1080,
      1200,
      1920,
      2048,
      3840,
    ],

    imageSizes: [
      16,
      32,
      48,
      64,
      96,
      128,
      256,
      384,
    ],

    formats: ["image/webp"],

    minimumCacheTTL: 60,
  },

  /**
   * Segurança
   */
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,

  /**
   * Allow ngrok tunnels for local testing
   */
  allowedDevOrigins: [
    "*.ngrok-free.app",
    "*.ngrok.io",
    "localhost",
    "192.168.25.35",
  ],

  /**
   * Experimental
   */
  experimental: {
    optimizeCss: true,
  },

  /**
   * Headers globais
   */
  async headers(): Promise<Header[]> {
    const headers: Header[] = [
      /**
       * Headers de segurança globais
       */
      ...(securityHeaders.length > 0
        ? [
            {
              source: "/(.*)",
              headers: securityHeaders,
            },
          ]
        : []),

      /**
       * Cache agressivo para assets estáticos
       */
      {
        source: "/:all*(svg|jpg|png|webp|avif|woff2)",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=31536000, immutable",
          },
        ],
      },
    ];

    return headers;
  },
};

export default nextConfig;