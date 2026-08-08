/**
 * Anasayfa metinleri.
 *
 * Bölümlerin sırası `src/app/page.tsx` içinde; buradaki her blok o sıradaki
 * bir bölümü besliyor. Metin değişikliği için bileşenlere dokunmaya gerek yok.
 *
 * NOT: Sayısal iddialar (mutlu ev sayısı, kumaş adedi vb.) TASLAK değerdir,
 * yayına çıkmadan önce firmayla teyit edilmeli.
 */

import { publicAsset } from "@/lib/paths";

export const hero = {
  /* Başındaki yıl `site.founded`'dan geliyor: "1993 · Adana / Hayalpark" */
  eyebrow: "Adana · Hayalpark",
  lines: ["Evin karakterini", "mobilya kurar"],
  claim: "Salon · Köşe · Yemek odası · Yatak odası",
  scrollHint: "Kaydırın",
} as const;

export const manifesto = {
  no: "01",
  eyebrow: "Escudo Home Concept",
  lines: ["İyi ürün,", "iyi fiyat."],
  paragraphs: [
    "Otuz yılı aşkın süredir aynı işi yapıyoruz: bir evin içine giren mobilyayı, o evde yaşayan insana göre seçmek. Bu yüzden mağazamızda gördüğünüz her takımın kumaşı, ölçüsü ve modül kurgusu sizin salonunuza göre yeniden kurulabilir.",
    "Ürünlerimiz seçkin mimarlarca tasarlanıp İnegöl'de, son teknoloji makinelerle üretiliyor. Tasarımın raftaki hâliyle evdeki hâli arasındaki farkı kapatan şey ise ölçü, kumaş ve montaj — üçünü de biz üstleniyoruz.",
  ],
  signature: "Escudo Home Concept · Adana",
} as const;

export const stats = [
  { value: 1993, label: "Kuruluş yılı", format: "year" },
  { value: 32, suffix: "+", label: "Yıllık tecrübe" },
  { value: 5000, suffix: "+", label: "Döşenen ev" },
  { value: 120, suffix: "+", label: "Kumaş seçeneği" },
] as const;

export const whyUs = {
  no: "05",
  eyebrow: "Neden Escudo",
  lines: ["Mobilyanın", "arkasında", "duran ekip"],
  description:
    "Satış bittiğinde iş bitmiyor. Ölçüden montaja, kumaş değişiminden servise kadar aynı ekip ilgileniyor.",
  items: [
    {
      no: "01",
      title: "Seçkin mimar tasarımı",
      body: "Her koleksiyon, mobilya alanında çalışan mimarlarla birlikte kurgulanıyor. Oturum derinliği, kol yüksekliği ve sırt açısı ortalamaya göre değil, gerçek kullanıma göre belirleniyor.",
    },
    {
      no: "02",
      title: "İnegöl üretimi",
      body: "Ürünlerimiz Türkiye'nin mobilya merkezi İnegöl'de, son teknoloji makinelerle üretiliyor. İskelet kurutulmuş kayından, sünger yüksek yoğunluktan.",
    },
    {
      no: "03",
      title: "Ölçüye göre üretim",
      body: "Salonunuz standart değilse takım da standart olmak zorunda değil. Köşe yönü, modül sayısı ve toplam genişlik siparişte belirlenir.",
    },
    {
      no: "04",
      title: "Kendi montaj ekibimiz",
      body: "Teslimat ve montaj taşeronla değil, kendi ekibimizle yapılır. Kurulum sonrası ambalaj atıkları da bizde kalır.",
    },
  ],
} as const;

