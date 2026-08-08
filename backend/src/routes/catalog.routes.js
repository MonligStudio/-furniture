/**
 * Katalog verisi: ürünler, kategoriler ve dijital kataloglar.
 *
 * Frontend bu veriyi derleme anında kendi kopyasından okuyor; bu uçlar
 * ileride eklenecek yönetim paneli, mobil uygulama ya da pazaryeri
 * entegrasyonları için tek kaynağı dışa açıyor.
 */
import { Router } from "express";
import { catalogs, categories, products } from "../db/seed.js";
import { ApiError } from "../middleware/errors.js";

export const catalogRouter = Router();

catalogRouter.get("/categories", (req, res) => {
  res.json({ ok: true, count: categories.length, data: categories });
});

catalogRouter.get("/products", (req, res) => {
  const { kategori, q, limit } = req.query;
  let data = products;

  if (kategori) data = data.filter((item) => item.category === kategori);

  if (q) {
    const needle = String(q).toLocaleLowerCase("tr");
    data = data.filter((item) =>
      `${item.name} ${item.tagline} ${item.materials.join(" ")}`
        .toLocaleLowerCase("tr")
        .includes(needle),
    );
  }

  if (limit) data = data.slice(0, Number(limit));

  res.json({ ok: true, count: data.length, data });
});

catalogRouter.get("/products/:slug", (req, res, next) => {
  const product = products.find((item) => item.slug === req.params.slug);
  if (!product) return next(new ApiError(404, "Ürün bulunamadı."));

  res.json({ ok: true, data: product });
});

catalogRouter.get("/catalogs", (req, res) => {
  res.json({ ok: true, count: catalogs.length, data: catalogs });
});

catalogRouter.get("/catalogs/:slug", (req, res, next) => {
  const catalog = catalogs.find((item) => item.slug === req.params.slug);
  if (!catalog) return next(new ApiError(404, "Katalog bulunamadı."));

  res.json({ ok: true, data: catalog });
});
