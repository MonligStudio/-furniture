/**
 * Ürün / kategori / katalog verisinin tipli okuma katmanı.
 *
 * JSON dosyaları `backend/data/seed` içinden kopyalanıyor
 * (bkz. backend `npm run sync:content`) — elle düzenlenmez.
 */
import catalogsJson from "./data/catalogs.json";
import categoriesJson from "./data/categories.json";
import productsJson from "./data/products.json";
import { publicAsset } from "@/lib/paths";

export type Category = {
  slug: string;
  name: string;
  short: string;
  summary: string;
  image: string;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  badge?: string;
  featured?: boolean;
  tagline: string;
  description: string;
  highlights: string[];
  specs: Record<string, string>;
  materials: string[];
  colors: string[];
  image: string;
  gallery: string[];
};

export type Catalog = {
  slug: string;
  title: string;
  year: number;
  pageCount: number;
  featured?: boolean;
  summary: string;
  description: string;
  cover: string;
  pages: string[];
  pdfUrl: string | null;
  topics: string[];
};

/* JSON'dan gelen tipler birebir örtüşmüyor (TypeScript her ürünün `specs`
   anahtarlarını ayrı ayrı çıkarıyor, `Record<string, string>` ile
   karşılaştıramıyor). Şekil yukarıdaki tiplerle doğrulandığı için
   `unknown` üzerinden dönüştürülüyor. */
const rawCategories = categoriesJson as unknown as Category[];
const rawProducts = productsJson as unknown as Product[];
const rawCatalogs = catalogsJson as unknown as Catalog[];

export const categories = rawCategories.map((category) => ({
  ...category,
  image: publicAsset(category.image),
}));

export const products = rawProducts.map((product) => ({
  ...product,
  image: publicAsset(product.image),
  gallery: product.gallery.map(publicAsset),
}));

export const catalogs = rawCatalogs.map((catalog) => ({
  ...catalog,
  cover: publicAsset(catalog.cover),
  pages: catalog.pages.map(publicAsset),
  pdfUrl: catalog.pdfUrl ? publicAsset(catalog.pdfUrl) : null,
}));

export const featuredProducts = products.filter((product) => product.featured);

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getCatalog(slug: string) {
  return catalogs.find((catalog) => catalog.slug === slug);
}

export function productsByCategory(slug: string) {
  return products.filter((product) => product.category === slug);
}

/** Detay sayfasının altındaki "benzer ürünler" şeridi. */
export function relatedProducts(product: Product, limit = 3) {
  return products
    .filter(
      (item) => item.category === product.category && item.slug !== product.slug,
    )
    .slice(0, limit);
}

/** Kategori adını slug'dan okur — kartlarda ve filtrelerde kullanılıyor. */
export function categoryName(slug: string) {
  return getCategory(slug)?.name ?? slug;
}
