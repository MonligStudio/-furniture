"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./flowing-menu.css";

/**
 * FLOWING MENU — React Bits (JavaScript + CSS varyantı).
 *
 * Projeye uyarlanırken değişenler:
 *   - TypeScript'e çevrildi.
 *   - `<a>` yerine `next/link`: satırlar site içi rotalara gidiyor, tam
 *     sayfa yeniden yükleme olmasın.
 *   - Renkler sabit hex yerine tema değişkeni ("var(--color-fg)" gibi)
 *     alıyor — site iki temalı, sabit renk aydınlık temada kırılırdı.
 *   - Marquee görseli iki temaya ayrı: kare `--img-dark` / `--img-light`
 *     değişkenlerini alıyor, tema seçimini CSS yapıyor.
 *   - `window.innerWidth` yerine `document.documentElement.clientWidth`:
 *     gömülü/arka plandaki panellerde `innerWidth` 0 dönebiliyor.
 *   - Satırın sağında küçük bir not (`note`) gösterilebiliyor — ürün sayısı.
 *   - CSS sınıf adları korundu ama hepsi `.menu-wrap` altına alındı
 *     (`.menu`, `.marquee` gibi genel adlar global stile sızmasın).
 */
export type FlowingMenuItem = {
  link: string;
  text: string;
  image: string;
  lightImage?: string;
  note?: string;
};

type MenuColors = {
  speed: number;
  textColor: string;
  marqueeBgColor: string;
  marqueeTextColor: string;
  borderColor: string;
};

export function FlowingMenu({
  items = [],
  speed = 15,
  textColor = "var(--color-fg)",
  bgColor = "transparent",
  marqueeBgColor = "var(--color-fg)",
  marqueeTextColor = "var(--color-ink-950)",
  borderColor = "var(--color-line)",
}: {
  items?: FlowingMenuItem[];
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
}) {
  return (
    <div className="menu-wrap" style={{ backgroundColor: bgColor }}>
      <nav className="menu">
        {items.map((item) => (
          <MenuItem
            key={item.link}
            {...item}
            speed={speed}
            textColor={textColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            borderColor={borderColor}
          />
        ))}
      </nav>
    </div>
  );
}

function MenuItem({
  link,
  text,
  image,
  lightImage,
  note,
  speed,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
}: FlowingMenuItem & MenuColors) {
  const itemRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const [repetitions, setRepetitions] = useState(4);

  const animationDefaults = { duration: 0.6, ease: "expo" };

  const distMetric = (x: number, y: number, x2: number, y2: number) => {
    const xDiff = x - x2;
    const yDiff = y - y2;
    return xDiff * xDiff + yDiff * yDiff;
  };

  /** İmlecin hangi kenardan girdiği: şerit oradan sürülüp oraya çekilir. */
  const findClosestEdge = (
    mouseX: number,
    mouseY: number,
    width: number,
    height: number,
  ) => {
    const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0);
    const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height);
    return topEdgeDist < bottomEdgeDist ? "top" : "bottom";
  };

  /* Şeridin kesintisiz dönmesi için içerik kaç kez tekrarlanmalı. */
  useEffect(() => {
    const calculateRepetitions = () => {
      const content =
        marqueeInnerRef.current?.querySelector<HTMLElement>(".marquee__part");
      if (!content) return;

      const contentWidth = content.offsetWidth;
      if (contentWidth === 0) return;

      /* `innerWidth` gömülü panellerde 0 dönebiliyor; clientWidth güvenli. */
      const viewportWidth = document.documentElement.clientWidth;
      const needed = Math.ceil(viewportWidth / contentWidth) + 2;
      setRepetitions(Math.max(4, needed));
    };

    calculateRepetitions();
    window.addEventListener("resize", calculateRepetitions);
    return () => window.removeEventListener("resize", calculateRepetitions);
  }, [text, image]);

  useEffect(() => {
    const setupMarquee = () => {
      const content =
        marqueeInnerRef.current?.querySelector<HTMLElement>(".marquee__part");
      if (!content || !marqueeInnerRef.current) return;

      const contentWidth = content.offsetWidth;
      if (contentWidth === 0) return;

      animationRef.current?.kill();

      /* Tam bir içerik genişliği kadar kaydır — döngü dikişsiz olsun. */
      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -contentWidth,
        duration: speed,
        ease: "none",
        repeat: -1,
      });
    };

    /* Tekrar sayısı değiştikten sonra DOM'un oturmasını bekle. */
    const timer = window.setTimeout(setupMarquee, 50);

    return () => {
      window.clearTimeout(timer);
      animationRef.current?.kill();
    };
  }, [text, image, repetitions, speed]);

  const slide = (event: React.MouseEvent, leaving: boolean) => {
    const item = itemRef.current;
    const marquee = marqueeRef.current;
    const inner = marqueeInnerRef.current;
    if (!item || !marquee || !inner) return;

    const rect = item.getBoundingClientRect();
    const edge = findClosestEdge(
      event.clientX - rect.left,
      event.clientY - rect.top,
      rect.width,
      rect.height,
    );
    const out = edge === "top" ? "-101%" : "101%";
    const innerOut = edge === "top" ? "101%" : "-101%";

    const tl = gsap.timeline({ defaults: animationDefaults });
    if (leaving) {
      tl.to(marquee, { y: out }, 0).to(inner, { y: innerOut }, 0);
    } else {
      tl.set(marquee, { y: out }, 0)
        .set(inner, { y: innerOut }, 0)
        .to([marquee, inner], { y: "0%" }, 0);
    }
  };

  return (
    <div className="menu__item" ref={itemRef} style={{ borderColor }}>
      <Link
        className="menu__item-link"
        href={link}
        onMouseEnter={(event) => slide(event, false)}
        onMouseLeave={(event) => slide(event, true)}
        style={{ color: textColor }}
      >
        {text}
        {note ? <span className="menu__item-note">{note}</span> : null}
      </Link>

      <div
        className="marquee"
        ref={marqueeRef}
        style={{ backgroundColor: marqueeBgColor }}
        aria-hidden
      >
        <div className="marquee__inner-wrap">
          <div className="marquee__inner" ref={marqueeInnerRef}>
            {Array.from({ length: repetitions }).map((_, idx) => (
              <div
                className="marquee__part"
                key={idx}
                style={{ color: marqueeTextColor }}
              >
                <span>{text}</span>
                <div
                  className="marquee__img"
                  style={
                    {
                      "--img-dark": `url(${image})`,
                      "--img-light": `url(${lightImage ?? image})`,
                    } as React.CSSProperties
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
