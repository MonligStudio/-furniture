"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Lenis + GSAP ScrollTrigger entegrasyonu (kanonik kurulum).
 * Lenis kendi rAF'ını değil GSAP ticker'ını kullanır; böylece scroll'a bağlı
 * animasyonlar tek zaman çizelgesinde kalır.
 *
 * Not: framer-motion `useScroll` Lenis altında donuyor — scroll'a bağlı
 * ölçümlerde ScrollTrigger ya da kendi rAF'ınızı kullanın.
 */
let instance: Lenis | null = null;

/** Bir bölüme yumuşak kaydırır (Lenis aktifken `scrollIntoView` çalışmaz). */
export function smoothScrollTo(target: HTMLElement, offset = -96) {
  if (instance) {
    instance.scrollTo(target, { offset, duration: 1.1 });
    return;
  }
  const top = target.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: "smooth" });
}

/**
 * Sayfayı anında en üste alır — rota değişiminde ŞART.
 *
 * Next yeni sayfada `window.scrollTo(0, 0)` çağırıyor ama Lenis kendi
 * hedef konumunu (`targetScroll`) koruduğu için bir sonraki karede eski
 * konuma geri sürüyor. Yeni sayfa daha kısaysa o konum sayfanın sonuna
 * kırpılıyor ve kullanıcı doğrudan footer'da açılıyordu.
 */
export function resetScroll() {
  if (instance) {
    /* `immediate` animasyonu atlar, `force` durdurulmuş hâlde bile uygular. */
    instance.scrollTo(0, { immediate: true, force: true });
    instance.resize();
  }
  window.scrollTo(0, 0);
}

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    /* `?lenis=0` — gömülü önizleme sekmelerinde rAF kısılabildiği için
       yumuşak kaydırmayı kapatıp yerli scroll'a düşmenin yolu. */
    if (new URLSearchParams(window.location.search).get("lenis") === "0") return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    });

    const update = () => ScrollTrigger.update();
    lenis.on("scroll", update);

    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);
    instance = lenis;

    return () => {
      lenis.off("scroll", update);
      gsap.ticker.remove(ticker);
      lenis.destroy();
      instance = null;
    };
  }, []);

  return null;
}
