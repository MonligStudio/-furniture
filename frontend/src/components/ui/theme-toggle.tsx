"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  useEffect,
  useSyncExternalStore,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/**
 * Koyu / aydınlık tema düğmesi.
 *
 * Geçiş `document.startViewTransition` ile yapılıyor: yeni tema, sayfanın
 * alt ortasından dışarı doğru açılır. Tam ekran blur kaldırıldı; özellikle
 * açık temada her kareyi yeniden boyatıp kaydırmayı takılı hissettiriyordu.
 * Dokunmatik/dar ekranlarda geçiş anlıktır.
 *
 * İkon değişimi saf CSS ile (`.animate-fade-up`) yapılıyor — JS tabanlı bir
 * animasyon kütüphanesine bağlanırsa, rAF'ın kısıldığı ortamlarda (arka
 * plandaki sekme, gömülü önizleme) ikon başlangıç karesinde donup görünmez
 * kalabiliyor.
 */

/** useSyncExternalStore için değişmeyen abonelik (yalnızca mount tespiti). */
const subscribeNoop = () => () => {};

const VT_STYLE_ID = "escudo-theme-vt";

/** Dairenin merkezi: ekranın alt-orta noktası. */
const VT_ORIGIN = "50% 100%";

const VT_CSS = `
html[data-theme-vt="active"]::view-transition-old(root) {
  animation: none;
  mix-blend-mode: normal;
}
html[data-theme-vt="active"]::view-transition-new(root) {
  mix-blend-mode: normal;
  animation: escudo-theme-reveal 480ms cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes escudo-theme-reveal {
  from {
    clip-path: circle(0% at ${VT_ORIGIN});
  }
  to {
    clip-path: circle(150% at ${VT_ORIGIN});
  }
}
`;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const prefersSimpleTransition = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(max-width: 47.99em), (pointer: coarse)").matches;

export function useThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  /* Sunucu ile istemcinin ilk çizimi aynı olsun diye: sunucuda false. */
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (document.getElementById(VT_STYLE_ID)) return;

    const el = document.createElement("style");
    el.id = VT_STYLE_ID;
    el.textContent = VT_CSS;
    document.head.appendChild(el);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const toggle = () => {
    const next = isDark ? "light" : "dark";

    if (
      prefersReducedMotion() ||
      prefersSimpleTransition() ||
      !("startViewTransition" in document)
    ) {
      setTheme(next);
      return;
    }

    const root = document.documentElement;
    root.dataset.themeVt = "active";

    const vt = (
      document as Document & {
        startViewTransition(cb: () => void): { finished: Promise<void> };
      }
    ).startViewTransition(() => {
      /* next-themes özniteliği bir effect'te yazıyor; geçişin yeni kareyi
         doğru yakalaması için DOM burada senkron güncelleniyor. */
      root.dataset.theme = next;
      setTheme(next);
    });

    vt.finished.finally(() => {
      delete root.dataset.themeVt;
    });
  };

  return { isDark, mounted, toggle };
}

export function ThemeToggle({
  className,
  iconClassName,
  label,
  ...rest
}: Omit<ComponentPropsWithoutRef<"button">, "children" | "onClick"> & {
  iconClassName?: string;
  label?: ReactNode;
}) {
  const { isDark, mounted, toggle } = useThemeToggle();

  return (
    <button
      type="button"
      aria-label={mounted && isDark ? "Aydınlık temaya geç" : "Koyu temaya geç"}
      aria-pressed={mounted ? isDark : undefined}
      onClick={toggle}
      className={cn("flex items-center justify-center", className)}
      {...rest}
    >
      {mounted ? (
        /* `key` tema ile değişiyor: ikon yeniden bağlanıp fade animasyonunu
           baştan oynatıyor. */
        <span
          key={isDark ? "dark" : "light"}
          className={cn("animate-fade-up inline-flex", iconClassName)}
        >
          {isDark ? (
            <Sun className={iconClassName} strokeWidth={1.5} />
          ) : (
            <Moon className={iconClassName} strokeWidth={1.5} />
          )}
        </span>
      ) : (
        <span className={iconClassName} aria-hidden="true" />
      )}
      {label ? <span className="pointer-events-none">{label}</span> : null}
    </button>
  );
}
