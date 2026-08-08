"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Wordmark } from "@/components/layout/wordmark";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { mainNav, site } from "@/content/site";
import { cn, normalizePath } from "@/lib/utils";

/**
 * Site başlığı — üç sütun: SOLDA bağlantılar, ORTADA kelime işareti,
 * SAĞDA düğmeler.
 *
 * - Zemin ŞEFFAF; sayfadan yalnızca alt kenardaki ince çizgi ayırır ve o
 *   çizgi `shell` kabının dışında, EKRANIN BİR UCUNDAN DİĞERİNE uzanır.
 * - Tam ekran hero görselinin üstündeyken `media-layer` paletine geçer;
 *   aydınlık temada `hero-header` bunun gündüz kontrastını uygular.
 * - Aşağı kaydırıldığında okunabilirlik için arkasına hafif bulanıklık
 *   gelir — zemin yine opak değildir.
 * - Mobilde: solda menü düğmesi, ortada işaret, sağda tema düğmesi.
 */
export function Header() {
  const pathname = usePathname();
  const route = normalizePath(pathname);
  const isHome = route === "/";
  const hasMediaHero =
    isHome || /^\/(?:koleksiyon|urunler)\/[^/]+$/.test(route);

  /* Menünün açık olduğu rota tutuluyor; `open` bundan TÜRETİLİYOR.
     Böylece rota değişince menü kendiliğinden kapanıyor — kapatmak için
     ayrı bir effect (ve gereksiz bir ikinci render) gerekmiyor. */
  const [menuRoute, setMenuRoute] = useState<string | null>(null);
  const open = menuRoute === pathname;
  const setOpen = (next: boolean) => setMenuRoute(next ? pathname : null);
  /* Tam ekran görsel/video hero'sunun üstünde miyiz? */
  const [overHero, setOverHero] = useState(hasMediaHero);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setOverHero(hasMediaHero && y < window.innerHeight - 90);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [hasMediaHero]);

  /* Gövde kilidi + Escape + odak tuzağı */
  useEffect(() => {
    if (!open) return;

    const trigger = buttonRef.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        /* Doğrudan state setter'ı (kararlı referans) — `setOpen` her
           render'da yeniden üretildiği için effect'e bağımlılık olamaz. */
        setMenuRoute(null);
        return;
      }
      if (event.key !== "Tab") return;

      const items = Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        ) ?? [],
      );
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      trigger?.focus();
    };
  }, [open]);

  /* Panel açıkken ya da videonun üstündeyken koyu (media) palet. */
  const onMedia = overHero || open;

  return (
    <>
      <header
        className={cn(
          /* Çizgi header'ın kendisinde: shell kabının içinde değil, tam
             genişlikte — ekranın bir ucundan diğerine uzanır. */
          "fixed inset-x-0 top-0 z-60 border-b transition-colors duration-500",
          onMedia ? "media-layer border-fg/15" : "border-line",
          overHero && !open && "hero-header",
          scrolled && !onMedia && "bg-ink-950/70 backdrop-blur-md",
          scrolled && onMedia && "backdrop-blur-[2px]",
        )}
      >
        {/* Satır `shell` kabını KULLANMAZ: bağlantılar ekranın soluna,
            düğmeler sağına yaslansın ve ortadaki kelime işareti geniş bir
            boşlukta tek başına kalsın diye tam genişliktedir. */}
        <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-4 px-[clamp(1rem,2vw,1.75rem)] py-3.5 sm:py-4">
          {/* SOL — bağlantılar (mobilde menü düğmesi) */}
          <nav aria-label="Ana menü" className="hidden items-center gap-5 lg:flex">
            {mainNav.map((item) => {
              const current =
                item.href === "/" ? route === "/" : route.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "relative font-label text-[0.54rem] tracking-[0.2em] uppercase transition-colors duration-300",
                    "after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-current after:transition-all after:duration-500 after:ease-[cubic-bezier(0.16,1,0.3,1)] after:content-['']",
                    current
                      ? "text-fg after:w-full"
                      : "text-fg-muted after:w-0 hover:text-fg hover:after:w-full",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            ref={buttonRef}
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            className="inline-flex size-8 items-center justify-center justify-self-start border border-current/30 transition-colors duration-300 hover:border-accent hover:text-accent lg:hidden"
          >
            {open ? (
              <X className="size-3.5" strokeWidth={1.5} aria-hidden />
            ) : (
              <Menu className="size-3.5" strokeWidth={1.5} aria-hidden />
            )}
          </button>

          {/* ORTA — kelime işareti */}
          <Link
            href="/"
            aria-label={`${site.legalName} anasayfa`}
            className="justify-self-center transition-opacity duration-300 hover:opacity-70"
          >
            <Wordmark />
          </Link>

          {/* SAĞ — düğmeler (soldaki bağlantılarla aynı ölçekte) */}
          <div className="flex items-center justify-end gap-2">
            <ThemeToggle
              iconClassName="size-3"
              label={
                <span className="hidden font-label text-[0.54rem] tracking-[0.2em] uppercase sm:inline">
                  tema
                </span>
              }
              className="h-7 gap-1.5 border border-current/30 px-2 text-fg transition-colors duration-300 hover:border-accent hover:text-accent sm:px-2.5"
            />

            <a
              href={site.contact.phoneHref}
              /* `no-halo`: kendi zemini var, yazı halesi gerekmiyor. */
              className="no-halo hidden h-7 items-center bg-fg px-3.5 font-label text-[0.54rem] tracking-[0.2em] text-ink-950 uppercase transition-opacity duration-300 hover:opacity-80 lg:inline-flex"
            >
              {site.contact.phone}
            </a>
          </div>
        </div>
      </header>

      {/* Mobil tam ekran menü */}
      <div
        id="site-menu"
        ref={panelRef}
        role="dialog"
        aria-modal={open}
        aria-label="Site menüsü"
        tabIndex={-1}
        className={cn(
          "media-layer fixed inset-0 z-50 flex flex-col justify-between bg-ink-950 px-[clamp(1.25rem,5vw,3rem)] pt-32 pb-10 transition-opacity duration-500 ease-[var(--ease-scene)] lg:hidden",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      >
        <nav aria-label="Mobil menü">
          <ul className="flex flex-col gap-3">
            {mainNav.map((item, i) => {
              const current =
                item.href === "/" ? route === "/" : route.startsWith(item.href);
              return (
                <li key={item.href} className="overflow-hidden">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "display block w-fit text-[clamp(1.7rem,7.5vw,2.6rem)] transition-all duration-500 ease-[var(--ease-scene)]",
                      open
                        ? "translate-y-0 opacity-100"
                        : "translate-y-6 opacity-0",
                      current ? "text-fg" : "text-fg-muted hover:text-fg",
                    )}
                    style={{
                      transitionDelay: open ? `${120 + i * 60}ms` : "0ms",
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex flex-col gap-6 border-t border-fg/15 pt-6">
          <div className="edge-note flex flex-col gap-1 text-fg-muted">
            <span>{site.contact.address.line1}</span>
            <span>{site.contact.address.line2}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a
              href={site.contact.phoneHref}
              className="edge-note text-fg transition-colors hover:text-accent"
            >
              {site.contact.phone}
            </a>
            {site.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="edge-note text-fg-muted transition-colors hover:text-fg"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
