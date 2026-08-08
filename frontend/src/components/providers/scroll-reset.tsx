"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { resetScroll } from "@/components/providers/smooth-scroll";

/**
 * Rota değişiminde scroll'u sıfırlar ve ScrollTrigger'ı tazeler.
 *
 * İki hatayı birden kapatıyor:
 *
 * 1. **Yeni sayfa footer'da açılıyordu.** Lenis kendi hedef konumunu
 *    koruduğu için Next'in `scrollTo(0, 0)` çağrısı bir sonraki karede
 *    geri alınıyordu; yeni sayfa kısaysa eski konum sayfanın sonuna
 *    kırpılıp doğrudan footer'a düşüyordu.
 *
 * 2. **Footer bazı sayfalarda bozuk kalıyordu.** Footer sabit (fixed) ve
 *    layout'ta durduğu için rota değişiminde yeniden bağlanmıyor; sayfa
 *    boyu değiştiği hâlde ScrollTrigger eski ölçülerle çalışıyor, açılış
 *    animasyonu ya hiç tetiklenmiyor ya da yarıda kalmış hâlde
 *    kilitleniyordu.
 *
 * Tazeleme birkaç kez tekrarlanıyor (görseller ve yazı tipleri yüklendikçe
 * sayfa boyu değişiyor), ama scroll YALNIZCA BİR KEZ sıfırlanıyor —
 * yoksa gezinmeden hemen sonra kaydırmaya başlayan kullanıcıyı geri
 * yukarı çekerdi.
 */
export function ScrollReset() {
  const pathname = usePathname();
  /* İlk yüklemede tarayıcı zaten kendi konumunu ayarlıyor (çapa,
     yenileme, geri tuşu) — ona karışılmaz. */
  const first = useRef(true);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();

    if (first.current) {
      first.current = false;
    } else if (!window.location.hash) {
      /* Çapa bağlantılarında (ör. /#koleksiyonlar) hedefe gidilir,
         başa dönülmez. */
      resetScroll();
    }

    const timers = [0, 120, 500, 1200].map((delay) =>
      window.setTimeout(refresh, delay),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [pathname]);

  return null;
}
