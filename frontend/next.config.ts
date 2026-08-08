import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /* GitHub Pages bir Node.js sunucusu çalıştırmaz. Her rotayı HTML olarak
     `out/` klasörüne çıkar; trailingSlash da alt sayfalarda `index.html`
     üretilmesini sağlar. */
  output: "export",
  trailingSlash: true,
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  /* Görseller `public/` altında ve hepsi WebP (bkz. scripts/optimize-images.mjs).
     Uzak bir CDN'e geçilirse remotePatterns buraya eklenir. */
  images: {
    /* Statik hostta `/_next/image` servisi olmadığı için dosyaları olduğu
       gibi kullanıyoruz; kaynak WebP'ler zaten önceden optimize edilmiş. */
    unoptimized: true,
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
