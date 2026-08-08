"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { hero } from "@/content/home";
import { site } from "@/content/site";

/**
 * Anasayfa hero'su — TAM EKRAN VİDEO, ORTALANMIŞ metin.
 *
 * Yazı bilinçli olarak küçük tutuldu: ekranı kaplayan görüntünün üstünde
 * asıl işi görüntü yapıyor, metin onu bastırmıyor. Header'daki ortalanmış
 * kelime işaretiyle de aynı eksende duruyor.
 *
 * Video sessiz, döngülü ve `playsInline`. Üstünde iki katman var:
 * `scrim-hero` (okunabilirlik perdesi) ve `media-layer` (görsel üstü
 * arayüz token'larını yönetir).
 *
 * Koyu ve açık tema, aynı sabit slayt kurgusunun ayrı renk düzenlerini
 * kullanır.
 *
 * OYNATMA JS'TEN YÖNETİLİYOR — `autoPlay` ile değil. İki 1080p video
 * birden `autoPlay` olduğunda ikisi de sürekli çözülüyordu: tema
 * seçilmediği için biri `visibility: hidden`, ama gizli video da kare
 * çözmeye devam ediyor (ölçüldü: gizli olan da onlarca kare çözmüştü) ve
 * bu, sayfanın EN ALTINDA bile sürüp giden bir yük demek. Şimdi yalnızca
 * seçili temanın videosu, yalnızca hero görünür alandayken oynuyor.
 */
export function HeroVideo() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const videos = Array.from(root.querySelectorAll<HTMLVideoElement>("video"));
    /* Hero görünür alandan çıkınca oynatmaya devam etmenin anlamı yok. */
    let onScreen = true;

    const sync = () => {
      const theme =
        document.documentElement.dataset.theme === "light" ? "light" : "dark";

      for (const video of videos) {
        const wanted = onScreen && !document.hidden && video.dataset.theme === theme;
        if (wanted) {
          /* Otomatik oynatma engellenirse poster kalır — sorun değil. */
          void video.play().catch(() => {});
        } else if (!video.paused) {
          video.pause();
        }
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    observer.observe(root);

    /* Tema `data-theme` özniteliğinden okunuyor: next-themes'in kendi
       kancasına bağlanmak, sunucuda basılan işaretlemeyi de istemciye
       taşımak demekti. */
    const themeWatcher = new MutationObserver(sync);
    themeWatcher.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      observer.disconnect();
      themeWatcher.disconnect();
      document.removeEventListener("visibilitychange", sync);
      for (const video of videos) video.pause();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="hero-theme-layer media-layer relative h-[100svh] min-h-[34rem] w-full overflow-hidden"
      /* Üstteki yazının derinlik hareketi bu bölüme göre ölçülüyor. */
      data-parallax-scene=""
    >
      {/* Görüntü, sayfadan geride kalacak şekilde yavaşça kayıyor
          (bkz. providers/media-scrub). Pay burada daha dar: 100svh'lik bir
          videoyu %32 büyütmek boşuna piksel demekti. */}
      <span
        className="depth-layer"
        data-depth={6}
        style={{ "--depth-inset": "9%" } as React.CSSProperties}
      >
        <video
          className="theme-media-dark"
          data-theme="dark"
          muted
          loop
          playsInline
          preload="metadata"
          poster="/video/hero-poster-dark-static.webp"
          aria-hidden
        >
          <source src="/video/hero-dark-static.mp4" type="video/mp4" />
        </video>

        <video
          className="theme-media-light"
          data-theme="light"
          muted
          loop
          playsInline
          preload="metadata"
          poster="/video/hero-poster-light-day.webp"
          aria-hidden
        >
          <source src="/video/hero-light-day-static.mp4" type="video/mp4" />
        </video>
      </span>

      <div className="scrim-hero absolute inset-0" aria-hidden />

      <div className="relative z-10 flex h-full items-center justify-center">
        {/* Yazı görüntünün TERSİ yönde ve daha hızlı gidiyor: görüntü
            geride kalırken metin öne çıkıyor. */}
        <div className="shell flex flex-col items-center text-center" data-parallax={70}>
          <span className="chapter">
            <b>{site.founded}</b>
            {hero.eyebrow}
          </span>

          <h1 className="display mt-7 max-w-[16ch] text-[clamp(1.8rem,4.6vw,3.6rem)]">
            {hero.lines.map((line, i) => (
              <span
                key={line}
                className="roll"
                style={
                  { "--roll-delay": `${180 + i * 130}ms` } as React.CSSProperties
                }
              >
                <span>{line}</span>
              </span>
            ))}
          </h1>

          <p className="edge-note mt-7 text-fg-muted">{hero.claim}</p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
            <Link
              href="/urunler"
              className="no-halo inline-flex h-11 items-center bg-fg px-6 font-label text-[0.62rem] tracking-[0.22em] text-ink-950 uppercase transition-opacity duration-300 hover:opacity-80"
            >
              Koleksiyonu gör
            </Link>
            <Link
              href="/katalog"
              className="inline-flex h-11 items-center border border-fg/70 bg-ink-950/10 px-6 font-label text-[0.62rem] tracking-[0.22em] text-fg uppercase transition-colors duration-300 hover:border-fg hover:bg-fg/10"
            >
              Dijital katalog
            </Link>
          </div>
        </div>
      </div>

      {/* Kaydırma işareti */}
      <div className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex justify-center">
        <span className="scroll-hint edge-note flex flex-col items-center gap-1.5 text-fg-muted">
          <ArrowDown className="size-3.5" strokeWidth={1.5} aria-hidden />
          {hero.scrollHint}
        </span>
      </div>
    </section>
  );
}
