import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CatalogRequestForm } from "@/components/catalog/catalog-request-form";
import { CatalogViewer } from "@/components/catalog/catalog-viewer";
import { SectionHeading } from "@/components/ui/section-heading";
import { catalogs, getCatalog } from "@/content/catalog";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return catalogs.map((catalog) => ({ slug: catalog.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const catalog = getCatalog(slug);
  if (!catalog) return { title: "Katalog bulunamadı" };

  return { title: catalog.title, description: catalog.summary };
}

export default async function CatalogDetailPage({ params }: Params) {
  const { slug } = await params;
  const catalog = getCatalog(slug);
  if (!catalog) notFound();

  return (
    <>
      <section className="pt-[clamp(7rem,14vh,10rem)]">
        <div className="shell">
          <Link
            href="/katalog"
            className="edge-note group inline-flex items-center gap-2 text-fg-muted transition-colors hover:text-fg"
          >
            <ArrowLeft
              className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
              strokeWidth={1.5}
              aria-hidden
            />
            Tüm kataloglar
          </Link>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
            <div>
              <span className="chapter">
                <b>{catalog.year}</b>
                {catalog.pageCount} sayfa
              </span>
              <h1 className="display mt-5 text-[clamp(1.9rem,4.4vw,3.2rem)]">
                {catalog.title}
              </h1>
            </div>

            <p className="max-w-md text-fg-muted">{catalog.description}</p>
          </div>
        </div>
      </section>

      <section className="pb-[clamp(3rem,7vw,6rem)] pt-10">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.32fr)] lg:gap-14">
          <CatalogViewer pages={catalog.pages} title={catalog.title} />

          <aside className="flex flex-col gap-8">
            <div>
              <h2 className="edge-note text-fg-faint">İçindekiler</h2>
              <ul className="mt-4 flex flex-col gap-2">
                {catalog.topics.map((topic) => (
                  <li
                    key={topic}
                    className="flex items-start gap-3 text-fg-muted"
                  >
                    <span
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                      aria-hidden
                    />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-line pt-6">
              <h2 className="edge-note text-fg-faint">PDF</h2>
              {catalog.pdfUrl ? (
                <a
                  href={catalog.pdfUrl}
                  className="mt-4 inline-flex h-11 items-center rounded-none border border-line-strong px-6 font-label text-[0.68rem] tracking-[0.16em] text-fg uppercase transition-colors duration-300 hover:border-accent hover:text-accent"
                >
                  PDF indir
                </a>
              ) : (
                <p className="mt-3 text-[0.92rem] text-fg-muted">
                  Bu kataloğun PDF&apos;ini e-posta ile gönderiyoruz — aşağıdaki
                  formu doldurmanız yeterli.
                </p>
              )}
            </div>
          </aside>
        </div>
      </section>

      <section className="section pt-0">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)] lg:gap-20">
          <SectionHeading
            no="01"
            eyebrow="PDF isteyin"
            lines={["Bu kataloğu", "gönderelim"]}
            description="Formu bırakın, PDF'i mesai saatleri içinde e-postanıza gönderelim."
          />

          <div className="reveal">
            <CatalogRequestForm defaultCatalog={catalog.slug} />
          </div>
        </div>
      </section>
    </>
  );
}
