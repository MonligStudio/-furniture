"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Sayfadaki tüm `.reveal` elemanlarını görünür alana girince açar.
 *
 * Neden tek merkezden: sunucu bileşenleri yalnızca `className="reveal"`
 * yazar, her bölüm için ayrı bir client sarmalayıcı gerekmez.
 *
 * IntersectionObserver'a ek olarak scroll dinleyicisi de var — bazı gömülü
 * tarayıcılarda (önizleme sekmeleri) IO tetiklenmiyor, o durumda içerik
 * görünmez kalmasın diye.
 */
export function RevealEngine() {
  const pathname = usePathname();

  useEffect(() => {
    /* Metin blokları elle işaretlenmeden de kaydırırken açılsın: her
       sayfada `main` içindeki gövde metni otomatik `.reveal` alıyor.

       Dışarıda bırakılanlar, kendi girişi olan ya da girişi HİÇ olmaması
       gereken yerler: görsel üstü katmanlar (yazı karenin üstünde zaten
       duruyor), koleksiyon hero'su (kendi "yerden çıkma" animasyonu var),
       ürün sahnesi paneli (ilk ekran — beklemeden görünmeli), sabitlenen
       süreç bölümü, slider, öne çıkanlar ızgarası ve akan menü. Zaten bir
       `.reveal` içinde olanlar da atlanıyor, yoksa iki animasyon üst üste
       binerdi. */
    const SKIP = [
      ".reveal",
      ".media-layer",
      ".hero-theme-layer",
      ".ch",
      ".pd-stage",
      ".prc-arch",
      ".ms",
      ".gtp",
      ".menu-wrap",
    ].join(",");

    document
      .querySelectorAll<HTMLElement>(
        "main p, main li, main dl, main blockquote, main h2, main h3, main h4",
      )
      .forEach((el) => {
        if (el.closest(SKIP)) return;
        if (el.classList.contains("is-in")) return;
        el.classList.add("reveal");
      });

    /* Bekleyenler: açılan eleman listeden DÜŞÜYOR (aşağıdaki `check`).
       Liste yalnızca yedek kontrol için var, asıl iş IntersectionObserver'da. */
    const pending = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal:not(.is-in)"),
    );
    if (pending.length === 0) return;

    const show = (el: Element) => el.classList.add("is-in");

    /* --- YEDEK KONTROL ---
       Aşağıdaki döngü her elemanın `getBoundingClientRect`ini okuyor, yani
       tarayıcıyı düzeni O ANDA hesaplamaya zorluyor. Eskiden her `scroll`
       olayında çalışıyordu: GSAP aynı karede derinlik katmanlarına transform
       yazdığı için düzen zaten geçersizleşmiş oluyor, hemen ardından ölçüm
       yapmak karenin ortasında bir yeniden düzen demekti (anasayfada 32
       eleman için ölçüldü: kare başına ~0.19 ms — tek başına felaket değil
       ama her karede, sonsuza kadar ödenen bir vergi).

       Asıl açma işini IntersectionObserver yapıyor — o düzeni zorlamıyor.
       Buradaki kontrol yalnızca IO'nun hiç tetiklenmediği ortamlar için bir
       ağ: scroll'a değil düşük frekanslı bir zamanlayıcıya bağlı ve IO'dan
       ilk haber gelir gelmez tamamen kapanıyor. */
    let fallback: number | undefined;
    const stopFallback = () => {
      if (fallback === undefined) return;
      window.clearInterval(fallback);
      fallback = undefined;
    };

    /* Görünür alana giren VEYA yukarıda kalan her şey açılır: sayfaya
       ortadan girildiğinde (scroll geri yükleme, çapa linki, geri tuşu)
       üstteki bloklar görünmez kalmasın. Açılan eleman listeden düşüyor. */
    const check = () => {
      const vh = window.innerHeight || 800;
      for (let i = pending.length - 1; i >= 0; i -= 1) {
        const el = pending[i];
        if (
          el.classList.contains("is-in") ||
          el.getBoundingClientRect().top < vh * 0.9
        ) {
          show(el);
          pending.splice(i, 1);
        }
      }
      if (pending.length === 0) stopFallback();
    };

    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          /* İlk çağrı, gözlenen her eleman için kesişsin kesişmesin gelir:
             yani bu satıra ulaşmak IO'nun bu ortamda çalıştığının kanıtı,
             yedek zamanlayıcıya gerek kalmaz. */
          stopFallback();
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            show(entry.target);
            io?.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.06 },
      );
      pending.forEach((el) => io?.observe(el));
    }

    fallback = window.setInterval(check, 300);

    check();
    window.addEventListener("resize", check);

    return () => {
      io?.disconnect();
      stopFallback();
      window.removeEventListener("resize", check);
    };
  }, [pathname]);

  return null;
}
