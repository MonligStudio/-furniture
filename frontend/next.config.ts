import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /* Görseller `public/` altında ve hepsi WebP (bkz. scripts/optimize-images.mjs).
     Uzak bir CDN'e geçilirse remotePatterns buraya eklenir. */
  images: {
    formats: ["image/avif", "image/webp"],
    /* Varsayılan liste 3840'a kadar çıkıyor. Kaynakların uzun kenarı en
       fazla 1800 (optimize-images.mjs `MAX_EDGE`), yani daha büyük her
       basamak aynı kareyi bir kez daha üretip önbelleğe yazmaktan başka
       işe yaramıyor. */
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920],
    /* Yer tutucular değişmiyor; optimize edicinin ürettiği kare uzun süre
       geçerli kalsın (30 gün). */
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
