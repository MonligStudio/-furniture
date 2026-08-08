import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { CollectionHero } from "@/components/collections/collection-hero";
import { CollectionsMenu } from "@/components/layout/collections-menu";
import { ProductCard } from "@/components/products/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  categories,
  getCategory,
  productsByCategory,
} from "@/content/catalog";
import { site } from "@/content/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Koleksiyon bulunamadı" };

  return {
    title: category.name,
    description: category.summary,
    openGraph: {
      title: `${category.name} — ${site.legalName}`,
      description: category.summary,
      images: [category.image],
    },
  };
}

export default async function CollectionPage({ params }: Params) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const items = productsByCategory(category.slug);

  return (
    <>
      {/* Anasayfadaki slider'dan büyüyerek gelen görselin devamı: tam ekran
          kalıyor, koleksiyonun özeti ve künyesi (01) görselin ÜSTÜNDE. */}
      <CollectionHero
        image={category.image}
        title={category.name}
        eyebrow="Koleksiyon"
        count={items.length}
        summary={category.summary}
      />

      {/* Koleksiyondaki ürünler */}
      <section className="section">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <SectionHeading
              no="02"
              eyebrow="Ürünler"
              lines={["Koleksiyondaki", "parçalar"]}
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

          {items.length > 0 ? (
            <div className="mt-14 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((product, i) => (
                <ProductCard key={product.slug} product={product} index={i} />
              ))}
            </div>
          ) : (
            <p className="mt-14 border border-line py-20 text-center text-fg-muted">
              Bu koleksiyonun ürünleri mağazada sergileniyor — bizi arayın.
            </p>
          )}
        </div>
      </section>

      {/* Diğer koleksiyonlar — SADECE bu sayfada, en altta. */}
      <CollectionsMenu exclude={category.slug} />
    </>
  );
}
