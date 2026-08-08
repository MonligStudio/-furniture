import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { lightMediaSrc } from "@/components/ui/media-frame";
import { site } from "@/content/site";
import "./collection-hero.css";

/**
 * Koleksiyon sayfasının TAM EKRAN hero'su.
 *
 * Anasayfadaki slider'da tıklanan kare ekranı kaplayacak şekilde büyüyor
 * ve burada öyle KALIYOR (bkz. `home/collection-slider.tsx` → `enter`).
 * Geçişin kesintisiz görünmesi için:
 *   - görsel AYNI dosya, aynı kadraj (`object-cover`, ortalanmış),
 *   - karartma `.ch-scrim` ile `.ms-flip-scrim` birebir aynı,
 *   - başlık + "KOLEKSİYON · N ÜRÜN" satırı ekranın tam ortasında, büyüyen
 *     kopyadakiyle aynı boyda — yani geçiş bitince yeni bir yazı belirmiyor.
 *
 * Koleksiyonun özeti ve künyesi (eskiden sayfanın altındaki "01 — Bu
 * koleksiyon hakkında" bölümü) sadeleşmiş hâliyle görselin üstünde duruyor;
 * geçiş bittikten sonra soldan ve sağdan yavaşça giriyor.
 *
 * `MediaFrame` kullanılmıyor: orada görsel `.media-scrub` katmanında
 * çerçeveden taşkın duruyor, o kayma hero'da geçişi bozardı.
 */
export function CollectionHero({
  image,
  title,
  eyebrow,
  count,
  summary,
}: {
  image: string;
  title: string;
  eyebrow: string;
  count: number;
  summary: string;
}) {
  return (
    /* Görselin KENDİSİ kaymıyor (slider'dan büyüyen kopyanın devri bozulur);
       derinliği, üstündeki yazının scroll'a bağlı hareketi veriyor. */
    <section className="media-layer ch" data-parallax-scene="">
      <Image
        src={image}
        alt={title}
        fill
        priority
        sizes="100vw"
        className="theme-media-dark object-cover"
      />
      <Image
        src={lightMediaSrc(image)}
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="theme-media-light object-cover"
      />

      <div className="ch-scrim" aria-hidden />

      {/* Büyüyen karenin yazısı — aynı yerde, aynı boyda kalıyor.
          Sayfa açıldığı an (scroll 0) hareket tam ORTA noktada, yani
          y = 0: kopyanın devri bundan etkilenmiyor. */}
      <div className="ch-cap" data-parallax={64}>
        <h1 className="ch-title">{title}</h1>
        <span className="ch-meta">
          {eyebrow} · {count} ürün
        </span>
      </div>

      {/* Görselin üstündeki bilgiler: geçiş bitince yerden çıkar gibi
          alttan yükselir (maskeli — bkz. `.ch-rise`). */}
      <div className="ch-foot">
        <div className="shell ch-grid">
          <div className="ch-rise ch-rise--1">
            <div className="ch-rise__in">
              <span className="chapter">
                <b>01</b>
                Bu koleksiyon hakkında
              </span>

              <p className="mt-4 max-w-lg text-[0.98rem] text-media-fg-muted">
                {summary}
              </p>

              <a
                href={site.contact.phoneHref}
                className="edge-note group mt-5 inline-flex w-fit items-center gap-3 border-b border-media-fg/30 pb-1.5 text-media-fg transition-colors duration-300 hover:border-media-fg"
              >
                {site.contact.phone}
                <ArrowUpRight
                  className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </a>
            </div>
          </div>

          <div className="ch-rise ch-rise--2">
            <dl className="ch-rise__in ch-specs">
              <div>
                <dt>Ürün</dt>
                <dd>{count}</dd>
              </div>
              <div>
                <dt>Üretim</dt>
                <dd>İnegöl</dd>
              </div>
              <div>
                <dt>Özel ölçü</dt>
                <dd>Var</dd>
              </div>
              <div>
                <dt>Montaj</dt>
                <dd>Ücretsiz</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
