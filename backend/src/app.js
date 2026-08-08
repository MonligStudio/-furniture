/**
 * Express uygulaması.
 *
 * Uç noktalar:
 *   GET  /api/health
 *   GET  /api/categories
 *   GET  /api/products            ?kategori= &q= &limit=
 *   GET  /api/products/:slug
 *   GET  /api/catalogs
 *   GET  /api/catalogs/:slug
 *   POST /api/contact
 *   POST /api/quotes
 *   POST /api/catalog-requests
 *   GET  /api/admin/*             (x-admin-token)
 */
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config.js";
import { adminRouter } from "./routes/admin.routes.js";
import { catalogRouter } from "./routes/catalog.routes.js";
import { formsRouter } from "./routes/forms.routes.js";
import { errorHandler, notFound } from "./middleware/errors.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(express.json({ limit: "64kb" }));

  app.use(
    cors({
      /* Origin listesi boşsa (ör. sunucudan sunucuya çağrı) izin ver. */
      origin: (origin, callback) => {
        if (!origin || config.allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        callback(new Error("CORS: bu adrese izin verilmiyor."));
      },
    }),
  );

  if (config.nodeEnv !== "test") app.use(morgan("dev"));

  app.get("/api/health", (req, res) => {
    res.json({ ok: true, service: "escudo-api", env: config.nodeEnv });
  });

  app.use("/api", catalogRouter);
  app.use("/api", formsRouter);
  app.use("/api/admin", adminRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
