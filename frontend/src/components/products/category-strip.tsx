import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MediaFrame } from "@/components/ui/media-frame";
import { categories, productsByCategory } from "@/content/catalog";

/**
 * Ürünler sayfasının ASIL içeriği: koleksiyon kartları.
 *
 * Ürün ızgarası bunun altında kendiliğinden açılmıyor — "Tüm ürünler"
 * düğmesine basılırsa açılıyor (bkz. `product-explorer.tsx`) ve bu kartlar
 * o zaman da yerinde kalıyor. Buradaki kartlar koleksiyonun kendi
 * sayfasına götürür (hero görseli, açıklaması ve ürünleriyle); aşağıdaki
 * çipler ise açılan listeyi yerinde daraltır.
 */
export function CategoryStrip() {
  return (
    <section className="pb-[clamp(3rem,7vw,5rem)]">
      <div className="shell">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-5">
          <h2 className="chapter">
            <b>{String(categories.length).padStart(2, "0")}</b>
            Koleksiyonlar
          </h2>
          <p className="edge-note text-fg-faint">
            Odaya göre seçilmiş koleksiyonlar
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, i) => (
            <Link
              key={category.slug}
              href={`/koleksiyon/${category.slug}`}
              className="reveal group"
              style={{ "--reveal-delay": `${(i % 3) * 80}ms` } as React.CSSProperties}
            >
              <MediaFrame
                src={category.image}
                alt={`${category.name} koleksiyonu`}
                ratio="16/10"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                scrubAmount={8}
                overlay={
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <h3 className="display text-[1.15rem]">{category.name}</h3>
                      <p className="edge-note mt-2 text-media-fg-muted">
                        {productsByCategory(category.slug).length} ürün
                      </p>
                    </div>
                    <ArrowUpRight
                      className="size-5 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:translate-x-1"
                      strokeWidth={1.25}
                      aria-hidden
                    />
                  </div>
                }
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
