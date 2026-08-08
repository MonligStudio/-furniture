/**
 * Backend'e giden form istekleri.
 *
 * Ürün / katalog içeriği derleme anında `src/content` üzerinden geliyor;
 * backend'in işi FORMLARI kaydetmek (iletişim mesajı, ürün teklifi, katalog
 * talebi). Böylece API kapalıyken de site tamamen gezilebilir, yalnızca
 * form gönderimi çalışmaz ve kullanıcıya telefon numarası önerilir.
 *
 * Adres `.env.local` içindeki NEXT_PUBLIC_API_URL ile değişir.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4100";

export type FormState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "ok"; message: string }
  | { status: "error"; message: string };

type Payload = Record<string, unknown>;

async function post(path: string, payload: Payload) {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      typeof data?.message === "string"
        ? data.message
        : "İstek gönderilemedi. Lütfen daha sonra tekrar deneyin.",
    );
  }

  return data as { ok: true; message: string };
}

/** İletişim sayfasındaki mesaj formu. */
export const sendContactMessage = (payload: Payload) =>
  post("/api/contact", payload);

/** Ürün detayındaki "fiyat/bilgi iste" formu. */
export const sendQuoteRequest = (payload: Payload) =>
  post("/api/quotes", payload);

/** Katalog sayfasındaki "PDF gönderin" formu. */
export const sendCatalogRequest = (payload: Payload) =>
  post("/api/catalog-requests", payload);
