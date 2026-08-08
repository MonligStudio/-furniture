import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * Kelime işareti — logonun tipografik karşılığı.
 *
 * Logo iki satırdan oluşuyor: ağır ve geniş aralıklı "ESCUDO", altında
 * çok daha ince ve çok daha geniş aralıklı "HOME CONCEPT". Alt satırın
 * genişliği üsttekine yakın duruyor; buradaki harf aralıkları da o orana
 * göre seçildi. İkisi de aynı aileden (Montserrat) besleniyor.
 */
export function Wordmark({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const scale = {
    sm: { top: "text-[0.95rem]", bottom: "text-[0.42rem]" },
    md: { top: "text-[1.2rem] sm:text-[1.35rem]", bottom: "text-[0.46rem] sm:text-[0.52rem]" },
    lg: { top: "text-[2rem] sm:text-[2.6rem]", bottom: "text-[0.7rem] sm:text-[0.9rem]" },
  }[size];

  return (
    <span className={cn("flex flex-col items-center leading-none", className)}>
      <span
        className={cn(
          "font-display font-extrabold tracking-[0.16em] uppercase",
          scale.top,
        )}
      >
        {site.name}
      </span>
      <span
        className={cn(
          "mt-[0.45em] font-label font-light tracking-[0.44em] text-fg-muted uppercase",
          /* Geniş aralık son harften sonra da boşluk bırakıyor; blok
             optik olarak ortalansın diye o kadarını geri alıyoruz. */
          "indent-[0.44em]",
          scale.bottom,
        )}
      >
        {site.subMark}
      </span>
    </span>
  );
}
