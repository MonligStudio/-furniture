import type { Metadata } from "next";
import { Manrope, Montserrat } from "next/font/google";
import { Header } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/site-footer";
import { RevealEngine } from "@/components/reveal-engine";
import { MediaScrub } from "@/components/providers/media-scrub";
import { ScrollReset } from "@/components/providers/scroll-reset";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { site } from "@/content/site";
import "./globals.css";

/* MARKA FONTU — logodan.
   "ESCUDO" kelime işareti ağır, geniş, geometrik bir grotesk; altındaki
   "HOME CONCEPT" aynı ailenin ince ve çok geniş aralıklı hâli. Montserrat
   bu karakterin en yakın karşılığı ve hem başlıkları hem mikro etiketleri
   tek aileden besliyor — logo ile site aynı sesi konuşuyor. */
const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

/* Gövde metni — başlıkların ağırlığını dengeleyen nötr, açık bir grotesk. */
const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.legalName} — Adana mobilya mağazası`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Adana mobilya",
    "salon takımı",
    "köşe takımı",
    "yemek odası takımı",
    "yatak odası takımı",
    "Puffy yatak",
    "Escudo Home Concept",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: site.url,
    siteName: site.legalName,
    title: `${site.legalName} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="tr"
      className={`${montserrat.variable} ${manrope.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col antialiased">
        <ThemeProvider>
          <SmoothScroll />
          <ScrollReset />
          <RevealEngine />
          <MediaScrub />
          <Header />

          {/* Sayfa katmanı opak ve footer'ın üstünde; sonundaki 100svh'lik
              boşluk (footer-revealer) sabit footer'ı açığa çıkarır. */}
          <div className="page-layer flex flex-1 flex-col">
            <main className="flex-1">{children}</main>
          </div>

          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
