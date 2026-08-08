import { Accordion } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/ui/section-heading";
import { faq } from "@/content/home";

/** 11 — Sık sorulan sorular. */
export function FaqSection() {
  return (
    <section className="section" id="sss">
      <div className="shell grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-20">
        <SectionHeading
          no="10"
          eyebrow="Sık sorulanlar"
          lines={["Merak", "edilenler"]}
          description="Aradığınızı bulamazsanız mağazayı arayın; telefonda da aynı bilgiyi veriyoruz."
        />

        <div className="reveal">
          <Accordion items={faq} />
        </div>
      </div>
    </section>
  );
}
