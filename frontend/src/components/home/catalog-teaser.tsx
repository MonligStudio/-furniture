import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MediaFrame } from "@/components/ui/media-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { catalogs } from "@/content/catalog";

/** 09 — Dijital katalog tanıtımı: kapaklar + tek satırlık açıklama. */
export function CatalogTeaser() {
  return (
    <section className="section">
      <div className="shell">
        <SectionHeading
          no="08"
          eyebrow="Dijital katalog"
          lines={["Koleksiyonu", "mağazaya", "gelmeden gezin"]}
          description="Ölçü şemaları, kumaş kartelası ve modül seçenekleri dijital katalogda. İsterseniz PDF olarak e-postanıza gönderelim."
          align="center"
          className="mx-auto items-center text-center"
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {catalogs.map((catalog, i) => (
            <Link
              key={catalog.slug}
              href={`/katalog/${catalog.slug}`}
              className="reveal group"
              style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
            >
              <MediaFrame
                src={catalog.cover}
                alt={`${catalog.title} kapağı`}
                ratio="3/4"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-[1.1rem] text-fg transition-colors duration-300 group-hover:text-accent">
                    {catalog.title}
                  </h3>
                  <p className="edge-note mt-1.5 text-fg-faint">
                    {catalog.year} · {catalog.pageCount} sayfa
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/katalog"
            className="edge-note group inline-flex items-center gap-3 border-b border-line pb-2 text-fg transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            Tüm katalogları gör
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={1.5}
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
