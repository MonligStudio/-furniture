import {
  CollectionSlider,
  type SlideItem,
} from "@/components/home/collection-slider";
import { SectionHeading } from "@/components/ui/section-heading";
import { categories, productsByCategory } from "@/content/catalog";
import { lightMediaSrc } from "@/components/ui/media-frame";

/**
 * 03 — Koleksiyonlar.
 *
 * Modüler slider (bkz. `collection-slider.tsx`): ortada iki banda bölünmüş
 * görsel kutusu, arkasında yatay kayan başlık şeridi. Ok düğmeleri ve
 * başlıklar slaytlar arasında gezinir; GÖRSELE tıklandığında kare ekranı
 * kaplayacak şekilde büyüyüp koleksiyon sayfasına açılır.
 */
const items: SlideItem[] = categories.map((category) => ({
  id: category.slug,
  title: category.name,
  meta: `${productsByCategory(category.slug).length} ürün`,
  href: `/koleksiyon/${category.slug}`,
  image: category.image,
  lightImage: lightMediaSrc(category.image),
}));

export function Collections() {
  return (
    <section className="section" id="koleksiyonlar">
      <div className="shell">
        <SectionHeading
          no="03"
          eyebrow="Koleksiyonlar"
          lines={["Odaya göre", "seçilmiş", "koleksiyonlar"]}
          description="Salondan yatak odasına, evin her odası için ayrı bir kurgu. Her koleksiyonun kumaş, ölçü ve modül seçenekleri mağazada deneyerek belirleniyor."
        />

        <div className="reveal mt-14">
          <CollectionSlider items={items} />
        </div>
      </div>
    </section>
  );
}
