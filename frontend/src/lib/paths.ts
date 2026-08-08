const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * `public/` altındaki dosyaları hem kök domainde hem de GitHub Pages'in
 * `/repo-adi` alt yolunda doğru adrese bağlar.
 */
export function publicAsset(src: string) {
  if (!basePath || !src.startsWith("/") || src.startsWith(`${basePath}/`)) {
    return src;
  }

  return `${basePath}${src}`;
}
