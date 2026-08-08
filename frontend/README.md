# escudo-frontend

Next.js 16 (App Router) + Tailwind v4 + GSAP + Lenis + next-themes.
Fontlar: **Montserrat** (başlık + etiket, logodan) ve **Manrope** (gövde),
ikisi de `next/font/google` ile paketleniyor.

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Klasörler

```
src/
├── app/
│   ├── layout.tsx           Fontlar, tema, Lenis, header, tam sayfa footer
│   ├── globals.css          Tasarım token'ları + animasyon sınıfları
│   ├── page.tsx             Anasayfa (bölüm sırası burada)
│   ├── urunler/             Liste + [slug] detay
│   ├── hakkimizda/
│   ├── katalog/             Liste + [slug] görüntüleyici
│   ├── iletisim/
│   ├── not-found.tsx, sitemap.ts, robots.ts
├── components/
│   ├── layout/              header, wordmark, page-hero, site-footer (+css)
│   ├── home/                Anasayfanın 13 bölümü, her biri tek dosya
│   ├── products/            Kart, ızgara/filtre, galeri, teklif formu
│   ├── catalog/             Görüntüleyici, PDF talep formu
│   ├── contact/             İletişim formu
│   ├── ui/                  button, field, accordion, counter, marquee,
│   │                        section-heading, media-frame, theme-toggle,
│   │                        grid-preview (+css) — ızgaradan önizlemeye
│   ├── providers/           theme-provider, smooth-scroll (Lenis+GSAP),
│   │                        scroll-reset (rota değişiminde scroll + refresh),
│   │                        media-scrub (görsellerin scroll hareketi)
│   └── reveal-engine.tsx    .reveal öğelerini görünürlükte açar
├── content/                 BÜTÜN METİNLER burada
│   ├── site.ts              Marka, iletişim, menü
│   ├── home.ts              Anasayfa metinleri
│   ├── about.ts             Hakkımızda metinleri
│   ├── catalog.ts           Ürün/kategori/katalog okuma katmanı
│   └── data/*.json          backend/data/seed'den kopyalanır (elle düzenlenmez)
└── lib/                     api.ts (form gönderimi), utils.ts
```

Yerel font dosyası yok — Montserrat ve Manrope `next/font/google` ile
derleme sırasında paketleniyor.

Metin değişikliği için bileşenlere dokunmak gerekmiyor: `src/content/`
altındaki dosyalar yeterli.

## Tasarım kuralları

- **Tek arkaplan**: bölümler kendi zeminini boyamaz, `--color-ink-950`
  baştan sona aynıdır (koyu temada saf siyah). Ayrım çizgilerle ve
  boşlukla yapılır.
- **Renk yalnızca token'dan**: `bg-ink-800`, `text-fg-muted`,
  `border-line` gibi. Doğrudan hex yazılırsa aydınlık tema bozulur.
- **Vurgu ayrı bir renk değil**: `--color-accent` koyu temada kemik
  beyazı, aydınlık temada mürekkep siyahıdır. Palet monokrom kalsın diye
  renkli bir vurgu eklenmemeli; sıcaklık gerekiyorsa `accent-deep`
  (taupe) ince çizgi/gölge olarak kullanılır.
- **Tipografi**: başlıklar `.display` (Montserrat 800, BÜYÜK HARF,
  nötr harf aralığı), mikro etiketler `.eyebrow` / `.chapter` /
  `.edge-note` (Montserrat 400, geniş aralık — logonun alt satırı).
  Yeni bir etiket için bu üç sınıftan biri kullanılmalı, elle
  `tracking-*` verilmemeli.
- **Köşeler keskin**: `rounded-full` yalnızca madde imi noktalarında
  kullanılır; düğme, çip ve kartlar karedir.
- **Görsel üstü metin**: `.media-layer` sınıfı token'ları koyu palete
  sabitler; video/fotoğraf üstündeki yazı iki temada da açık kalır.
- **Animasyon**: `.reveal` (scroll), `.line-mask` (bölüm başlıkları),
  `.roll` (sayfa açılışında hero), `.marquee-track` (kayan şerit).

## Bilinen tuzaklar

- `html { scroll-behavior: smooth }` **eklenmemeli** — Lenis zaten yumuşak
  kaydırıyor, ikisi birlikte programatik scroll'u kilitliyor.
- framer-motion `useScroll` Lenis altında donuyor; scroll'a bağlı ölçüm
  gerekiyorsa GSAP ScrollTrigger kullanın.
- Gömülü önizleme sekmelerinde rAF kısılabiliyor. `?lenis=0` sorgusu
  yumuşak kaydırmayı kapatır (yalnızca hata ayıklama için).
- `SplitText` kullanılmıyor: React strict mode'da satırları ikiye
  katlıyor. Satır maskesi elle sarmalanmış span'lerle yapılıyor.
- Tema düğmesindeki ikon geçişi **saf CSS**; JS tabanlı bir animasyon
  kütüphanesine bağlanırsa rAF'ın kısıldığı ortamlarda (arka plandaki
  sekme, gömülü önizleme) başlangıç karesinde donup görünmez kalıyor.
- **Rota değişiminde `resetScroll()` şart** (bkz. `providers/scroll-reset`).
  Lenis kendi hedef konumunu koruduğu için Next'in `scrollTo(0, 0)`
  çağrısını bir sonraki karede geri alıyor; yeni sayfa kısaysa eski konum
  sayfanın sonuna kırpılıp kullanıcı doğrudan footer'da açılıyor. Aynı
  yerde `ScrollTrigger.refresh()` de çağrılıyor, yoksa sabit footer eski
  ölçülerle kilitli kalıyor.

