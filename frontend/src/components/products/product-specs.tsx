import { SectionHeading } from "@/components/ui/section-heading";
import { categoryName, type Product } from "@/content/catalog";

/**
 * Ürünün teknik künyesi — tablolar.
 *
 * Üç tablo: ölçüler/yapı (ürün verisinden), kumaş & renk seçenekleri,
 * sipariş ve teslimat bilgileri. Sonuncusu bütün ürünler için aynı ve
 * koleksiyon hero'sundaki künyeyle aynı bilgiyi veriyor — iki yerde
 * farklı şey yazmasın.
 */
const ORDER_ROWS = [
  { label: "Üretim", value: "İnegöl" },
  { label: "Özel ölçü", value: "Var" },
  { label: "Üretim süresi", value: "2–5 hafta" },
  { label: "Adana içi teslimat", value: "Ücretsiz" },
  { label: "Montaj", value: "Kendi ekibimiz" },
] as const;

function SpecTable({
  caption,
  rows,
}: {
  caption: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <div className="reveal">
      <h3 className="edge-note text-fg-faint">{caption}</h3>
      <dl className="mt-4 border-t border-line">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line py-3.5"
          >
            <dt className="text-[0.95rem] text-fg-muted">{row.label}</dt>
            <dd className="font-display text-[1.02rem] text-fg">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function ProductSpecs({ product }: { product: Product }) {
  const measurements = Object.entries(product.specs).map(([label, value]) => ({
    label,
    value,
  }));

  const optionRows = [
    { label: "Koleksiyon", value: categoryName(product.category) },
    { label: "Kumaş seçenekleri", value: product.materials.join(", ") },
    { label: "Renkler", value: product.colors.join(", ") },
  ];

  return (
    <section className="section pt-0">
      <div className="shell">
        <SectionHeading
          no="02"
          eyebrow="Künye"
          lines={["Ölçüler,", "malzeme", "ve sipariş"]}
          description="Ölçüler standart kurgu içindir; özel ölçüde modül sayısı ve toplam genişlik siparişte yeniden belirlenir."
        />

        <div className="mt-12 grid gap-x-12 gap-y-14 lg:grid-cols-3">
          <SpecTable caption="Ölçüler ve yapı" rows={measurements} />
          <SpecTable caption="Kumaş ve renk" rows={optionRows} />
          <SpecTable caption="Sipariş ve teslimat" rows={[...ORDER_ROWS]} />
        </div>

        <div className="reveal mt-14 border-t border-line pt-8">
          <h3 className="edge-note text-fg-faint">Öne çıkanlar</h3>
          <ul className="mt-5 grid gap-x-10 gap-y-3 sm:grid-cols-2">
            {product.highlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-[0.95rem] text-fg-muted"
              >
                <span
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
