# Escudo Home Concept — web sitesi (taslak)

Adana'daki **Escudo Home Concept** mobilya mağazası için hazırlanan site
taslağı. İki bağımsız uygulamadan oluşuyor:

```
escudo/
├── frontend/   Next.js 16 + Tailwind v4 — sitenin kendisi
└── backend/    Node.js + Express — form kayıtları ve içerik API'si
```

## Hızlı başlangıç

İki ayrı terminalde:

```bash
cd backend && cp .env.example .env && npm install && npm run dev
```

```bash
cd frontend && cp .env.example .env.local && npm install && npm run dev
```

- Site: <http://localhost:3000>
- API: <http://localhost:4100/api/health>

Backend kapalıyken site tamamen gezilebilir; yalnızca form gönderimi
çalışmaz (kullanıcıya mağaza telefonu gösterilir).

## Sayfalar

| Yol | İçerik |
| --- | --- |
| `/` | Tam ekran video hero + 12 bölümlük uzun anasayfa |
| `/urunler` | Koleksiyon şeridi + filtrelenebilir ürün ızgarası (`?kategori=` ile derin bağlantı) |
| `/urunler/[slug]` | Ürün detayı: galeri, ölçüler, kumaş, bilgi formu |
| `/koleksiyon/[slug]` | Koleksiyon sayfası: tam genişlik hero görseli, özet, o koleksiyonun ürünleri |
| `/hakkimizda` | Hikâye, zaman çizelgesi, üretim, değerler, ekip |
| `/katalog` | Dijital katalog listesi + PDF talep formu |
| `/katalog/[slug]` | Sayfa sayfa katalog görüntüleyici |
| `/iletisim` | İletişim kanalları, mesaj formu, mağaza bilgileri |

Footer tüm sayfalarda tam ekrandır ve en altta dev **ESCUDO** harfleriyle
biter.

## Tasarım

### Tipografi — logodan türetildi

Logo iki satır: ağır, geniş, geometrik bir grotesk olan **ESCUDO** ve
altında çok daha ince, çok daha geniş harf aralıklı **HOME CONCEPT**.
Site aynı iki davranışı tekrar eder:

| Kullanım | Font | Ayar |
| --- | --- | --- |
| Başlıklar (`.display`) | Montserrat 800 | BÜYÜK HARF, nötr harf aralığı |
| Mikro etiketler (`.eyebrow`, `.chapter`, `.edge-note`) | Montserrat 400 | BÜYÜK HARF, 0.26–0.32em aralık |
| Kelime işareti | Montserrat 800 + 300 | 0.16em / 0.44em aralık |
| Gövde metni | Manrope | normal |

Montserrat logodaki harf karakterinin en yakın karşılığı; başlıklar da
mikro etiketler de tek aileden beslendiği için logo ve site aynı sesi
konuşuyor. Kelime işareti `components/layout/wordmark.tsx` içinde tek
yerde tanımlı.

### Renk — "Siyah & Kemik"

- **Koyu tema (varsayılan)**: saf **siyah** (`#000`) zemin, **kemik
  beyazı** (`#EDE8E0`) metin.
- **Aydınlık tema**: saf beyaz değil, **kemik beyazı kâğıt** (`#F1EDE6`)
  zemin ve mürekkep siyahı (`#121212`) metin.
- Vurgu rengi ayrı bir renk **değil**: kemik beyazının kendisi. Palet
  monokrom; tek sıcak üçüncül ton (taupe `#857A6C`) yalnızca ince
  çizgi, gölge ve hover izinde görünür.
- Ara tonlar (`ink-900…600`) sadece kart/panel/input yüzeyi içindir;
  bölüm ayırmak için kullanılmaz — site baştan sona **tek arkaplan**.
- Köşeler keskin (`--radius-card: 2px`), düğmeler kare — logonun
  geometrik karakterine uyacak şekilde.

### Yerleşim ve hareket

- **Header üç sütun**: solda bağlantılar, ortada kelime işareti, sağda
  düğmeler. Zemin tamamen şeffaf; sayfadan yalnızca alt kenardaki ince
  çizgi ayırır ve o çizgi ekranın **bir ucundan diğerine** uzanır.
  Videonun üstündeyken açık renk palete geçer.
- **Hero ortalanmış ve küçük**: ekranı kaplayan görüntünün üstünde asıl
  işi görüntü yapar, metin onu bastırmaz.
- Metin animasyonları: satır maskesi (`.line-mask` + `.roll`), scroll
  reveal (`.reveal`), kayan şerit (`.marquee-track`), footer'da harf harf
  GSAP açılışı.
- Tema geçişi sayfanın **alt ortasından** dışarı doğru genişleyen
  bulanık bir daireyle yapılır (View Transitions API).

## Veri akışı

Ürün / kategori / katalog verisinin **tek kaynağı** `backend/data/seed/`.
Frontend'in derleme anında okuduğu kopya buradan üretilir:

```bash
cd backend && npm run sync:content
```

Bu komut `backend/data/seed/*.json` dosyalarını
`frontend/src/content/data/` altına kopyalar. Veri değişince komutu
yeniden çalıştırın — iki yerde ayrı ayrı düzenlenen kopyalar oluşmasın.

## Medya

`frontend/public/` altındaki bütün görseller ve hero videosu şu an
**ffmpeg ile üretilmiş yer tutuculardır**:

```bash
cd frontend && node scripts/generate-placeholders.mjs          # eksikleri üretir
cd frontend && node scripts/generate-placeholders.mjs --force  # hepsini yeniden üretir
```

**Bütün kareler WebP.** Her fotoğrafın tema başına iki sürümü var:
`-dark` (akşam) ve `-light` (gündüz); kod `-dark` yolunu yazar, ikizini
`lightMediaSrc` türetir. Gerçek fotoğraflar JPEG geldiğinde:

```bash
cd frontend && node scripts/optimize-images.mjs --replace   # WebP'ye çevirip kaynağı siler
```

Aynı dosya adlarıyla (uzantı `.webp`) değiştirmek yeterli — kodda
değişiklik gerekmiyor. Öncelik sırası:

1. `public/video/hero-dark-static.mp4` + `hero-light-day-static.mp4` ve
   `hero-poster-*.webp` — anasayfanın tam ekran videosu
2. `public/products-{dark,light}/*.webp` — ürün fotoğrafları (4:5)
3. `public/collections-{dark,light}/*.webp` — kategori kapakları (4:3)
4. `public/showroom-{dark,light}/*.webp` — mağaza fotoğrafları
5. `public/catalog-{dark,light}/<katalog>/*.webp` — katalog sayfaları

## Taslak içerik uyarısı

Firmanın **kamuya açık** bilgileri korundu: 1993 kuruluşu, "iyi ürün, iyi
fiyat" ilkesi, Adana / Hayalpark mağazası, İnegöl üretimi, Puffy yatak
yetkili satış noktası, Instagram'da görülen ürün adları (Latte, Alfa,
Malta, Güneş, Gold, Titanyum).

Bunların dışındaki **her şey taslaktır** ve yayına çıkmadan önce teyit
edilmeli:

- Ürün ölçüleri, kumaş ve renk listeleri
- Rakamlar (döşenen ev sayısı, kumaş seçeneği sayısı, tecrübe yılı)
- Zaman çizelgesindeki ara tarihler (2004, 2013, 2019, 2024)
- Müşteri yorumları
- Çalışma saatleri
- Kurumsal e-posta adresi (`site.ts` içinde TODO olarak işaretli)

Fiyat bilgisi bilinçli olarak yazılmadı; ürün detayında "fiyat için
arayın" yönlendirmesi var.
# -furniture
