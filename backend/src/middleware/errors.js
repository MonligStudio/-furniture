/**
 * Hata biçimlendirme.
 *
 * İstemciye her zaman `{ ok: false, message }` dönüyoruz; frontend'deki
 * formlar bu mesajı doğrudan kullanıcıya gösteriyor, o yüzden mesajlar
 * Türkçe ve teknik ayrıntısız.
 */

/** Bilinen (kullanıcıya gösterilebilir) hata. */
export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function notFound(req, res) {
  res.status(404).json({ ok: false, message: "Böyle bir uç nokta yok." });
}

// eslint-disable-next-line no-unused-vars -- Express hata middleware'i 4 parametre ister
export function errorHandler(error, req, res, next) {
  const status = error.status ?? 500;

  if (status >= 500) console.error("[escudo-api]", error);

  res.status(status).json({
    ok: false,
    message:
      status >= 500
        ? "Sunucuda beklenmedik bir hata oluştu."
        : error.message,
    /* Doğrulama hatalarında hangi alanın sorunlu olduğunu da veriyoruz. */
    ...(error.fields ? { fields: error.fields } : {}),
  });
}
