/**
 * YER TUTUCU GÖRSEL + VİDEO ÜRETİCİ
 *
 * Taslakta gerçek fotoğraf/video yok; sayfaların boş kutularla değil,
 * paletle uyumlu sıcak tonlu karelerle değerlendirilebilmesi için
 * `public/` altındaki bütün görseller ffmpeg ile burada üretiliyor.
 *
 * Hangi dosyaların üretileceği içerik verisinden (products/categories/
 * catalogs JSON) okunuyor — yeni ürün eklendiğinde script yeniden
 * çalıştırılır:
 *
 *     node scripts/generate-placeholders.mjs
 *
 * GERÇEK FOTOĞRAFA GEÇERKEN: aynı adla `public/` altına koymak yeterli,
 * kodda değişiklik gerekmez. Bu script bir daha çalıştırılmazsa üretilen
 * kareler de kimseyi ezmez.
 */
import { execFile } from "node:child_process";
import { mkdir, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";

const run = promisify(execFile);
const here = dirname(fileURLToPath(import.meta.url));
const publicDir = join(here, "..", "public");
const dataDir = join(here, "..", "src", "content", "data");

const { default: products } = await import(join(dataDir, "products.json"), {
  with: { type: "json" },
});
const { default: categories } = await import(join(dataDir, "categories.json"), {
  with: { type: "json" },
});
const { default: catalogs } = await import(join(dataDir, "catalogs.json"), {
  with: { type: "json" },
});

/* Nötr, doygunluğu düşük tonlar: gölge → ışık alan yüzey.
   Palet "Siyah & Kemik" olduğu için yer tutucular da renk atmaz; grafit
   ve greige aralığında kalır. Orta tonda tutuluyorlar, böylece koyu
   temada siyah bir delik, aydınlık temada parlak bir leke olmuyorlar. */
const PALETTES = [
  ["0x2a2a2a", "0x6f6f6f"], // grafit
  ["0x2e2c29", "0x7a756d"], // greige
  ["0x262626", "0x636363"], // koyu gri
  ["0x302d29", "0x827b70"], // taupe
  ["0x282a29", "0x6d736e"], // taş
  ["0x2c2a27", "0x77706a"], // kum grisi
  ["0x242424", "0x5c5c5c"], // antrasit
  ["0x312e2a", "0x8a8177"], // açık taupe
];

/** Aynı dosya her çalıştırmada aynı rengi alsın diye basit bir hash. */
function paletteFor(path) {
  let hash = 0;
  for (const char of path) hash = (hash * 31 + char.charCodeAt(0)) % 9973;
  return PALETTES[hash % PALETTES.length];
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Tek kare: köşegen gradyan + film grenı + vinyet.
 *
 * ffmpeg kareyi PNG olarak boruya yazıyor, WebP'ye sharp çeviriyor:
 * sitedeki bütün görseller `.webp` (bkz. scripts/optimize-images.mjs) ama
 * Homebrew'un ffmpeg'i libwebp'siz derlenmiş olabiliyor — sharp zaten
 * bağımlılıklarda olduğu için kodlamayı ona bırakmak daha güvenli.
 */
async function makeImage(relative, width, height) {
  const target = join(publicDir, relative);
  await mkdir(dirname(target), { recursive: true });

  const [dark, light] = paletteFor(relative);
  /* Işık yönü de dosyaya göre değişsin: hep aynı köşeden gelmesin. */
  const flip = relative.length % 2 === 0;
  const source =
    `gradients=s=${width}x${height}:c0=${dark}:c1=${light}:c2=${dark}` +
    `:nb_colors=3:x0=${flip ? width * 0.1 : width * 0.85}:y0=${height * 0.12}` +
    `:x1=${flip ? width * 0.9 : width * 0.15}:y1=${height * 0.9}:d=1`;

  const { stdout } = await run(
    "ffmpeg",
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-f",
      "lavfi",
      "-i",
      source,
      "-frames:v",
      "1",
      "-vf",
      "noise=alls=9:allf=t+u,vignette=PI/5",
      "-f",
      "image2pipe",
      "-vcodec",
      "png",
      "-",
    ],
    { encoding: "buffer", maxBuffer: 128 * 1024 * 1024 },
  );

  await sharp(stdout)
    .webp({ quality: 78, effort: 6, smartSubsample: true })
    .toFile(target);

  return relative;
}

/** Anasayfa hero'sunun döngülü videosu (16 sn, sessiz). */
async function makeHeroVideo() {
  const target = join(publicDir, "video", "hero.mp4");
  await mkdir(dirname(target), { recursive: true });

  await run("ffmpeg", [
    "-hide_banner",
    "-loglevel",
    "error",
    "-f",
    "lavfi",
    "-i",
    "gradients=s=1920x1080:c0=0x000000:c1=0x565049:c2=0x1a1a1a:c3=0x0a0a0a" +
      ":nb_colors=4:x0=180:y0=120:x1=1740:y1=980:speed=0.007:d=16",
    "-t",
    "16",
    "-r",
    "25",
    "-vf",
    "noise=alls=7:allf=t,vignette=PI/4.5,format=yuv420p",
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "26",
    "-movflags",
    "+faststart",
    "-y",
    target,
  ]);

  /* Video yüklenene kadar görünen poster karesi — o da WebP. */
  const { stdout } = await run(
    "ffmpeg",
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-i",
      target,
      "-ss",
      "1",
      "-frames:v",
      "1",
      "-f",
      "image2pipe",
      "-vcodec",
      "png",
      "-",
    ],
    { encoding: "buffer", maxBuffer: 128 * 1024 * 1024 },
  );

  await sharp(stdout)
    .webp({ quality: 78, effort: 6, smartSubsample: true })
    .toFile(join(publicDir, "video", "hero-poster.webp"));

  return "video/hero.mp4 + hero-poster.webp";
}

/* ---- Üretilecek dosya listesi ---- */
const jobs = [];

for (const product of products) {
  for (const path of new Set([product.image, ...product.gallery])) {
    jobs.push([path, 1200, 1500]);
  }
}

for (const category of categories) {
  jobs.push([category.image, 1400, 1050]);
}

for (const catalog of catalogs) {
  jobs.push([catalog.cover, 900, 1200]);
  for (const page of catalog.pages) jobs.push([page, 1600, 1100]);
}

/* Verinin dışında kalan, koda gömülü kareler. Klasör `-dark`: site her
   kareyi tema başına ikiye ayırıyor (bkz. `lightMediaSrc`). */
jobs.push(["/showroom-dark/magaza.webp", 1600, 1000]);
jobs.push(["/showroom-dark/detay.webp", 1200, 1500]);
jobs.push(["/showroom-dark/vitrin.webp", 1200, 900]);

const force = process.argv.includes("--force");
let created = 0;
let skipped = 0;

for (const [path, width, height] of jobs) {
  const relative = path.replace(/^\//, "");
  if (!force && (await exists(join(publicDir, relative)))) {
    skipped += 1;
    continue;
  }
  await makeImage(relative, width, height);
  created += 1;
}

const videoPath = join(publicDir, "video", "hero.mp4");
if (force || !(await exists(videoPath))) {
  console.log("Hero videosu üretiliyor (birkaç saniye sürebilir)…");
  console.log(`✓ ${await makeHeroVideo()}`);
} else {
  console.log("• hero.mp4 zaten var, atlandı (--force ile yeniden üret)");
}

console.log(`\n${created} görsel üretildi, ${skipped} tanesi atlandı.`);
