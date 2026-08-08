import Image from "next/image";
import { cn } from "@/lib/utils";
import { publicAsset } from "@/lib/paths";

/** `/products-dark/foo.webp` → `/products-light/foo.webp` */
export function lightMediaSrc(src: string) {
  if (src.includes("-dark/")) {
    return src.replace("-dark/", "-light/");
  }

  const prefix = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const relative = prefix && src.startsWith(`${prefix}/`)
    ? src.slice(prefix.length)
    : src;

  return publicAsset(relative.replace(/^\/([^/]+)\//, "/$1-light/"));
}

/**
 * Görsel çerçevesi.
 *
 * Her kare için `*-dark` ve `*-light` klasörlerinde aynı sahnenin akşam
 * ve gündüz eşleri bulunur. Tema değiştiğinde yalnızca doğru eş görünür.
 *
 * Çerçevenin kendi arkaplanı var (`.media-frame`); görsel yüklenmese bile
 * kutu boş/beyaz kalmaz.
 */
export function MediaFrame({
  src,
  lightSrc,
  alt,
  ratio = "4/3",
  className,
  imageClassName,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority,
  overlay,
  scrub = true,
  scrubAmount = 11,
  tilt = 3,
}: {
  src: string;
  lightSrc?: string;
  alt: string;
  ratio?: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  overlay?: React.ReactNode;
  /** Scroll'a bağlı kayma + giriş animasyonu (bkz. providers/media-scrub). */
  scrub?: boolean;
  /** Kayma miktarı — katman yüksekliğinin yüzdesi. */
  scrubAmount?: number;
  /** Karenin perspektif içinde yatma açısı (derece); 0 = düz kalsın. */
  tilt?: number;
}) {
  return (
    <div
      className={cn("media-frame", className)}
      style={{ aspectRatio: ratio }}
      /* Üstteki yazı katmanı hareketini KENDİ kutusuna değil bu karenin
         görünür alandan geçişine göre ölçüyor (bkz. providers/media-scrub). */
      data-parallax-scene=""
      data-tilt={scrub && tilt ? tilt : undefined}
    >
      {/* Görseller kendi katmanlarında duruyor: scroll hareketini (yPercent)
          GSAP bu katmana yazıyor, `img` üstündeki hover büyütmesi CSS'te
          kalıyor — iki transform birbirini ezmiyor. Katman çerçeveden biraz
          taşkın (bkz. `.media-scrub`), böylece kayarken kenarda boşluk
          açılmıyor. */}
      <span
        className="media-scrub"
        data-media-scrub={scrub ? "" : undefined}
        data-scrub-amount={scrubAmount}
      >
        <Image
          src={publicAsset(src)}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("theme-media-dark object-cover", imageClassName)}
        />
        <Image
          src={publicAsset(lightSrc ?? lightMediaSrc(src))}
          alt=""
          aria-hidden
          fill
          sizes={sizes}
          priority={priority}
          className={cn("theme-media-light object-cover", imageClassName)}
        />
      </span>

      {overlay ? (
        <div className="media-layer absolute inset-0 flex flex-col justify-end">
          <div className="scrim-media absolute inset-0" aria-hidden />
          {/* Yazı, görselin TERSİ yönde ve daha hızlı gidiyor: aradaki fark
              derinlik duygusunu veriyor. Perde hareket etmiyor — o karenin
              kenarına oturmak zorunda, kayarsa altında şerit açılır.

              Miktar, kutunun EN DAR dolgusunun (mobilde `p-5` = 20px)
              altında kalmalı: kare görünür alanın en altındayken yazı en
              aşağı noktasında oluyor ve çerçeve `overflow: hidden`, fazlası
              harflerin altını kırpar. */}
          <div
            className="relative z-10 p-5 sm:p-7"
            data-parallax={scrub ? 16 : undefined}
          >
            {overlay}
          </div>
        </div>
      ) : null}
    </div>
  );
}
