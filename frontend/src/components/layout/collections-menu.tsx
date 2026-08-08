import {
  FlowingMenu,
  type FlowingMenuItem,
} from "@/components/ui/flowing-menu";
import { lightMediaSrc } from "@/components/ui/media-frame";
import { categories, productsByCategory } from "@/content/catalog";

/** Satır yüksekliği — kabın toplam boyu satır sayısıyla çarpılarak kurulur. */
const ROW = "clamp(4.25rem, 8vh, 6rem)";

/**
 * KOLEKSİYON SAYFASININ EN ALTINDAKİ GEÇİŞ ŞERİDİ.
 *
 * React Bits' FlowingMenu: satırın üstüne gelince imlecin girdiği kenardan
 * bir şerit sürülüyor, içinde koleksiyon adı ve görseli akıyor.
 *
 * SADECE koleksiyon sayfasında basılıyor (`koleksiyon/[slug]/page.tsx`) —
 * bir ara `layout.tsx`'teydi ve her sayfanın altında çıkıyordu. Açık olan
 * koleksiyon `exclude` ile listeden düşürülüyor. Bu bölüm, koleksiyon
 * sayfasının altındaki eski "03 — Diğer koleksiyonlar" listesinin yerini
 * aldı.
 */
export function CollectionsMenu({ exclude }: { exclude?: string }) {
  const items: FlowingMenuItem[] = categories
    .filter((category) => category.slug !== exclude)
    .map((category) => ({
      link: `/koleksiyon/${category.slug}`,
      text: category.name,
      image: category.image,
      lightImage: lightMediaSrc(category.image),
      note: `${productsByCategory(category.slug).length} ürün`,
    }));

  if (items.length === 0) return null;

  return (
    <section className="section" aria-labelledby="koleksiyon-gecisi">
      <div className="shell">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-5">
          {/* `.chapter` DEĞİL `.eyebrow`: buradaki numara bir bölüm numarası
              olurdu, oysa bu şerit her sayfanın altında ortak. */}
          <h2 id="koleksiyon-gecisi" className="eyebrow">
            {exclude ? "Diğer koleksiyonlar" : "Koleksiyonlar"}
          </h2>
          <p className="edge-note text-fg-faint">
            Üstüne gelin, koleksiyona geçin
          </p>
        </div>
      </div>

      {/* Kenardan kenara: şerit tam genişlikte aksın. */}
      <div
        className="reveal mt-10"
        style={{ height: `calc(${items.length} * ${ROW})` }}
      >
        <FlowingMenu items={items} />
      </div>
    </section>
  );
}
