"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowDown, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { categories, products } from "@/content/catalog";
import { cn } from "@/lib/utils";

/**
 * Ürünler sayfasının ürün listesi — VARSAYILAN OLARAK KAPALI.
 *
 * Sayfanın işi koleksiyonları göstermek (bkz. `category-strip.tsx`); ürün
 * ızgarası onların altında kendiliğinden açılmıyor, kullanıcı "Tüm ürünler"
 * düğmesine basarsa açılıyor. Koleksiyon kartları listenin üstünde
 * kalmaya devam ediyor.
 *
 * Liste açıkken seçili kategori adres çubuğunda tutuluyor
 * (`/urunler?kategori=...`); böylece filtrelenmiş liste paylaşılabiliyor ve
 * o adresle gelindiğinde liste doğrudan açık başlıyor.
 */
export function ProductExplorer() {
  const router = useRouter();
  const params = useSearchParams();
  const active = params.get("kategori") ?? "hepsi";
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  /* Adreste kategori varsa liste düğmeye basılmadan da açık gelir. */
  const open = expanded || active !== "hepsi";

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr");
    return products.filter((product) => {
      const inCategory = active === "hepsi" || product.category === active;
      if (!inCategory) return false;
      if (!needle) return true;
      return `${product.name} ${product.tagline} ${product.materials.join(" ")}`
        .toLocaleLowerCase("tr")
        .includes(needle);
    });
  }, [active, query]);

  const select = (slug: string) => {
    /* `scroll: false` — filtre değişince sayfa başa fırlamasın. */
    router.replace(slug === "hepsi" ? "/urunler" : `/urunler?kategori=${slug}`, {
      scroll: false,
    });
  };

  const close = () => {
    setExpanded(false);
    setQuery("");
    /* Adreste kategori kalırsa liste kapanmaz — filtre de sıfırlanıyor. */
    if (active !== "hepsi") router.replace("/urunler", { scroll: false });
  };

  const chips = [{ slug: "hepsi", name: "Hepsi" }, ...categories];

  return (
    <section className="pb-[clamp(4rem,9vw,8rem)]" id="tum-urunler">
      <div className="shell">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-5">
          <h2 className="chapter">
            <b>{String(products.length).padStart(2, "0")}</b>
            Tüm ürünler
          </h2>
          <p className="edge-note text-fg-faint">
            Koleksiyon ayırmadan bütün parçalar
          </p>
        </div>

        {!open ? (
          <div className="mt-8 flex flex-col items-center gap-6 border border-line px-6 py-[clamp(2.75rem,7vw,4.5rem)] text-center">
            <p className="max-w-lg text-[0.98rem] text-fg-muted">
              Yukarıdaki koleksiyonlardan birine girebilir ya da mağazada
              sergilenen {products.length} parçanın tamamını tek listede
              görebilirsiniz.
            </p>
            <Button type="button" onClick={() => setExpanded(true)}>
              Tüm ürünleri göster
              <ArrowDown className="size-4" strokeWidth={1.5} aria-hidden />
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-8 flex flex-col gap-6 border-b border-line pb-5 lg:flex-row lg:items-center lg:justify-between">
              <div
                className="flex flex-wrap gap-2"
                role="tablist"
                aria-label="Kategoriler"
              >
                {chips.map((chip) => (
                  <button
                    key={chip.slug}
                    type="button"
                    role="tab"
                    aria-selected={active === chip.slug}
                    onClick={() => select(chip.slug)}
                    className={cn(
                      "h-9 rounded-none border px-4 font-label text-[0.68rem] tracking-[0.14em] uppercase transition-colors duration-300",
                      active === chip.slug
                        ? "border-accent bg-accent text-ink-950"
                        : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
                    )}
                  >
                    {chip.name}
                  </button>
                ))}
              </div>

              <div className="flex flex-col items-stretch gap-5 sm:flex-row sm:items-center">
                <label className="flex flex-1 items-center gap-3 border-b border-line pb-2 lg:w-64 lg:flex-none">
                  <Search
                    className="size-4 shrink-0 text-fg-faint"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <span className="sr-only">Ürün ara</span>
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Ürün ya da kumaş ara"
                    className="w-full bg-transparent font-label text-[0.72rem] tracking-[0.1em] text-fg placeholder:text-fg-faint focus:outline-none"
                  />
                </label>

                <button
                  type="button"
                  onClick={close}
                  className="inline-flex shrink-0 items-center gap-2 font-label text-[0.62rem] tracking-[0.2em] text-fg-faint uppercase transition-colors duration-300 hover:text-fg"
                >
                  <X className="size-3.5" strokeWidth={1.5} aria-hidden />
                  Listeyi gizle
                </button>
              </div>
            </div>

            <p className="edge-note mt-6 text-fg-faint">
              {filtered.length} ürün
              {active !== "hepsi"
                ? ` · ${categories.find((c) => c.slug === active)?.name ?? ""}`
                : ""}
            </p>

            {filtered.length > 0 ? (
              <div className="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((product, i) => (
                  <ProductCard
                    key={product.slug}
                    product={product}
                    index={i}
                    /* Filtre değişince kartlar yeniden mount olduğu için
                       reveal'i beklemeden görünür gelsinler. */
                    className="is-in"
                  />
                ))}
              </div>
            ) : (
              <div className="mt-16 border border-line py-20 text-center">
                <p className="font-display text-[1.4rem] text-fg">Sonuç yok</p>
                <p className="mt-3 text-fg-muted">
                  Aradığınız ürünü mağazada bulabiliriz — bizi arayın.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
