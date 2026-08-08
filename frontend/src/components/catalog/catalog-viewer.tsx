"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MediaFrame } from "@/components/ui/media-frame";
import { cn } from "@/lib/utils";

/**
 * Katalog okuyucu — sayfa sayfa ilerleyen basit görüntüleyici.
 *
 * PDF gömmek yerine sayfaların görselleri gösteriliyor: mobilde de akıcı
 * çalışıyor ve sayfa ağırlığı kontrol altında kalıyor.
 */
export function CatalogViewer({
  pages,
  title,
}: {
  pages: string[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const total = pages.length;

  const go = (next: number) => setIndex((next + total) % total);

  return (
    <div className="flex flex-col gap-5">
      <MediaFrame
        key={pages[index]}
        src={pages[index]}
        alt={`${title} — sayfa ${index + 1}`}
        ratio="16/11"
        sizes="(max-width: 1024px) 100vw, 70vw"
        priority
        className="animate-fade-up"
      />

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4 sm:gap-6">
        <span className="edge-note text-fg-faint">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>

        <div className="order-3 flex w-full flex-wrap justify-center gap-1.5 sm:order-none sm:w-auto">
          {pages.map((page, i) => (
            <button
              key={page}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Sayfa ${i + 1}`}
              aria-current={i === index}
              className={cn(
                "h-1.5 w-6 rounded-none transition-colors duration-300",
                i === index ? "bg-accent" : "bg-line hover:bg-line-strong",
              )}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Önceki sayfa"
            className="inline-flex size-10 items-center justify-center rounded-none border border-line text-fg-muted transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            <ChevronLeft className="size-4" strokeWidth={1.5} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Sonraki sayfa"
            className="inline-flex size-10 items-center justify-center rounded-none border border-line text-fg-muted transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            <ChevronRight className="size-4" strokeWidth={1.5} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
