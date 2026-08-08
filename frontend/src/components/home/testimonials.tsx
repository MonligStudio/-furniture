import { CircularGallery } from "@/components/ui/circular-gallery";
import { SectionHeading } from "@/components/ui/section-heading";
import { testimonials } from "@/content/home";

/**
 * 09 — Müşteri yorumları.
 *
 * Yorumlar 3B bir halkada duruyor (bkz. `ui/circular-gallery.tsx`).
 * Halka scroll'a DEĞİL yalnızca sürüklemeye tepki veriyor: bölümün
 * üstünde scroll yapmak sayfayı kaydırmaya devam eder.
 */
export function Testimonials() {
  return (
    <section className="section">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            no="09"
            eyebrow="Müşterilerimiz"
            lines={["Adana'da", "evlerin içinden"]}
          />

          <p className="reveal edge-note text-fg-faint">Tutup çevirin ↔</p>
        </div>
      </div>

      {/* Kenardan kenara: halka kabın dışına taşabilsin. */}
      <div className="reveal mt-12 h-[26rem] overflow-hidden sm:h-[30rem]">
        <CircularGallery items={[...testimonials]} radius={380} />
      </div>
    </section>
  );
}
