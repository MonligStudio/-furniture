/**
 * Ürün / kategori / katalog verisinin TEK kaynağı `backend/data/seed`.
 *
 * Frontend bu dosyaları derleme anında (sunucu kapalıyken de) okuyabilsin
 * diye buradan `frontend/src/content/data` altına kopyalanır. Veriyi
 * değiştirdikten sonra:
 *
 *     npm run sync:content
 *
 * Böylece iki yerde ayrı ayrı düzenlenen, zamanla birbirinden ayrışan iki
 * kopya oluşmuyor.
 */
import { copyFile, mkdir, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "..", "data", "seed");
const target = join(here, "..", "..", "frontend", "src", "content", "data");

const files = (await readdir(source)).filter((file) => file.endsWith(".json"));
await mkdir(target, { recursive: true });

for (const file of files) {
  await copyFile(join(source, file), join(target, file));
  console.log(`✓ ${file} → frontend/src/content/data/${file}`);
}

console.log(`\n${files.length} dosya senkronlandı.`);
