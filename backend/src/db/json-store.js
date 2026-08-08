/**
 * Küçük, dosya tabanlı veri deposu.
 *
 * Neden veritabanı değil: bu API'nin işi birkaç form kaydını tutmak ve
 * seed'deki ürün/katalog verisini sunmak. Bir mağaza sitesi için günde
 * onlarca kayıt söz konusu; JSON dosyası hem yeterli hem de sunucuya
 * kurulum gerektirmiyor (Postgres/MySQL'e geçilecekse yalnızca bu dosyanın
 * arayüzü karşılanır).
 *
 * Yazma işlemleri sıraya alınır: iki istek aynı anda kaydederse biri
 * diğerinin yazdığını ezmesin.
 */
import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { config } from "../config.js";

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, "..", "..", "data");
const dbPath = join(dataDir, config.dbFile);

/** Kayıt tutulan koleksiyonlar. */
const EMPTY = {
  messages: [],
  quotes: [],
  catalogRequests: [],
};

let cache = null;
/** Yazma kuyruğu — her yazma bir öncekini bekler. */
let queue = Promise.resolve();

async function load() {
  if (cache) return cache;

  try {
    const raw = await readFile(dbPath, "utf8");
    cache = { ...structuredClone(EMPTY), ...JSON.parse(raw) };
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    cache = structuredClone(EMPTY);
  }

  return cache;
}

async function persist(data) {
  await mkdir(dataDir, { recursive: true });
  /* Önce geçici dosyaya yazıp taşıyoruz: yazma yarıda kesilirse mevcut
     kayıtlar bozulmasın. */
  const temp = `${dbPath}.${randomUUID()}.tmp`;
  await writeFile(temp, JSON.stringify(data, null, 2), "utf8");
  await rename(temp, dbPath);
}

/** Bir koleksiyona kayıt ekler ve eklenen kaydı döndürür. */
export function insert(collection, payload) {
  const task = queue.then(async () => {
    const data = await load();
    if (!data[collection]) data[collection] = [];

    const record = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      status: "new",
      ...payload,
    };

    data[collection].push(record);
    await persist(data);
    return record;
  });

  /* Bir istek hata verse bile kuyruk kilitlenmesin. */
  queue = task.catch(() => {});
  return task;
}

/** Koleksiyondaki kayıtları en yeniden eskiye döndürür. */
export async function list(collection, { limit = 100 } = {}) {
  const data = await load();
  return [...(data[collection] ?? [])].reverse().slice(0, limit);
}

/** Basit sayaç — admin panelinin özet satırı için. */
export async function counts() {
  const data = await load();
  return Object.fromEntries(
    Object.keys(EMPTY).map((key) => [key, (data[key] ?? []).length]),
  );
}
