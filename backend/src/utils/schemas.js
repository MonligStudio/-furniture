/**
 * Form doğrulama şemaları.
 *
 * Mesajlar doğrudan kullanıcıya gösteriliyor; bu yüzden Türkçe ve
 * yönlendirici yazıldı.
 */
import { z } from "zod";

const name = z
  .string()
  .trim()
  .min(2, "Adınızı yazın.")
  .max(80, "Ad çok uzun.");

const phone = z
  .string()
  .trim()
  .min(10, "Telefon numarasını eksiksiz yazın.")
  .max(20, "Telefon numarası çok uzun.");

const email = z.string().trim().email("Geçerli bir e-posta yazın.");

/* Boş gelen isteğe bağlı alanlar `undefined` sayılsın. */
const optionalEmail = z.preprocess(
  (value) => (value === "" ? undefined : value),
  email.optional(),
);

const optionalPhone = z.preprocess(
  (value) => (value === "" ? undefined : value),
  phone.optional(),
);

const optionalText = (max) =>
  z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().trim().max(max, "Metin çok uzun.").optional(),
  );

/** İletişim sayfasındaki mesaj formu. */
export const contactSchema = z.object({
  name,
  phone,
  email: optionalEmail,
  subject: optionalText(120),
  message: z
    .string()
    .trim()
    .min(10, "Mesajınızı biraz daha açar mısınız?")
    .max(2000, "Mesaj çok uzun."),
});

/** Ürün detayındaki bilgi/teklif formu. */
export const quoteSchema = z.object({
  name,
  phone,
  email: optionalEmail,
  productSlug: z.string().trim().min(1),
  productName: z.string().trim().min(1),
  message: optionalText(2000),
});

/** Katalog PDF talebi. */
export const catalogRequestSchema = z.object({
  name,
  email,
  phone: optionalPhone,
  catalogSlug: z.string().trim().min(1).default("hepsi"),
});
