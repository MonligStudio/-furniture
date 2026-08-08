"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * DAİRESEL GALERİ — 3B halka üzerinde duran kartlar.
 *
 * Projeye uyarlanırken kaynaktan ayrılan yerler:
 *   - Kartlarda GÖRSEL YOK: halkada müşteri yorumları dönüyor (alıntı, ad,
 *     yer/ürün). `GalleryItem` de buna göre.
 *   - SCROLL DÖNDÜRMÜYOR. Kaynakta `window.scroll` halkayı çeviriyordu ve
 *     sayfa scroll'unu yiyordu; burada scroll sadece sayfayı kaydırır.
 *   - Halka kendi kendine yavaşça dönüyor; fareyle (ya da parmakla)
 *     tutulduğunda durup sürüklemeyi izliyor, bırakılınca savrulup
 *     yavaşlıyor ve kendi dönüşüne geri dönüyor.
 *   - Dokunmatikte `touch-action: pan-y`: yatay sürükleme halkayı çevirir,
 *     dikey hareket sayfayı kaydırmaya devam eder.
 *   - Renk/tipografi shadcn token'ları yerine projenin token'ları.
 *
 * Dönüş React state'i DEĞİL doğrudan DOM üzerinden sürülüyor: her karede
 * yeniden render etmek 60fps'te gereksiz uzlaştırma demekti.
 */
export type GalleryItem = {
  quote: string;
  name: string;
  detail: string;
};

/** Piksel başına dönüş açısı — sürükleme hızı. */
const DEG_PER_PX = 0.22;
/** Bırakıldıktan sonraki savrulmanın sönümü (1'e yakın = uzun sürer). */
const FRICTION = 0.93;
/** Savrulmanın kendi kendine dönüşe bırakıldığı eşik. */
const SETTLE = 0.03;

export function CircularGallery({
  items,
  radius = 380,
  autoRotateSpeed = 0.12,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  items: GalleryItem[];
  /** Kartların merkezden uzaklığı. */
  radius?: number;
  /** Kendi kendine dönerken kare başına derece. */
  autoRotateSpeed?: number;
}) {
  const [grabbing, setGrabbing] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);
  const dragRef = useRef<{ id: number; x: number } | null>(null);
  const velocityRef = useRef(0);

  const anglePerItem = 360 / items.length;

  /** Halkayı ve kart saydamlıklarını doğrudan DOM'a yazar. */
  const render = useCallback(() => {
    const ring = ringRef.current;
    if (!ring) return;

    const deg = rotationRef.current;
    ring.style.transform = `rotateY(${deg}deg)`;

    const cards = ring.children;
    for (let i = 0; i < cards.length; i += 1) {
      const relative = (i * anglePerItem + (deg % 360) + 360) % 360;
      const normalized = Math.abs(
        relative > 180 ? 360 - relative : relative,
      );
      /* Arkaya dönen kart sönükleşir — öndeki hep en okunur olan. */
      (cards[i] as HTMLElement).style.opacity = String(
        Math.max(0.16, 1 - normalized / 150),
      );
    }
  }, [anglePerItem]);

  /**
   * Tek bir kare döngüsü: sürükleme yokken önce savrulmayı söndürür,
   * sonra kendi kendine dönmeye devam eder.
   *
   * Döngü YALNIZCA halka ekrandayken çalışıyor. Sürekli açık bırakıldığında
   * her karede halkanın transform'u ve bütün kartların opaklığı yeniden
   * yazılıyordu — sayfanın on ekran yukarısında, kimse görmezken bile.
   * Scroll ederken bu, kare bütçesinden bedava alınan bir paydı.
   */
  useEffect(() => {
    render();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = rootRef.current;
    let frame = 0;

    const tick = () => {
      if (!dragRef.current) {
        if (Math.abs(velocityRef.current) > SETTLE) {
          velocityRef.current *= FRICTION;
          rotationRef.current += velocityRef.current;
        } else {
          velocityRef.current = 0;
          rotationRef.current += autoRotateSpeed;
        }
        render();
      }
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame) return;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (!frame) return;
      cancelAnimationFrame(frame);
      frame = 0;
    };

    let onScreen = true;
    const sync = () => (onScreen && !document.hidden ? start() : stop());

    let observer: IntersectionObserver | undefined;
    if (root) {
      observer = new IntersectionObserver(
        ([entry]) => {
          onScreen = entry.isIntersecting;
          sync();
        },
        { threshold: 0 },
      );
      observer.observe(root);
    }

    document.addEventListener("visibilitychange", sync);
    start();

    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", sync);
      stop();
    };
  }, [autoRotateSpeed, render]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = { id: event.pointerId, x: event.clientX };
    velocityRef.current = 0;
    setGrabbing(true);
    /* Yakalama başarısız olursa (bazı tarayıcı/giriş kombinasyonları)
       sürükleme yine de çalışsın. */
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* yok sayılır */
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    const delta = (event.clientX - drag.x) * DEG_PER_PX;
    drag.x = event.clientX;
    velocityRef.current = delta;
    rotationRef.current += delta;
    /* Sürüklerken karesini bekletmeden çiz — parmağa yapışık dursun. */
    render();
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    /* Bırakıldı: kare döngüsü savrulmayı söndürüp kendi dönüşüne döner. */
    dragRef.current = null;
    setGrabbing(false);
  };

  /** Klavye ile de çevrilebilsin. */
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      rotationRef.current += anglePerItem;
      render();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      rotationRef.current -= anglePerItem;
      render();
    }
  };

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label="Müşteri yorumları — sürükleyerek çevirin"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
      className={cn(
        "relative flex h-full w-full touch-pan-y items-center justify-center select-none focus:outline-none",
        grabbing ? "cursor-grabbing" : "cursor-grab",
        className,
      )}
      style={{ perspective: "2000px" }}
      {...props}
    >
      <div
        ref={ringRef}
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {items.map((item, i) => (
          <figure
            key={item.name}
            className="absolute top-1/2 left-1/2 -mt-[11rem] -ml-[10.5rem] h-[22rem] w-[21rem]"
            style={{
              transform: `rotateY(${i * anglePerItem}deg) translateZ(${radius}px)`,
            }}
          >
            <div className="card hairline-top flex h-full flex-col justify-between gap-6 p-8">
              <blockquote className="font-display text-[1.05rem] leading-[1.45] text-fg">
                “{item.quote}”
              </blockquote>
              <figcaption className="flex flex-col gap-1">
                <span className="font-display text-[1rem] text-accent">
                  {item.name}
                </span>
                <span className="edge-note text-fg-faint">{item.detail}</span>
              </figcaption>
            </div>
          </figure>
        ))}
      </div>
    </div>
  );
}
