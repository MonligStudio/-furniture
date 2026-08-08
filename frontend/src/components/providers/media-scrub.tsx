"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * DERİNLİK MOTORU — sayfadaki katmanlara scroll'a bağlı hareket verir.
 *
 * Sahne üç katmandan oluşuyor ve her katman FARKLI hızda gidiyor; 3B
 * duygusu buradan geliyor (tek bir katman kayarsa "parallax" olur, iki
 * katman ters yönde gidince araya derinlik girer):
 *
 *   1. ARKA — görselin kendisi (`[data-media-scrub]`, `[data-depth]`).
 *      Çerçevenin içinde AŞAĞI doğru sürükleniyor, yani sayfadan geride
 *      kalıyor: uzaktaki şey yavaş hareket eder.
 *   2. ÖN — görselin ÜSTÜNDEKİ yazı/kutu (`[data-parallax]`). Sayfayla
 *      aynı yönde ama daha HIZLI gidiyor, yani öne çıkıyor.
 *   3. DÜZLEM — karenin kendisi (`[data-tilt]`). Görünür alanı geçerken
 *      perspektif içinde birkaç derece yatıyor: alttayken üstten, üste
 *      çıkınca alttan bakıyormuşuz gibi.
 *
 * SAHNE BAŞINA TEK ScrollTrigger. Bu üç hareketin scroll aralığı birebir
 * aynı (kare alttan girerken başlar, üstten çıkarken biter); ayrı ayrı
 * tetikleyici kurmak her karede aynı hesabı üç kez yaptırmak olurdu.
 * Bir katmanın sahnesi: `[data-parallax-scene]` işaretli en yakın ata,
 * yoksa ebeveyni.
 *
 * Ayrıca `[data-media-scrub]` katmanları görünür alana ilk girdiklerinde
 * maskeyle açılıyor — bu TEK SEFERLİK ve aralığı farklı olduğu için kendi
 * tetikleyicisinde. `[data-depth]` katmanları açılmıyor: girişlerini zaten
 * kendi bileşenleri yapıyor (ürün hikâyesi, ürün sahnesi, ızgara), ikinci
 * bir giriş çakışırdı.
 *
 * Hareket miktarları eleman başına ayarlanır:
 *   `data-scrub-amount` / `data-depth` → katman YÜKSEKLİĞİNİN yüzdesi.
 *   `data-parallax`                    → piksel (yazı kutuları alçak
 *                                        olduğu için yüzde anlamsız kalır).
 *   `data-tilt`                        → derece.
 *
 * Taşma payı CSS'te `--scrub-inset` / `--depth-inset` ile; katman
 * çerçeveden o kadar taşkın durur ki kayarken kenarda boşluk açılmaz.
 * Hareketi büyütürken payı da büyütmek gerekir (bkz. globals.css).
 *
 * "Hareketi azalt" açıkken hiçbir şey kurulmaz.
 */
type Scene = {
  /** Görsel katmanları: yüzde cinsinden, sayfadan geri kalacak yönde. */
  back: { el: HTMLElement; amount: number }[];
  /** Üstteki yazı/kutu: piksel cinsinden, ters yönde. */
  fore: { el: HTMLElement; amount: number }[];
  /** Karenin kendi yatma açısı. */
  tilt: number;
};

export function MediaScrub() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* Efekt telefonda da korunur; yalnızca hareket mesafesi küçültülür.
       Böylece GSAP derinliği kaybolmadan küçük ekran GPU/bellek bütçesine
       daha uygun çalışır. Lenis mobilde kapalı olduğu için yerli scroll'un
       gecikmesiz hissi de korunur. */
    const compact = window.matchMedia(
      "(pointer: coarse), (max-width: 47.99em)",
    ).matches;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const scenes = new Map<HTMLElement, Scene>();
      const sceneOf = (host: HTMLElement) => {
        let scene = scenes.get(host);
        if (!scene) {
          scene = { back: [], fore: [], tilt: 0 };
          scenes.set(host, scene);
        }
        return scene;
      };

      /* --- Katmanları sahnelerine dağıt --- */
      gsap.utils.toArray<HTMLElement>("[data-media-scrub]").forEach((el) => {
        const host = el.parentElement ?? el;
        sceneOf(host).back.push({
          el,
          amount: compact
            ? Math.min(Number(el.dataset.scrubAmount || 11), 5)
            : Number(el.dataset.scrubAmount || 11),
        });

        /* Görünür alana ilk girişte maskeyle açılış — tek seferlik, ayrı
           aralık, o yüzden sahnenin zaman çizelgesine girmiyor. */
        gsap.fromTo(
          el,
          {
            clipPath: `inset(${compact ? 8 : 14}% 0% 0% 0%)`,
            scale: compact ? 1.05 : 1.12,
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            duration: 1.15,
            ease: "power3.out",
            scrollTrigger: { trigger: host, start: "top 92%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-depth]").forEach((el) => {
        const host = el.parentElement ?? el;
        const amount = Number(el.dataset.depth || 8);
        sceneOf(host).back.push({
          el,
          amount: compact ? Math.min(amount, 4) : amount,
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const host =
          el.closest<HTMLElement>("[data-parallax-scene]") ??
          el.parentElement ??
          el;
        sceneOf(host).fore.push({
          el,
          amount: compact
            ? Math.min(Number(el.dataset.parallax || 34), 16)
            : Number(el.dataset.parallax || 34),
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-tilt]").forEach((el) => {
        const tilt = Number(el.dataset.tilt || 3);
        sceneOf(el).tilt = compact ? Math.min(tilt, 1) : tilt;
      });

      /* --- Sahne başına tek zaman çizelgesi, tek tetikleyici --- */
      scenes.forEach((scene, host) => {
        const timeline = gsap.timeline({
          defaults: { ease: "none", duration: 1 },
          scrollTrigger: {
            trigger: host,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        for (const { el, amount } of scene.back) {
          timeline.fromTo(el, { yPercent: -amount }, { yPercent: amount }, 0);
        }
        for (const { el, amount } of scene.fore) {
          timeline.fromTo(el, { y: amount }, { y: -amount }, 0);
        }
        if (scene.tilt) {
          /* `transformPerspective` kaçış noktasını elemanın KENDİ
             transform'una koyuyor; ataya `perspective` yazmak gerekmiyor. */
          timeline.fromTo(
            host,
            { rotateX: scene.tilt, transformPerspective: 1200 },
            { rotateX: -scene.tilt, transformPerspective: 1200 },
            0,
          );
        }
      });
    });

    /* Görseller yüklendikçe sayfa boyu değişiyor; ölçüler tazelenmeli. */
    const timers = [200, 700, 1500].map((delay) =>
      window.setTimeout(() => ScrollTrigger.refresh(), delay),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      ctx.revert();
    };
  }, [pathname]);

  return null;
}
