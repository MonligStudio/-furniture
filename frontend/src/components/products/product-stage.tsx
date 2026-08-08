"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { lightMediaSrc } from "@/components/ui/media-frame";
import "./product-stage.css";

/**
 * Ürün detayının üst sahnesi: kenardan kenara, ekran boyunda TEK büyük
 * fotoğraf; sağında havada duran bilgi paneli; solda altta ileri/geri ve
 * küçük kareler.
 *
 * Kare değişiminde aynı anda yalnızca İKİ kare boyanıyor: bir önceki
 * (`prev`) altta durur, yeni kare (`active`) onun üstüne kenardan içeri
 * doğru açılır. Yön ileri/geri'ye göre değişiyor — geçiş `data-dir`
 * üzerinden saf CSS animasyonu (bkz. product-stage.css).
 *
 * `prev` başlangıçta `null`: ilk açılışta geçiş oynamasın, hero görseli
 * beklemeden görünsün.
 *
 * Panel içeriği `children` olarak geliyor: sahne istemci bileşeni ama
 * içindeki ürün metni sunucuda üretilmeye devam ediyor.
 */
export function ProductStage({
  images,
  alt,
  children,
}: {
  images: string[];
  alt: string;
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);

  const total = images.length;

  const show = (index: number, towards: 1 | -1) => {
    if (index === active) return;
    setDirection(towards);
    setPrevious(active);
    setActive(index);
  };

  const go = (towards: 1 | -1) =>
    show((active + towards + total) % total, towards);

  const roleOf = (i: number) => {
    if (i === active) return "active";
    if (i === previous) return "prev";
    return "idle";
  };

  return (
    <section className="media-layer pd-stage" data-parallax-scene="">
      <div className="pd-media">
        {images.map((image, i) => (
          <div
            key={image}
            className="pd-shot"
            data-role={roleOf(i)}
            /* Yalnızca gerçek bir geçişte animasyon çalışsın. */
            data-dir={i === active && previous !== null ? direction : undefined}
          >
            {/* Derinlik: kare scroll'la hafifçe kayıyor (media-scrub). */}
            <span className="depth-layer" data-depth={8}>
              <Image
                src={image}
                alt={i === 0 ? alt : ""}
                aria-hidden={i !== 0}
                fill
                priority={i === 0}
                /* Kareler üst üste duruyor ve geçiş anında hazır olmaları
                   gerekiyor, o yüzden hepsi `eager`. Ama ilk kare ekranı
                   kaplayan LCP karesi: diğerleri `low` önceliğe alınıp
                   onun bant genişliğini çalmıyor. */
                loading={i === 0 ? undefined : "eager"}
                fetchPriority={i === 0 ? "high" : "low"}
                sizes="100vw"
                className="theme-media-dark object-cover"
              />
              <Image
                src={lightMediaSrc(image)}
                alt=""
                aria-hidden
                fill
                priority={i === 0}
                /* Kareler üst üste duruyor ve geçiş anında hazır olmaları
                   gerekiyor, o yüzden hepsi `eager`. Ama ilk kare ekranı
                   kaplayan LCP karesi: diğerleri `low` önceliğe alınıp
                   onun bant genişliğini çalmıyor. */
                loading={i === 0 ? undefined : "eager"}
                fetchPriority={i === 0 ? "high" : "low"}
                sizes="100vw"
                className="theme-media-light object-cover"
              />
            </span>
          </div>
        ))}
      </div>

      <div className="pd-scrim" aria-hidden />

      <div className="shell pd-back">
        <Link
          href="/urunler"
          className="edge-note group inline-flex items-center gap-2 text-media-fg transition-opacity hover:opacity-70"
        >
          <ArrowLeft
            className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
            strokeWidth={1.5}
            aria-hidden
          />
          Tüm ürünler
        </Link>
      </div>

      {/* Panel, arkasındaki kareden ayrılsın diye ters yönde kayıyor
          (bkz. providers/media-scrub). CSS'teki `translate: 0 -50%` ayrı bir
          özellik, GSAP'ın yazdığı `transform` ile çakışmıyor. */}
      <div className="pd-panel" data-parallax={38}>
        {children}
      </div>

      {total > 1 ? (
        <div className="pd-nav">
          <button type="button" onClick={() => go(-1)} aria-label="Önceki görsel">
            <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Sonraki görsel">
            <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
          </button>

          <div className="pd-thumbs">
            {images.map((image, i) => (
              <button
                key={image}
                type="button"
                className="pd-thumb"
                /* Tıklanan kare soldaysa geriye, sağdaysa ileriye açılsın. */
                onClick={() => show(i, i > active ? 1 : -1)}
                data-active={i === active}
                aria-label={`${alt} görsel ${i + 1}`}
                aria-current={i === active}
              >
                <Image
                  src={image}
                  alt=""
                  aria-hidden
                  fill
                  sizes="80px"
                  className="theme-media-dark object-cover"
                />
                <Image
                  src={lightMediaSrc(image)}
                  alt=""
                  aria-hidden
                  fill
                  sizes="80px"
                  className="theme-media-light object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
