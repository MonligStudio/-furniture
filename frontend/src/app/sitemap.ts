import type { MetadataRoute } from "next";
import { catalogs, categories, products } from "@/content/catalog";
import { mainNav, site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...mainNav.map((item) => ({
      url: `${site.url}${item.href === "/" ? "" : item.href}`,
      lastModified: now,
      priority: item.href === "/" ? 1 : 0.8,
    })),
    ...categories.map((category) => ({
      url: `${site.url}/koleksiyon/${category.slug}`,
      lastModified: now,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: `${site.url}/urunler/${product.slug}`,
      lastModified: now,
      priority: 0.7,
    })),
    ...catalogs.map((catalog) => ({
      url: `${site.url}/katalog/${catalog.slug}`,
      lastModified: now,
      priority: 0.6,
    })),
  ];
}
