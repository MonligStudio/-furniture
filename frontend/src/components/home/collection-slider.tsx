"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import "./collection-slider.css";

gsap.registerPlugin(useGSAP);

export type SlideItem = {
  id: string;
  title: string;
  meta: string;
  href: string;
  image: string;
  lightImage?: string;
};

const FULL_CLIP = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

/**
 * MODÜLER SLIDER — koleksiyonlar bölümü.
 * Kaynak etkileşim: "modular-slider" demosu; React'e ve tema token'larına
 * uyarlandı.
 *
 * Kurgu: ortada iki banda bölünmüş görsel kutusu, arkasında yatay kayan
 * başlık şeridi (aynı anda üç başlık görünür, ortadaki etkin). Slayt
 * değişince yeni görsel her iki banda da eklenip sağdan sola açılan bir
 * maskeyle ve `scale(2) → scale(1)` ile giriyor.
 *
 * SONSUZ DÖNGÜ: başlık şeridi `[son, ...koleksiyonlar, ilk]` olarak
 * basılıyor. Uçlara gelindiğinde geçiş bittikten sonra eşdeğer başlığa
 * animasyonsuz atlanıyor — kullanıcı sıçramayı görmüyor.
 *
 * GÖRSELE TIKLAMA = koleksiyon sayfasına giriş: kare olduğu yerden dört
 * yana doğru büyüyüp ekranı kaplar, üstünde koleksiyon adı ve ürün sayısı
 * ortada durur, sonra sayfaya geçilir. İleri/geri için ok düğmeleri ve
 * başlıklar var.
 */
