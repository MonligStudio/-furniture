/**
 * Ürün / kategori / katalog verisi.
 *
 * TEK KAYNAK burasıdır (`data/seed/*.json`); frontend aynı dosyaların
 * kopyasını `npm run sync:content` ile alır. Veri değiştiğinde script
 * yeniden çalıştırılmalı.
 */
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const seedDir = join(here, "..", "..", "data", "seed");

const read = async (name) =>
  JSON.parse(await readFile(join(seedDir, name), "utf8"));

/* Dosyalar süreç başlarken bir kez okunur; istek başına disk erişimi yok. */
export const [products, categories, catalogs] = await Promise.all([
  read("products.json"),
  read("categories.json"),
  read("catalogs.json"),
]);
