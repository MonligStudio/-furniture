/**
 * Ortam ayarları tek yerde toplanır; `.env` dosyası varsa okunur
 * (bkz. `.env.example`).
 */
import "dotenv/config";

export const config = {
  port: Number(process.env.PORT ?? 4100),
  nodeEnv: process.env.NODE_ENV ?? "development",

  /* Frontend'in adresi — CORS bu listeye göre açılır. */
  allowedOrigins: (
    process.env.ALLOWED_ORIGINS ?? "http://localhost:3000,http://localhost:5310"
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),

  /* Admin uçlarının `x-admin-token` başlığında beklediği değer.
     Yayına çıkmadan önce MUTLAKA değiştirilmeli. */
  adminToken: process.env.ADMIN_TOKEN ?? "escudo-degistir",

  /* Formların kaydedildiği JSON dosyasının adı (data/ altında). */
  dbFile: process.env.DB_FILE ?? "escudo.json",
};
