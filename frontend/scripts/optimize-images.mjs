/**
 * GÖRSEL OPTİMİZASYONU — public/ altındaki her kareyi WebP'ye çevirir.
 *
 *     node scripts/optimize-images.mjs            # yanına .webp yazar
 *     node scripts/optimize-images.mjs --replace  # kaynağı siler
 *     node scripts/optimize-images.mjs --force    # var olanı yeniden üretir
 *
 * NEDEN GEREKLİ — `next/image` zaten AVIF/WebP servis ediyor ama:
 *   1. Optimizasyondan GEÇMEYEN kullanımlar var: öne çıkanlar ızgarasının
 *      önizleme kareleri (`--img-dark`/`--img-light` ile `background-image`),
 *      koleksiyon slider'ının çalışma anında ürettiği `img`ler ve sayfa
 *      geçişindeki `.ms-flip` kopyası. Bunlar dosyayı OLDUĞU GİBİ indiriyor.
 *   2. Kaynak ne kadar küçükse optimize edici de o kadar hızlı; ilk istekte
 *      beklenen süre kısalıyor.
 *   3. Depo ve dağıtım boyutu (JPEG kaynaklar ~50 MB idi).
 *
 * GERÇEK FOTOĞRAFA GEÇERKEN: fotoğrafları `public/` altına atıp bu scripti
 * `--replace` ile çalıştırmak yeterli; kod hep `.webp` uzantısını bekliyor.
 *
 * `MAX_EDGE`: kaynakların uzun kenarı bunu aşarsa küçültülür. Sitede hiçbir
 * kare 1600 CSS pikselinden geniş görünmüyor; daha büyük bir master hem
 * optimize ediciyi hem de yukarıdaki "ham" kullanımları boşuna yoruyor.
 */
import { readdir, stat, unlink } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = join(here, "..", "public");

/** Master kalitesi: sitede dağıtılan kare bundan bir kez daha geçebiliyor. */
const QUALITY = 78;
const MAX_EDGE = 1800;

const replace = process.argv.includes("--replace");
const force = process.argv.includes("--force");

/* Bayrak olmayan argümanlar `public/` altındaki alt klasörler: verilmezse
   tamamı taranır. */
const only = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
const roots = only.length
  ? only.map((name) => join(publicDir, name))
  : [publicDir];

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

let converted = 0;
let skipped = 0;
let before = 0;
let after = 0;

for (const root of roots) {
  for await (const source of walk(root)) {
    if (!/\.(jpe?g|png)$/i.test(extname(source))) continue;

    const target = source.replace(/\.(jpe?g|png)$/i, ".webp");
    if (!force && (await exists(target))) {
      skipped += 1;
      continue;
    }

    const image = sharp(source);
    const { width = 0, height = 0 } = await image.metadata();
    const longEdge = Math.max(width, height);

    await image
      .resize(
        longEdge > MAX_EDGE
          ? {
              width: width >= height ? MAX_EDGE : undefined,
              height: height > width ? MAX_EDGE : undefined,
            }
          : undefined,
      )
      .webp({ quality: QUALITY, effort: 6, smartSubsample: true })
      .toFile(target);

    before += (await stat(source)).size;
    after += (await stat(target)).size;
    converted += 1;

    if (replace) await unlink(source);
  }
}

const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1);
console.log(
  `${converted} kare çevrildi, ${skipped} atlandı.\n` +
    (converted
      ? `${mb(before)} MB → ${mb(after)} MB  (%${(100 - (after / before) * 100).toFixed(0)} küçülme)` +
        (replace ? "\nKaynak JPEG/PNG'ler silindi." : "\nKaynaklar duruyor — silmek için --replace.")
      : ""),
);
