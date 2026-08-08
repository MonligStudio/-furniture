import { CatalogTeaser } from "@/components/home/catalog-teaser";
import { ClosingCta } from "@/components/home/closing-cta";
import { Collections } from "@/components/home/collections";
import { FaqSection } from "@/components/home/faq-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HeroVideo } from "@/components/home/hero-video";
import { Manifesto } from "@/components/home/manifesto";
import { MarqueeBand } from "@/components/home/marquee-band";
import { Process } from "@/components/home/process";
import { PuffyBand } from "@/components/home/puffy-band";
import { Stats } from "@/components/home/stats";
import { Testimonials } from "@/components/home/testimonials";
import { WhyUs } from "@/components/home/why-us";

/**
 * Anasayfa.
 *
 * Yapı: tam ekran video → 12 numaralı bölüm → tam sayfa footer.
 * Bölüm sırası burada; her bölümün metni `src/content/home.ts` içinde.
 */
export default function HomePage() {
  return (
    <>
      <HeroVideo />
      <Manifesto />
      <Stats />
      <Collections />
      <FeaturedProducts />
      <WhyUs />
      <PuffyBand />
      <Process />
      <MarqueeBand />
      <CatalogTeaser />
      <Testimonials />
      <FaqSection />
      <ClosingCta />
    </>
  );
}
