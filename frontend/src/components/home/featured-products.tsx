import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GridToPreview, type PreviewItem } from "@/components/ui/grid-preview";
import { SectionHeading } from "@/components/ui/section-heading";
import { categoryName, featuredProducts } from "@/content/catalog";

/**
 * 04 — Öne çıkan ürünler.
 *
 * 4 sütun × 2 satırlık ızgara; bir kutunun üstüne gelince karşı yarıda
 * büyük önizleme paneli açılıyor (bkz. `ui/grid-preview.tsx`). Bölünmenin
 * çalışması için tam 8 ürün gerekiyor — `featured` işaretli ürün sayısı
 * bunu karşılıyor (bkz. backend/data/seed/products.json).
 */
const items: PreviewItem[] = featuredProducts.slice(0, 8).map((product) => ({
  id: product.slug,
  title: product.name,
  meta: categoryName(product.category),
  href: `/urunler/${product.slug}`,
  image: product.image,
  gallery: product.gallery,
}));

export function FeaturedProducts() {
  return (
    <section className="section">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            no="04"
            eyebrow="Öne çıkanlar"
            lines={["Bu sezon", "en çok", "seçilenler"]}
          />

          <Link
            href="/urunler"
            className="reveal edge-note group inline-flex items-center gap-3 border-b border-line pb-2 text-fg transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            Tüm ürünler
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={1.5}
              aria-hidden
            />
          </Link>
        </div>

        <div className="reveal mt-14">
          <GridToPreview items={items} columns={4} mode="split" cta="Ürünü aç" />
        </div>
      </div>
    </section>
  );
}
