import { manifesto } from "@/content/home";
import { MediaFrame } from "@/components/ui/media-frame";
import { SectionHeading } from "@/components/ui/section-heading";

/** 01 — Marka girişi: büyük başlık solda, iki paragraf sağda. */
export function Manifesto() {
  return (
    <section className="section">
      <div className="shell grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-20">
        <SectionHeading
          no={manifesto.no}
          eyebrow={manifesto.eyebrow}
          lines={manifesto.lines}
          size="lg"
        />

        <div className="reveal flex flex-col gap-6 lg:pt-4">
          {manifesto.paragraphs.map((paragraph, i) => (
            <p
              key={paragraph.slice(0, 24)}
              className="text-[1.05rem] text-fg-muted"
              style={{ "--reveal-delay": `${i * 120}ms` } as React.CSSProperties}
            >
              {paragraph}
            </p>
          ))}

          <span className="edge-note mt-2 text-fg-faint">
            {manifesto.signature}
          </span>
        </div>

        <div className="reveal lg:col-span-2">
          <MediaFrame
            src="/campaign-dark/dining-room.webp"
            alt="Koyu ceviz masa ve krem sandalyelerden oluşan çağdaş yemek odası"
            ratio="16/7"
            sizes="(max-width: 1024px) 100vw, 90vw"
          />
        </div>
      </div>
    </section>
  );
}
