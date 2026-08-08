import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { PageHero } from "@/components/layout/page-hero";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Escudo Home Concept Adana mağazası: adres, telefon, çalışma saatleri ve mesaj formu.",
};

/**
 * İletişim — SADE kurgu.
 *
 * Eskiden üç ikonlu kanal kartı ızgarası, vitrin fotoğrafı ve iki ayrı
 * bölüm vardı. Sayfanın işi tek bir şey: ulaşmak. O yüzden tek bölüm
 * kaldı — solda düz bir künye (telefon / WhatsApp / adres / saatler),
 * sağda form. Kart, ikon ve görsel yok.
 */
const lines = [
  { label: "Telefon", value: site.contact.phone, href: site.contact.phoneHref },
  { label: "WhatsApp", value: "Mesaj gönderin", href: site.contact.whatsapp },
  { label: "Adres", value: "Haritada aç", href: site.contact.mapsUrl },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="İletişim"
        title={["Bize", "ulaşın"]}
        description="Mağazamız Kasım Ener Bulvarı üzerinde, Hayalpark civarında. Randevu gerekmiyor; uğrayın, oturun, kumaşa dokunun."
      />

      <section className="section pt-0">
        <div className="shell grid gap-14 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1fr)] lg:gap-24">
          <div className="reveal flex flex-col gap-10">
            <ul className="flex flex-col border-t border-line">
              {lines.map((line) => (
                <li key={line.label}>
                  <a
                    href={line.href}
                    target={line.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      line.href.startsWith("http") ? "noreferrer" : undefined
                    }
                    className="group flex items-baseline justify-between gap-6 border-b border-line py-5 transition-colors duration-300 hover:text-accent"
                  >
                    <span className="edge-note text-fg-faint">
                      {line.label}
                    </span>
                    <span className="inline-flex items-center gap-2 font-display text-[1.1rem] text-fg transition-colors duration-300 group-hover:text-accent">
                      {line.value}
                      <ArrowUpRight
                        className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div>
              <h2 className="edge-note text-fg-faint">Mağaza</h2>
              <address className="mt-3 text-[1.05rem] text-fg not-italic">
                {site.contact.address.line1}
                <br />
                {site.contact.address.line2}
              </address>
            </div>

            <div>
              <h2 className="edge-note text-fg-faint">Çalışma saatleri</h2>
              <dl className="mt-3 flex flex-col gap-1">
                {site.contact.hours.map((row) => (
                  <div key={row.days} className="flex justify-between gap-4">
                    <dt className="text-fg-muted">{row.days}</dt>
                    <dd className="text-fg">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="reveal">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