export const process = {
  no: "07",
  eyebrow: "Nasıl ilerliyoruz",
  lines: ["Mağazadan", "salona", "beş adım"],
  description:
    "Bir takımın seçilmesiyle eve girmesi arasında geçen süreci baştan söylüyoruz — sürpriz olmasın.",
  steps: [
    {
      no: "01",
      title: "Mağaza ziyareti",
      body: "Showroom'da takımları deneyin. Randevu şart değil; hafta içi öğleden sonra en sakin saatler.",
      duration: "1 saat",
      image: publicAsset("/process-dark/01-showroom-visit.webp"),
      alt: "Mobilya mağazasında koltuğu deneyen müşteriler ve onlara yardımcı olan danışman",
    },
    {
      no: "02",
      title: "Ölçü ve keşif",
      body: "Adana içinde ücretsiz ölçü hizmeti. Salonun planı, kapı genişliği ve asansör ölçüsü birlikte alınır.",
      duration: "1–2 gün",
      image: publicAsset("/process-dark/02-measurement.webp"),
      alt: "Salonda lazer metreyle duvar ve kapı ölçüsü alan keşif ekibi",
    },
    {
      no: "03",
      title: "Kumaş ve renk seçimi",
      body: "Kartela üzerinden kumaş, ayak ve dikiş rengi seçilir. Numune isteyip evde ışığa tutmanızı öneririz.",
      duration: "Aynı gün",
      image: publicAsset("/process-dark/03-fabric-selection.webp"),
      alt: "Oda ışığında karşılaştırılan kumaş kartelaları, ayak ve dikiş örnekleri",
    },
    {
      no: "04",
      title: "Üretim",
      body: "Sipariş İnegöl'e geçer. Stoktaki ürünlerde bu adım atlanır, özel ölçüde süre modele göre değişir.",
      duration: "2–5 hafta",
      image: publicAsset("/process-dark/04-production.webp"),
      alt: "Atölyede özel ölçü koltuğun kumaşını uygulayan döşeme ustaları",
    },
    {
      no: "05",
      title: "Teslimat ve montaj",
      body: "Kendi ekibimizle teslim edip kuruyoruz, ambalajı da biz topluyoruz. Kurulum sonrası kontrol birlikte yapılır.",
      duration: "1 gün",
      image: publicAsset("/process-dark/05-delivery-installation.webp"),
      alt: "Müşterinin evinde koltuk modüllerini kurup ambalajı toplayan montaj ekibi",
    },
  ],
} as const;

export const testimonials = [
  {
    quote:
      "Salonun ölçüsü standart değildi, köşe takımını 20 cm daraltarak ürettiler. Montaj ekibi de aynı gün geldi.",
    name: "Nurten A.",
    detail: "Çukurova / Adana · Güneş Köşe Takımı",
  },
  {
    quote:
      "Kumaş seçerken numuneyi eve götürüp ışığa tuttuk. Ekranda gördüğümüzden farklıydı, doğru seçim yapmamızı sağladılar.",
    name: "Serkan K.",
    detail: "Seyhan / Adana · Latte Salon Takımı",
  },
  {
    quote:
      "Yatak alırken mağazada birkaçını deneme şansı olması iyi oldu. Baza montajını da onlar yaptı.",
    name: "Elif D.",
    detail: "Yüreğir / Adana · Puffy Ortopedik Yatak",
  },
  {
    quote:
      "Üç yıl önce aldığımız yemek odasının bir sandalyesi kırıldı, tamir edip getirdiler. Beklemiyordum.",
    name: "Mehmet T.",
    detail: "Çukurova / Adana · Malta Yemek Odası",
  },
] as const;

export const faq = [
  {
    q: "Özel ölçü üretim yapıyor musunuz?",
    a: "Evet. Köşe takımlarında yön ve toplam genişlik, salon takımlarında modül sayısı ve oturum derinliği değiştirilebilir. Özel ölçüde üretim süresi modele göre 2–5 hafta arasında.",
  },
  {
    q: "Teslimat ve montaj ücretli mi?",
    a: "Adana içi teslimat ve montaj ücretsizdir, kendi ekibimizle yapılır. Şehir dışı gönderimlerde nakliye bedeli sipariş sırasında netleştirilir.",
  },
  {
    q: "Kumaşı sonradan değiştirebilir miyim?",
    a: "Sökülebilir kılıflı modellerde kılıf yenilenebilir, sabit döşemeli modellerde ise takım yeniden döşenir. İkisi için de mağazadan randevu alınıyor.",
  },
  {
    q: "Puffy yatakları mağazada deneyebilir miyim?",
    a: "Evet, Puffy yetkili satış noktasıyız. Farklı sertlik seviyelerini mağazadaki deneme alanında karşılaştırabilirsiniz.",
  },
  {
    q: "Ürünlerin garantisi ne kadar?",
    a: "İskelet ve mekanizmalarda üretici garantisi geçerlidir; süre modele göre değişir. Garanti kapsamı ve süresi fatura ile birlikte yazılı olarak verilir.",
  },
  {
    q: "Eski mobilyamı alıyor musunuz?",
    a: "Takas ve eski ürün alımı model bazında değerlendiriliyor. Mağazayı arayıp mevcut ürününüzün fotoğrafını iletmeniz yeterli.",
  },
] as const;

/** Bölümler arasındaki kayan şerit. */
export const marqueeItems = [
  "Salon takımları",
  "Köşe takımları",
  "Yemek odası",
  "Yatak odası",
  "Puffy yetkili satış",
  "Özel ölçü üretim",
  "İnegöl üretimi",
  "Adana içi ücretsiz montaj",
] as const;
