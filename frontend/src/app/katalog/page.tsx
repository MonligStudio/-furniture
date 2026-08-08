import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CatalogRequestForm } from "@/components/catalog/catalog-request-form";
import { PageHero } from "@/components/layout/page-hero";
import { MediaFrame } from "@/components/ui/media-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { catalogs } from "@/content/catalog";

export const metadata: Metadata = {
  title: "Dijital Katalog",
  description:
    "Salon, yatak odası ve yemek odası koleksiyonlarının dijital katalogları; ölçü şemaları ve kumaş kartelası.",
};

const totalPages = catalogs.reduce(
  (sum, catalog) => sum + catalog.pageCount,
  0,
);

export default function CatalogPage() {
  return (
    <>
      <PageHero
        eyebrow="Dijital katalog"
        title={["Katalog"]}
        description="Koleksiyonları, ölçü şemalarını ve kumaş kartelasını mağazaya gelmeden inceleyin. İsterseniz PDF olarak e-postanıza gönderelim."
        meta={[
          { label: "Katalog", value: `${catalogs.length}` },
          { label: "Toplam sayfa", value: `${totalPages}` },
          { label: "Yıl", value: "2026" },
          { label: "Format", value: "Web + PDF" },
        ]}
      />

      {/* Katalog listesi */}
      <section className="pb-[clamp(4rem,9vw,8rem)]">
        <div className="shell flex flex-col gap-16">
          {catalogs.map((catalog, i) => (
            <article
              key={catalog.slug}
              className="reveal grid items-center gap-8 border-t border-line pt-10 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] lg:gap-14"
            >
              <Link href={`/katalog/${catalog.slug}`} className="group block">
                <MediaFrame
                  src={catalog.cover}
                  alt={`${catalog.title} kapağı`}
                  ratio="3/4"
                  sizes="(max-width: 1024px) 100vw, 32vw"
                />
              </Link>

              <div>
                <span className="chapter">
                  <b>{String(i + 1).padStart(2, "0")}</b>
                  {catalog.year} · {catalog.pageCount} sayfa
                </span>

                <h2 className="display mt-5 text-[clamp(1.5rem,3.2vw,2.4rem)]">
                  {catalog.title}
                </h2>

                <p className="mt-5 max-w-xl text-fg-muted">{catalog.summary}</p>

                <ul className="mt-6 flex flex-wrap gap-2">
                  {catalog.topics.map((topic) => (
                    <li
                      key={topic}
                      className="rounded-none border border-line px-3 py-1 font-label text-[0.62rem] tracking-[0.14em] text-fg-muted uppercase"
                    >
                      {topic}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/katalog/${catalog.slug}`}
                  className="edge-note group mt-8 inline-flex items-center gap-3 border-b border-line pb-2 text-fg transition-colors duration-300 hover:border-accent hover:text-accent"
                >
                  Kataloğu aç
                  <ArrowUpRight
                    className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PDF talebi */}
      <section className="section pt-0" id="pdf">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)] lg:gap-20">
          <SectionHeading
            no="05"
            eyebrow="PDF"
            lines={["Kataloğu", "e-postanıza", "gönderelim"]}
            description="Formu bırakın, seçtiğiniz kataloğun PDF'ini mesai saatleri içinde gönderelim. Dilerseniz mağazada basılı nüshasını da veriyoruz."
          />

          <div className="reveal">
            <CatalogRequestForm />
          </div>
        </div>
      </section>
    </>
  );
}
