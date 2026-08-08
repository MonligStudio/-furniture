import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Phone } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { ProductSpecs } from "@/components/products/product-specs";
import { ProductStage } from "@/components/products/product-stage";
import { ProductStory } from "@/components/products/product-story";
import { QuoteForm } from "@/components/products/quote-form";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  categoryName,
  getProduct,
  products,
  relatedProducts,
} from "@/content/catalog";
import { site } from "@/content/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Ürün bulunamadı" };

  return {
    title: product.name,
    description: product.tagline,
    openGraph: { title: product.name, description: product.description },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = relatedProducts(product);

  return (
    <>
      {/* Kenardan kenara dev fotoğraf + üstünde yüzen bilgi paneli */}
      <ProductStage images={product.gallery} alt={product.name}>
        <span className="chapter">
          {product.badge ? <b>{product.badge}</b> : null}
          {categoryName(product.category)}
        </span>

        <h1 className="display mt-5 text-[clamp(1.7rem,3.2vw,2.6rem)]">
          {product.name}
        </h1>

        <p className="mt-3 text-[1.02rem] text-fg-muted">{product.tagline}</p>

        {/* Kartta yalnızca karar verdiren üç satır: ölçü, kumaş, renk.
            Ayrıntının tamamı aşağıdaki künye tablolarında. */}
        <dl className="mt-7 border-t border-line">
          {[
            { label: "Ölçü", value: Object.values(product.specs)[0] },
            { label: "Kumaş", value: `${product.materials.length} seçenek` },
            { label: "Renk", value: `${product.colors.length} seçenek` },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-baseline justify-between gap-6 border-b border-line py-3"
            >
              <dt className="edge-note text-fg-faint">{row.label}</dt>
              <dd className="text-[0.95rem] text-fg">{row.value}</dd>
            </div>
          ))}
        </dl>

        <a
          href="#teklif"
          className="mt-8 inline-flex h-12 w-full items-center justify-between gap-2 rounded-none bg-accent px-6 font-label text-[0.7rem] tracking-[0.18em] text-ink-950 uppercase transition-colors duration-300 hover:bg-accent-soft"
        >
          Bu ürün için teklif al
          <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
        </a>

        <a
          href={site.contact.phoneHref}
          className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-none border border-line-strong px-6 font-label text-[0.7rem] tracking-[0.18em] text-fg uppercase transition-colors duration-300 hover:border-accent hover:text-accent"
        >
          <Phone className="size-4" strokeWidth={1.5} aria-hidden />
          {site.contact.phone}
        </a>
      </ProductStage>

      {/* Farklı açılardan kareler — scroll ile üstten aşağı açılıyor */}
      <ProductStory product={product} />

      {/* Künye tabloları */}
      <ProductSpecs product={product} />

      {/* Teklif formu — paneldeki düğme buraya çapa atıyor */}
      <section className="section pt-0" id="teklif">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] lg:gap-20">
          <SectionHeading
            no="03"
            eyebrow="Bilgi al"
            lines={["Bu ürün", "hakkında", "yazın"]}
            description="Ölçü, kumaş ve teslim süresi için mağazadan dönüş yapalım. Mesai saatleri içinde genelde aynı gün arıyoruz."
          />

          <div className="reveal">
            <QuoteForm productSlug={product.slug} productName={product.name} />
          </div>
        </div>
      </section>

      {/* Benzer ürünler */}
      {related.length > 0 ? (
        <section className="section pt-0">
          <div className="shell">
            <SectionHeading
              no="04"
              eyebrow="Aynı koleksiyondan"
              lines={["Benzer", "ürünler"]}
            />

            <div className="mt-12 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, i) => (
                <ProductCard key={item.slug} product={item} index={i} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
