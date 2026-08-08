import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { MediaFrame } from "@/components/ui/media-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { intro, production, team, timeline, values } from "@/content/about";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "1993'ten beri Adana'da mobilya: Escudo Home Concept'in hikâyesi, üretim yaklaşımı ve ekibi.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Hakkımızda"
        title={["Escudo", "Home", "Concept"]}
        description={site.description}
        meta={[
          { label: "Kuruluş", value: `${site.founded}` },
          { label: "Şehir", value: site.contact.address.city },
          { label: "Üretim", value: "İnegöl" },
          { label: "İlke", value: "İyi ürün, iyi fiyat" },
        ]}
      />

      {/* Giriş */}
      <section className="section pt-0">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-20">
          <SectionHeading
            no={intro.no}
            eyebrow={intro.eyebrow}
            lines={intro.lines}
            size="lg"
          />

          <div className="reveal flex flex-col gap-6 lg:pt-4">
            {intro.paragraphs.map((paragraph, i) => (
              <p
                key={paragraph.slice(0, 24)}
                className="text-[1.05rem] text-fg-muted"
                style={
                  { "--reveal-delay": `${i * 120}ms` } as React.CSSProperties
                }
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Görsel bandı */}
      <section className="pb-[clamp(3rem,7vw,6rem)]">
        <div className="shell grid gap-4 sm:grid-cols-3">
          <div className="reveal sm:col-span-2">
            <MediaFrame
              src="/showroom-dark/magaza.webp"
              alt="Escudo showroom"
              ratio="16/10"
              sizes="(max-width: 640px) 100vw, 66vw"
            />
          </div>
          <div
            className="reveal"
            style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
          >
            <MediaFrame
              src="/showroom-dark/detay.webp"
              alt="Kumaş ve dikiş detayı"
              ratio="4/5"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          </div>
        </div>
      </section>

      {/* Zaman çizelgesi */}
      <section className="section pt-0">
        <div className="shell">
          <SectionHeading
            no="02"
            eyebrow="Zaman çizelgesi"
            lines={["1993'ten", "bugüne"]}
          />

          <ol className="mt-14 border-t border-line">
            {timeline.map((item, i) => (
              <li
                key={item.year}
                className="reveal group grid gap-3 border-b border-line py-8 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-10"
                style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}
              >
                <span className="font-display text-[1.6rem] text-accent">
                  {item.year}
                </span>
                <div>
                  <h3 className="font-display text-[clamp(1.1rem,2vw,1.45rem)] text-fg transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-fg-muted">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Üretim */}
      <section className="section pt-0">
        <div className="shell">
          <SectionHeading
            no={production.no}
            eyebrow={production.eyebrow}
            lines={production.lines}
            description={production.description}
          />

          <ol className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {production.steps.map((step, i) => (
              <li
                key={step.title}
                className="reveal bg-ink-950 p-6 transition-colors duration-500 hover:bg-ink-900"
                style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
              >
                <span className="font-label text-[0.7rem] tracking-[0.22em] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-[1.15rem] text-fg">
                  {step.title}
                </h3>
                <p className="mt-2 text-[0.92rem] text-fg-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Değerler */}
      <section className="section pt-0">
        <div className="shell">
          <SectionHeading
            no="04"
            eyebrow="Değerlerimiz"
            lines={["Neye göre", "karar", "veriyoruz"]}
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {values.map((value, i) => (
              <article
                key={value.no}
                className="card hairline-top reveal p-8 sm:p-10"
                style={
                  { "--reveal-delay": `${(i % 2) * 110}ms` } as React.CSSProperties
                }
              >
                <span className="font-label text-[0.72rem] tracking-[0.24em] text-accent">
                  {value.no}
                </span>
                <h3 className="mt-5 font-display text-[1.4rem] text-fg">
                  {value.title}
                </h3>
                <p className="mt-3 text-fg-muted">{value.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Ekip */}
      <section className="section pt-0">
        <div className="shell">
          <SectionHeading
            no="05"
            eyebrow="Ekip"
            lines={["Kimlerle", "çalışıyorsunuz"]}
            description="Mağazadan montaja kadar süreçte karşınıza çıkan ekipler. Hepsi Escudo bünyesinde çalışır, taşeron değildir."
          />

          <div className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <article
                key={member.name}
                className="reveal bg-ink-950 p-8 transition-colors duration-500 hover:bg-ink-900"
                style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
              >
                <span className="edge-note text-fg-faint">{member.role}</span>
                <h3 className="mt-4 font-display text-[1.25rem] text-fg">
                  {member.name}
                </h3>
                <p className="mt-3 text-[0.92rem] text-fg-muted">{member.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