export function CollectionSlider({ items }: { items: SlideItem[] }) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  /* Geçiş sürerken yeni tıklamalar kuyruğa girmesin. */
  const busy = useRef(false);
  /* Sayfaya geçiş başladıysa slider'a bir daha dokunulmaz. */
  const leaving = useRef(false);

  const total = items.length;
  /* Şerit: [sonuncu, ...hepsi, ilk] — uçlarda boşluk kalmasın.
     `useMemo`: `go` bu diziye bağlı, her render'da yeniden üretilirse
     callback de boşuna yenilenir. */
  const strip = useMemo(
    () => [items[items.length - 1], ...items, items[0]],
    [items],
  );
  /* Etkin başlığın şerit içindeki sırası; 1 = ilk gerçek koleksiyon. */
  const [index, setIndex] = useState(1);

  const active = items[(index - 1 + total) % total];

  /** Şeridin bir adımlık kaydırma yüzdesi. */
  const step = 100 / strip.length;

  /** Tema başına iki kare: koyu ve aydınlık sürüm (bkz. .theme-media-*). */
  const makeFrames = (host: HTMLElement | null, item: SlideItem) => {
    if (!host) return [];
    const dark = document.createElement("img");
    dark.src = item.image;
    dark.alt = "";
    dark.loading = "lazy";
    dark.className = "theme-media-dark";

    const light = document.createElement("img");
    light.src = item.lightImage ?? item.image;
    light.alt = "";
    light.loading = "lazy";
    light.className = "theme-media-light";

    host.append(dark, light);
    return [dark, light];
  };

  /** Yeni kareyi iki banda da ekleyip maskeyle açar. */
  const pushImage = useCallback((item: SlideItem, animate: boolean) => {
    const created = [
      ...makeFrames(topRef.current, item),
      ...makeFrames(bottomRef.current, item),
    ];
    if (created.length === 0) return;

    if (!animate) {
      gsap.set(created, { clipPath: FULL_CLIP });
      return;
    }

    gsap.fromTo(
      created,
      {
        clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
        scale: 2,
      },
      {
        clipPath: FULL_CLIP,
        scale: 1,
        duration: 1.6,
        ease: "power4.out",
        /* Üst ve alt bant arasındaki küçük gecikme (her bantta 2 kare). */
        stagger: { each: 0.15, grid: [2, 2], axis: "y" },
        onComplete: () => {
          /* Yığılan eski kareler bellekte durmasın: bant başına son 2 slayt. */
          for (const host of [topRef.current, bottomRef.current]) {
            if (!host) continue;
            const all = Array.from(host.querySelectorAll("img"));
            all.slice(0, Math.max(0, all.length - 4)).forEach((el) => el.remove());
          }
        },
      },
    );
  }, []);

  const go = useCallback(
    (direction: 1 | -1) => {
      if (busy.current || leaving.current) return;
      const strip_ = stripRef.current;
      if (!strip_) return;

      const next = index + direction;
      const item = strip[next];
      if (!item) return;

      busy.current = true;
      setIndex(next);
      pushImage(item, true);

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      gsap.to(strip_, {
        xPercent: -(next - 1) * step,
        duration: reduced ? 0 : 1.6,
        ease: "power4.out",
        onComplete: () => {
          /* Uçtaki kopyadan eşdeğer gerçek başlığa sessizce atla. */
          let settled = next;
          if (next === strip.length - 1) settled = 1;
          else if (next === 0) settled = total;

          if (settled !== next) {
            setIndex(settled);
            gsap.set(strip_, { xPercent: -(settled - 1) * step });
          }
          busy.current = false;
        },
      });
    },
    [index, pushImage, step, strip, total],
  );

  /**
   * Koleksiyon sayfasına giriş.
   *
   * Kare, gövdeye eklenen sabit (fixed) bir kopyayla DÖRT YANA doğru
   * büyüyerek ekranı kaplar. Kopya gövdeye ekleniyor çünkü slider'ın
   * üstündeki katmanlarda `overflow: hidden` ve `will-change: transform`
   * var — `position: fixed` bir çocuk oralarda kırpılır, tam ekrana
   * açılamazdı.
   *
   * Maske (clip-path) animasyonu YOK: iki bandın tek kareye birleşmesi
   * dönme/eğilme gibi okunuyordu. Kopya baştan düz bir dikdörtgen; iki
   * bantlı hâlin üstüne kısa bir kararmayla biniyor, sonra sadece büyüyor.
   *
   * Büyürken koleksiyon adı ve ürün sayısı kopyanın tam ortasında duruyor
   * (`.ms-flip-cap`) — şeritteki başlık aynı noktada sönerken bu açılıyor.
   *
   * Hedef sayfanın hero'su AYNI görseli tam genişlikte gösteriyor
   * (bkz. `collections/collection-hero.tsx`), o yüzden kopya gezinmeden
   * kısa süre sonra söndürülüyor — geçiş kesintisiz görünüyor.
   */
  const enter = useCallback(() => {
    if (leaving.current) return;
    const stage = stageRef.current;
    const href = active.href;

    if (
      !stage ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      router.push(href);
      return;
    }

    leaving.current = true;

    const rect = stage.getBoundingClientRect();
    const overlay = document.createElement("div");
    overlay.className = "ms-flip";
    overlay.style.top = `${rect.top}px`;
    overlay.style.left = `${rect.left}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
    makeFrames(overlay, active);

    /* Görselin üstündeki bilgi: koleksiyon adı + kaç ürün olduğu. */
    const scrim = document.createElement("div");
    scrim.className = "ms-flip-scrim";

    const cap = document.createElement("div");
    cap.className = "ms-flip-cap";
    const capTitle = document.createElement("span");
    capTitle.className = "ms-flip-title";
    capTitle.textContent = active.title;
    const capMeta = document.createElement("span");
    capMeta.className = "ms-flip-meta";
    capMeta.textContent = `Koleksiyon · ${active.meta}`;
    cap.append(capTitle, capMeta);

    overlay.append(scrim, cap);
    document.body.appendChild(overlay);

    let navigated = false;
    const go_ = () => {
      if (navigated) return;
      navigated = true;
      router.push(href);
      /* Hedef sayfa boyanana kadar kopya ekranda kalsın, sonra sönsün. */
      window.setTimeout(() => {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.4,
          onComplete: () => overlay.remove(),
        });
      }, 420);
    };
    /* Animasyon herhangi bir sebeple bitmezse de sayfaya geçilir. */
    window.setTimeout(go_, 1100);

    gsap
      .timeline({ onComplete: go_ })
      /* Bantlı hâlden düz kareye geçiş: maske değil, kısa bir kararma. */
      .fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0)
      .to(stage, { opacity: 0, duration: 0.2 }, 0.12)
      /* Asıl hareket: dört yana doğru büyüyüp ekranı kaplar. */
      .to(
        overlay,
        {
          top: 0,
          left: 0,
          width: document.documentElement.clientWidth,
          height: window.innerHeight,
          duration: 0.95,
          ease: "power3.inOut",
        },
        0,
      )
      .to(
        [stripRef.current, barRef.current],
        { opacity: 0, duration: 0.3, ease: "power2.out" },
        0,
      )
      .fromTo(
        cap,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.75, ease: "power3.out" },
        0.08,
      );
  }, [active, router]);

  /* Bileşen sökülürse ekranda asılı kalan kopya kalmasın. */
  useEffect(
    () => () => {
      document.querySelectorAll(".ms-flip").forEach((el) => el.remove());
    },
    [],
  );

  /* Açılışta ilk kareyi bas ve şeridi doğru yere kur. */
  useGSAP(
    () => {
      /* Yalnızca mount'ta çalışır (useGSAP varsayılan bağımlılığı boş). */
      gsap.set(stripRef.current, { xPercent: -(index - 1) * step });
      pushImage(items[0], false);
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef}>
      <div
        className="ms"
        style={{ "--ms-count": strip.length } as React.CSSProperties}
      >
        {/* Görsel kutusu — tıklayınca koleksiyon sayfasına açılır */}
        <div
          ref={stageRef}
          className="ms-stage"
          role="link"
          tabIndex={0}
          aria-label={`${active.title} koleksiyonunu aç`}
          onClick={enter}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              go(-1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              go(1);
            } else if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              enter();
            }
          }}
        >
          <div ref={topRef} className="ms-half --top" aria-hidden />
          <div ref={bottomRef} className="ms-half --bottom" aria-hidden />
          <span className="ms-cue">Koleksiyonu aç</span>
        </div>

        {/* Yatay kayan başlık şeridi */}
        <div ref={stripRef} className="ms-titles">
          {strip.map((item, i) => (
            <button
              key={`${item.id}-${i}`}
              type="button"
              className="ms-title"
              data-active={i === index}
              tabIndex={-1}
              aria-hidden={i !== index}
              onClick={() => {
                if (i === index) return;
                go(i > index ? 1 : -1);
              }}
            >
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Alt satır: sayaç, etkin koleksiyona bağlantı, ileri/geri */}
      <div ref={barRef} className="ms-bar">
        <span className="edge-note text-fg-faint">
          {String(((index - 1 + total) % total) + 1).padStart(2, "0")} /{" "}
          {String(total).padStart(2, "0")} · {active.meta}
        </span>

        <Link
          href={active.href}
          className="edge-note group inline-flex items-center gap-3 border-b border-line pb-1.5 text-fg transition-colors duration-300 hover:border-accent hover:text-accent"
        >
          {active.title}
          <ArrowUpRight
            className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={1.5}
            aria-hidden
          />
        </Link>

        <div className="ms-nav">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Önceki koleksiyon"
          >
            <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Sonraki koleksiyon"
          >
            <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
          </button>
        </div>
      </div>

      {/* Slider JS'e bağlı; koleksiyonların tamamı taranabilir kalsın. */}
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item.id}>
            <Link href={item.href}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
