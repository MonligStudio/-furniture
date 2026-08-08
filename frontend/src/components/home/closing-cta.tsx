import Link from "next/link";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { site } from "@/content/site";

/** 11 — Kapanış çağrısı: mağazaya davet. */
export function ClosingCta() {
  return (
    <section className="section">
      <div className="shell">
        <div className="reveal flex flex-col items-center gap-10 border-y border-line py-[clamp(3.5rem,8vw,6rem)] text-center">
          <span className="chapter">
            <b>11</b>
            Buyurun, oturun
          </span>

          <h2 className="display max-w-4xl text-[clamp(2rem,4.6vw,3.6rem)]">
            <span className="line-mask">
              <span>Bir koltuğa</span>
            </span>
            <span
              className="line-mask"
              style={{ "--reveal-delay": "90ms" } as React.CSSProperties}
            >
              <span>oturmadan</span>
            </span>
            <span
              className="line-mask"
              style={{ "--reveal-delay": "180ms" } as React.CSSProperties}
            >
              <span>karar vermeyin</span>
            </span>
          </h2>

          <p className="max-w-xl text-fg-muted">
            Showroom&apos;da koleksiyonun tamamı sergileniyor. Randevu gerekmiyor;
            gelin, oturun, kumaşa dokunun. Ölçü için de Adana içinde ücretsiz
            geliyoruz.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={site.contact.phoneHref}
              className="inline-flex h-12 items-center gap-2 rounded-none bg-accent px-7 font-label text-[0.7rem] tracking-[0.18em] text-ink-950 uppercase transition-colors duration-300 hover:bg-accent-soft"
            >
              <Phone className="size-4" strokeWidth={1.5} aria-hidden />
              {site.contact.phone}
            </a>

            <a
              href={site.contact.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-none border border-line-strong px-7 font-label text-[0.7rem] tracking-[0.18em] text-fg uppercase transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              <MapPin className="size-4" strokeWidth={1.5} aria-hidden />
              Yol tarifi
            </a>

            <Link
              href="/iletisim"
              className="edge-note group inline-flex items-center gap-3 border-b border-line pb-2 text-fg transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              Mesaj bırakın
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.5}
                aria-hidden
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
