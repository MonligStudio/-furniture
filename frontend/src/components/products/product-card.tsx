import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MediaFrame } from "@/components/ui/media-frame";
import { categoryName, type Product } from "@/content/catalog";
import { cn } from "@/lib/utils";

/**
 * Ürün kartı — anasayfadaki "öne çıkanlar" şeridi ve ürünler sayfasındaki
 * ızgara aynı kartı kullanır.
 */
export function ProductCard({
  product,
  index = 0,
  className,
}: {
  product: Product;
  index?: number;
  className?: string;
}) {
  return (
    <Link
      href={`/urunler/${product.slug}`}
      className={cn("reveal group flex flex-col", className)}
      style={{ "--reveal-delay": `${(index % 3) * 90}ms` } as React.CSSProperties}
    >
      <MediaFrame
        src={product.image}
        alt={product.name}
        ratio="4/5"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <span className="edge-note text-fg-faint">
            {categoryName(product.category)}
          </span>
          <h3 className="mt-2 font-display text-[1.35rem] text-fg transition-colors duration-300 group-hover:text-accent">
            {product.name}
          </h3>
          <p className="mt-1.5 max-w-xs text-[0.95rem] text-fg-muted">
            {product.tagline}
          </p>
        </div>

        <span className="mt-1 flex flex-col items-end gap-3">
          {product.badge ? (
            <span className="rounded-none border border-accent/50 px-3 py-1 font-label text-[0.6rem] tracking-[0.16em] text-accent uppercase">
              {product.badge}
            </span>
          ) : null}
          <ArrowUpRight
            className="size-5 shrink-0 text-fg-faint transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent"
            strokeWidth={1.25}
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
