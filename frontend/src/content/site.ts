/**
 * Marka, iletişim ve menü bilgisi TEK yerde.
 *
 * Buradaki değerler footer'dan header'a, iletişim sayfasından SEO
 * etiketlerine kadar her yerde okunuyor — bilgi değişince yalnızca bu
 * dosya güncellenir.
 *
 * TODO işaretli alanlar firmadan teyit bekliyor (taslak içerik).
 */
export const site = {
  name: "ESCUDO",
  wordmark: "Escudo",
  subMark: "home concept",
  legalName: "Escudo Home Concept",
  domain: "escudohomeconcept.com", // TODO: alan adı teyit edilecek
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://escudohomeconcept.com",
  founded: 1993,
  tagline: "İyi ürün, iyi fiyat.",
  description:
    "1993'ten beri Adana'da; salon, köşe, yemek odası ve yatak odası takımları. Seçkin mimarlarca tasarlanıp İnegöl'de üretilen mobilyalar, Puffy yatak yetkili satış noktası.",
  contact: {
    /* TODO: kurumsal e-posta adresi teyit edilecek. */
    email: "info@escudohomeconcept.com",
    phone: "0322 235 23 57",
    phoneHref: "tel:+903222352357",
    whatsapp: "https://wa.me/903222352357",
    address: {
      line1: "Yurt Mahallesi, Kasım Ener Bulvarı No: 8/A",
      line2: "Hayalpark civarı, Çukurova / Adana",
      city: "Adana",
      country: "Türkiye",
    },
    /* Google Haritalar'da mağazayı arayan bağlantı. */
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Escudo+Home+Concept+Kas%C4%B1m+Ener+Bulvar%C4%B1+Adana",
    hours: [
      { days: "Pazartesi – Cumartesi", value: "09:00 – 20:00" },
      { days: "Pazar", value: "11:00 – 19:00" },
    ],
  },
  socials: [
    { label: "Instagram", href: "https://instagram.com/escudohomeconcept" },
    { label: "Facebook", href: "https://facebook.com/escudohomeconcept" },
  ],
} as const;

/** Header ve footer aynı diziden besleniyor — sıra burada değişir. */
export const mainNav = [
  { label: "Anasayfa", href: "/" },
  { label: "Ürünler", href: "/urunler" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "Dijital Katalog", href: "/katalog" },
  { label: "İletişim", href: "/iletisim" },
] as const;
