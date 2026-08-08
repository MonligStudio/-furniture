# escudo-backend

Node.js + Express (ESM). İki iş yapar:

1. **Form kayıtlarını tutar** — iletişim mesajı, ürün bilgi talebi,
   katalog PDF talebi.
2. **İçerik API'sini sunar** — ürün, kategori ve katalog verisi.

## Çalıştırma

```bash
cp .env.example .env
npm install
npm run dev      # node --watch
```

Varsayılan adres: <http://localhost:4100>

## Uç noktalar

| Metot | Yol | Açıklama |
| --- | --- | --- |
| GET | `/api/health` | Servis ayakta mı |
| GET | `/api/categories` | Kategoriler |
| GET | `/api/products` | `?kategori=` `?q=` `?limit=` |
| GET | `/api/products/:slug` | Tek ürün |
| GET | `/api/catalogs` | Kataloglar |
| GET | `/api/catalogs/:slug` | Tek katalog |
| POST | `/api/contact` | İletişim mesajı |
| POST | `/api/quotes` | Ürün bilgi/teklif talebi |
| POST | `/api/catalog-requests` | Katalog PDF talebi |
| GET | `/api/admin/summary` | Kayıt sayıları |
| GET | `/api/admin/messages` | Gelen mesajlar |
| GET | `/api/admin/quotes` | Ürün talepleri |
| GET | `/api/admin/catalog-requests` | Katalog talepleri |

`/api/admin/*` uçları `x-admin-token` başlığı ister:

```bash
curl -H "x-admin-token: $ADMIN_TOKEN" http://localhost:4100/api/admin/summary
```

Yanıt biçimi her yerde aynı: başarılıysa `{ ok: true, ... }`, hatalıysa
`{ ok: false, message, fields? }`. Frontend'deki formlar `message` alanını
doğrudan kullanıcıya gösteriyor, bu yüzden mesajlar Türkçe.

## Klasörler

```
src/
├── app.js                 Express uygulaması, rota bağlama
├── server.js              Dinleme
├── config.js              Ortam ayarları
├── db/
│   ├── json-store.js      Dosya tabanlı kayıt deposu (kuyruklu yazma)
│   └── seed.js            data/seed/*.json okuma
├── middleware/
│   ├── admin-auth.js      x-admin-token kontrolü
│   ├── errors.js          ApiError + hata biçimlendirme
│   └── validate.js        Zod ile gövde doğrulama
├── routes/
│   ├── admin.routes.js
│   ├── catalog.routes.js
│   └── forms.routes.js
└── utils/schemas.js       Zod şemaları
data/
├── seed/                  Ürün / kategori / katalog verisi (TEK KAYNAK)
└── escudo.json            Form kayıtları (çalışınca oluşur, .gitignore'da)
```

## Veri deposu neden JSON?

Bu API'nin tuttuğu şey günde birkaç form kaydı. JSON dosyası hem yeterli
hem de sunucuya veritabanı kurulumu gerektirmiyor. Yazmalar sıraya alınıp
önce geçici dosyaya yapılıyor, sonra `rename` ile yerine taşınıyor —
eşzamanlı istekler birbirini ezmiyor, yarıda kesilen yazma dosyayı
bozmuyor.

Postgres/MySQL'e geçilecekse dokunulacak tek dosya `src/db/json-store.js`
(`insert`, `list`, `counts` fonksiyonlarını karşılamak yeterli).

## Eksikler / sonraki adımlar

- **Bildirim yok**: form kaydı düşünce e-posta/SMS gitmiyor. Eklenecekse
  `routes/forms.routes.js` içindeki `insert` çağrısından sonra tek bir
  servis çağrısı yeterli (nodemailer, Resend, Netgsm vb.).
- **Rate limit yok**: yayına çıkarken `express-rate-limit` ile POST
  uçlarına sınır konmalı.
- **Admin paneli yok**: kayıtlar şimdilik yalnızca API'den okunuyor.
