import Image from "next/image";
import { lightMediaSrc } from "@/components/ui/media-frame";
import type { Product } from "@/content/catalog";
import "./product-story.css";

/**
 * Ürünün farklı açılardan anlatıldığı bölüm.
 *
 * Her kare için bir blok: bir sırada görsel solda / yazı sağda, sonraki
 * sırada ayna. Bloklar birbirinin altına hafifçe giriyor, yani okurken
 * bir sonraki karenin üst şeridi görünmeye başlıyor.
 *
 * Kareler scroll ile ÜSTTEN AŞAĞI doğru açılıyor (bkz. product-story.css).
 * Tetikleyici projenin `RevealEngine`'i: `.reveal` görünür alana girince
 * `.is-in` alıyor — saf CSS geçişi, rAF'a bağlı değil.
 *
 * Blok sayısı galerideki kare sayısı kadar (ürünlerde 1–3 arası).
 * Metinler ürün verisinden geliyor; hiçbir blok uydurma içerik taşımıyor,
 * kare yoksa blok da yok.
 */
const ANGLES = [
  { eyebrow: "Genel görünüm", title: "Bütün olarak" },
  { eyebrow: "Detay", title: "Yakından" },
  { eyebrow: "Kumaş ve renk", title: "Dokusuna bakın" },
] as const;

export function ProductStory({ product }: { product: Product }) {
  const shots = product.gallery;
  if (shots.length === 0) return null;

  /** Bloğun yazısı: sırayla açıklama → öne çıkanlar → kumaş/renk. */
  const copyFor = (index: number) => {
    if (index === 0) return { body: product.description, list: null };
    if (index === 1) return { body: null, list: product.highlights };
    return {
      body: null,
      list: [
        `Kumaş: ${product.materials.join(", ")}`,
        `Renk: ${product.colors.join(", ")}`,
      ],
    };
  };

  return (
    <section className="section pt-0">
      <div className="shell">
        {shots.map((shot, i) => {
          const angle = ANGLES[Math.min(i, ANGLES.length - 1)];
          const { body, list } = copyFor(i);

          return (
            <div className="ps-block" key={shot} data-flip={i % 2 === 1}>
              <figure className="ps-figure ps-shot reveal">
                <div className="ps-mask">
                  {/* Derinlik katmanı: scroll'a bağlı kaymayı GSAP veriyor
                      (bkz. providers/media-scrub), maskeyi CSS. */}
                  <span className="depth-layer" data-depth={9}>
                    <Image
                      src={shot}
                      alt={`${product.name} — ${angle.eyebrow.toLocaleLowerCase("tr")}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="theme-media-dark object-cover"
                    />
                    <Image
                      src={lightMediaSrc(shot)}
                      alt=""
                      aria-hidden
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="theme-media-light object-cover"
                    />
                  </span>
                </div>
              </figure>

              {/* Yazı kareden sonra: önce perde iniyor, sonra metin. */}
              <div
                className="ps-copy reveal"
                style={{ "--reveal-delay": "320ms" } as React.CSSProperties}
              >
                <span className="chapter">
                  <b>{String(i + 1).padStart(2, "0")}</b>
                  {angle.eyebrow}
                </span>

                <h2 className="ps-title">{angle.title}</h2>

                {body ? <p className="ps-body">{body}</p> : null}

                {list ? (
                  <ul className="ps-list">
                    {list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
