import type { NextConfig } from "next";

/**
 * === Variáveis de ambiente em build ===
 * Tudo que começa com NEXT_PUBLIC_ fica disponível no client.
 * Valores usados aqui são lidos em tempo de build (necessário rebuild se mudar).
 */
// NOTA: App Router (Next 13+) não usa mais o bloco i18n do next.config para roteamento automático.
// Em vez disso: criar pastas app/(pt-BR)/..., app/(en-US)/... ou usar middlewares dinâmicos / libs custom.
// Manter envs para reutilizar em libs internas, mas não inserir em next.config.
const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_I18N_DEFAULT_LOCALE || "pt-BR";
const SUPPORTED_LOCALES = (process.env.NEXT_PUBLIC_I18N_LOCALES || "pt-BR,en-US,es-ES")
  .split(",")
  .map((l) => l.trim())
  .filter(Boolean);

const isProd = process.env.NODE_ENV === 'production';

/**
 * CSP Produção (mais rígida) e CSP Desenvolvimento (relaxada para HMR / overlay):
 * - Dev precisa de: 'unsafe-eval' e às vezes inline scripts do overlay + websockets (ws:, wss:, blob:)
 * - Prod remove eval/inline e mantém política estrita.
 */
const cspProd = [
  "default-src 'self'",
  "script-src 'self' 'strict-dynamic'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://cdn.example.com",
  "font-src 'self' data:",
  "connect-src 'self'",
  "media-src 'self'",
  "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join('; ');

const cspDev = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://cdn.example.com",
  "font-src 'self' data:",
  "connect-src 'self' ws: wss:",
  "media-src 'self'",
  "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join('; ');

const securityHeaders = isProd
  ? [
      { key: 'Content-Security-Policy', value: cspProd },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-DNS-Prefetch-Control', value: 'on' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), fullscreen=(self)' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    ]
  : [
      // Em dev deixamos somente CSP relaxada para não quebrar HMR e overlay
      { key: 'Content-Security-Policy', value: cspDev },
    ];

const nextConfig: NextConfig = {
  /**
   * Imagens: migrado de images.domains -> images.remotePatterns
   * remotePatterns dá granularidade (protocolo/host/pathname) e substitui domains (deprecated).
   */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**", // permite todas as paths do Unsplash
      },
      {
        protocol: "https",
        hostname: "cdn.example.com",
        pathname: "**", // ajuste se quiser restringir ex: /images/**
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp"],
    minimumCacheTTL: 60,
  },

  // i18n removido: App Router exige abordagem baseada em segmentos de rota / middleware.
  // Referência: https://nextjs.org/docs/app/building-your-application/routing/internationalization

  /**
   * Segurança e boas práticas
   */
  poweredByHeader: false, // remove o header X-Powered-By
  reactStrictMode: true, // ativa warnings adicionais de React (já padrão em App Router mas explícito)
  compress: true, // gzip / brotli
  // swcMinify removido: já é padrão nas versões atuais do Next

  /**
   * Experimental / performance
   */
  experimental: {
    optimizeCss: true,
  },

  /**
   * Headers globais + cache estático para assets
   */
  async headers() {
    return [
      // Segurança aplicada a todas as rotas (em dev apenas CSP simplificada; em prod conjunto completo)
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      // Cache longo para assets estáticos
      {
        source: "/:all*(svg|jpg|png|webp|avif|woff2)",
        locale: false,
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
