import { SectionHeading } from "@/components/ui/section-heading";
import { MediaFrame } from "@/components/ui/media-frame";
import { whyUs } from "@/content/home";

/** 05 — Neden Escudo: dört maddelik numaralı liste. */
export function WhyUs() {
  return (
    <section className="section">
      <div className="shell">
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] lg:gap-16">
          <SectionHeading
            no={whyUs.no}
            eyebrow={whyUs.eyebrow}
            lines={whyUs.lines}
            description={whyUs.description}
          />

          <div className="reveal">
            <MediaFrame
              src="/campaign-dark/craftsmanship.webp"
              alt="Koltuk kumaşını özenle uygulayan mobilya ustası"
              ratio="16/9"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </div>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2">
          {whyUs.items.map((item, i) => (
            <article
              key={item.no}
              className="reveal group bg-ink-950 p-8 transition-colors duration-500 hover:bg-ink-900 sm:p-10"
              style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
            >
              <span className="font-label text-[0.72rem] tracking-[0.24em] text-accent">
                {item.no}
              </span>
              <h3 className="mt-5 font-display text-[1.5rem] text-fg">
                {item.title}
              </h3>
              <p className="mt-3 text-fg-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
