import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurações principais de imagens
  images: {
    domains: ["images.unsplash.com", "cdn.example.com"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp"],
    minimumCacheTTL: 60,
  },

  // Configurações experimentais atualizadas
  experimental: {
    optimizeCss: true, // Otimização de CSS
    // Removido optimizeImages pois não existe mais
  },

  // Headers de cache
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|png|webp|avif|woff2)",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
