import Link from "next/link";
import { site } from "@/content/site";

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] items-center pt-32">
      <div className="shell">
        <span className="chapter">
          <b>404</b>
          Sayfa bulunamadı
        </span>

        <h1 className="display mt-6 text-[clamp(2.2rem,6vw,4.5rem)]">
          <span className="roll">
            <span>Aradığınız</span>
          </span>
          <span
            className="roll"
            style={{ "--roll-delay": "120ms" } as React.CSSProperties}
          >
            <span>sayfa yok</span>
          </span>
        </h1>

        <p className="mt-8 max-w-lg text-fg-muted">
          Bağlantı taşınmış ya da hiç var olmamış olabilir. Koleksiyona dönebilir
          veya doğrudan mağazayı arayabilirsiniz.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex h-12 items-center rounded-none bg-accent px-7 font-label text-[0.7rem] tracking-[0.18em] text-ink-950 uppercase transition-colors duration-300 hover:bg-accent-soft"
          >
            Anasayfa
          </Link>
          <Link
            href="/urunler"
            className="inline-flex h-12 items-center rounded-none border border-line-strong px-7 font-label text-[0.7rem] tracking-[0.18em] text-fg uppercase transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            Ürünler
          </Link>
          <a
            href={site.contact.phoneHref}
            className="inline-flex h-12 items-center rounded-none border border-line px-7 font-label text-[0.7rem] tracking-[0.18em] text-fg-muted uppercase transition-colors duration-300 hover:text-fg"
          >
            {site.contact.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