## Görsel hareket motoru (`providers/media-scrub`)

Sayfadaki `[data-media-scrub]` katmanlarının hepsini tek merkezden, GSAP
ScrollTrigger ile sürer:

- **Scrub:** görsel, çerçevesinin içinde scroll'a bağlı olarak yavaşça
  kayar (`yPercent`, `scrub: true`).
- **Giriş:** ilk kez görünür alana girdiğinde alttan açılan bir maskeyle
  (`clip-path: inset()`) ve hafif küçülerek yerine oturur.

`MediaFrame` görselleri `.media-scrub` katmanına sarıyor; katman
çerçeveden **%8 taşkın** duruyor ki kayarken kenarda boşluk açılmasın.
Hareket `img`e değil bu katmana yazılıyor — böylece `img` üstündeki CSS
hover büyütmesiyle çakışmıyor.

Miktar görsel başına `scrubAmount` (yüzde, varsayılan 6), tamamen kapatmak
için `scrub={false}`. **Dinamik değişen görsellerde kapatın**: motor
yalnızca rota değişiminde kuruluyor, `key` ile yeniden bağlanan bir
`MediaFrame` (ör. ürün galerisi) tetikleyicisiz kalır.

## Koleksiyon slider'ı (`home/collection-slider`)

Anasayfadaki koleksiyonlar bölümü. Ortada iki banda bölünmüş görsel
kutusu, arkasında yatay kayan başlık şeridi (aynı anda üç başlık, ortadaki
etkin). Tıklama, ok tuşları ve ileri/geri düğmeleriyle ilerler; yeni
görsel iki banda da eklenip sağdan sola açılan maskeyle ve
`scale(2) → scale(1)` ile girer, eskiyenler silinir.

Sonsuz döngü için şerit `[son, ...koleksiyonlar, ilk]` olarak basılıyor;
uca gelindiğinde geçiş bittikten sonra eşdeğer başlığa animasyonsuz
atlanıyor. Slider JS'e bağlı olduğu için koleksiyonların tamamı ayrıca
`sr-only` bir listede gerçek bağlantı olarak duruyor.

**Görsele tıklamak = koleksiyon sayfasına giriş.** Kare, gövdeye eklenen
sabit bir kopyayla (`.ms-flip`) ekranı kaplayacak şekilde büyür, iki bant
tek kareye birleşir, sonra `/koleksiyon/[slug]` sayfasına geçilir. Kopya
**gövdeye** ekleniyor: slider'ın üstündeki katmanlarda `overflow: hidden`
ve `will-change: transform` var, `position: fixed` bir çocuk orada
kırpılırdı. Gezinmeden ~0.4 sn sonra kopya sönüyor — hedef sayfanın
hero'su aynı görseli tam genişlikte gösterdiği için geçiş kesintisiz
görünüyor.

Bu yüzden **hero ile slider'ın kadrajı aynı kalmalı**: koleksiyon
sayfasının hero'su (`collections/collection-hero.tsx`) bilerek
`MediaFrame` kullanmıyor — oradaki `.media-scrub` katmanı görseli
çerçeveden taşırıyor ve geçiş "zıplardı".

Animasyon herhangi bir sebeple bitmezse diye 1 sn'lik bir emniyet
zamanlayıcısı da gezinmeyi tetikliyor.

## Izgaradan önizlemeye (`ui/grid-preview`)

Anasayfadaki **öne çıkan ürünler** bölümü bu bileşeni kullanıyor. Bir
kutunun üstüne gelince büyük bir önizleme paneli açılır: paneldeki opak
kapak artı (+) biçiminde kapanarak görseli açığa çıkarır, panelin
kapattığı kutular sönerek dışa dağılır, önizleme o öğenin karelerini
sırayla gösterir.

| Kip | Davranış |
| --- | --- |
| `split` | Izgara ikiye bölünür; hover edilen kutunun **karşı** yarısında panel açılır. Sütun sayısı çift, öğe sayısı sütun × 2 olmalı (öne çıkan ürünler: 4 sütun, 8 ürün) |
| `full` | Tek panel bütün bloğu kaplar; ızgara ikiye bölünemediğinde kullanılır |

Etki imleçli ve geniş ekranlarda çalışır; altında ve "hareketi azalt"
açıkken sade bir ızgara olarak kalır.

**Genişlik koşulu JS'ten okunmaz.** Kurulum hidrasyon sırasında
çalışıyor ve o anda `window.innerWidth` bazı ortamlarda (gömülü ya da
arka plandaki paneller) **0** dönüyor; `min-width` kontrolüne bakan tek
seferlik bir gate etkiyi kalıcı olarak kapatıyordu. Bunun yerine
önizleme katmanının hesaplanmış `display` değerine bakılıyor — kaynak
tek: CSS'teki media query — ve karar her hover'da yeniden veriliyor.
Aynı sebeple zaman çizelgesindeki `vw` hesapları
`document.documentElement.clientWidth` üzerinden yapılıyor, kutuların
dağılması da `vw` yerine `xPercent`/`yPercent` ile.

`split` kipi tam 8 öğe beklediği için `products.json` içinde tam 8 ürün
`featured` işaretli — yeni ürün öne çıkarılacaksa başka birinin işareti
kaldırılmalı.

## Medya

Bkz. kök dizindeki `README.md` → *Medya*. Kısaca:

```bash
node scripts/generate-placeholders.mjs
```
