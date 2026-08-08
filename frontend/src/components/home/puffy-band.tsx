import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MediaFrame } from "@/components/ui/media-frame";

/** 06 — Puffy yetkili satış noktası bandı. */
export function PuffyBand() {
  return (
    <section className="section">
      <div className="shell">
        <div className="reveal grid items-center gap-10 rounded-[var(--radius-card)] border border-line p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16">
          <div>
            <span className="chapter">
              <b>06</b>
              Yetkili satış noktası
            </span>

            <h2 className="display mt-6 text-[clamp(1.6rem,3.4vw,2.6rem)]">
              <span className="line-mask">
                <span>Puffy yatak</span>
              </span>
              <span
                className="line-mask"
                style={{ "--reveal-delay": "90ms" } as React.CSSProperties}
              >
                <span>Escudo&apos;da</span>
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-fg-muted">
              Yatak, ekrandan seçilecek bir ürün değil. Puffy yetkili satış
              noktası olarak farklı sertlik seviyelerini mağazadaki deneme
              alanında yan yana karşılaştırabilir, baza ve başlığı salon
              takımınızın kumaşıyla eşleştirebilirsiniz.
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Bağımsız paket yay sistemi",
                "Ortopedik destek katmanı",
                "Sandıklı baza seçeneği",
                "Mağazada deneme alanı",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[0.95rem] text-fg-muted"
                >
                  <span
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="/koleksiyon/yatak-baza"
              className="edge-note group mt-10 inline-flex items-center gap-3 border-b border-line pb-2 text-fg transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              Yatak & baza koleksiyonu
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.5}
                aria-hidden
              />
            </Link>
          </div>

          <MediaFrame
            src="/products-dark/puffy-ortopedik-yatak.webp"
            alt="Puffy ortopedik yatak"
            ratio="4/3"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        </div>
      </div>
    </section>
  );
}
