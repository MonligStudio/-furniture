"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Görünür alana girince hedefe kadar sayar.
 * İlk render'da (ve rAF çalışmazsa) doğrudan hedef değeri gösterir — sayı
 * hiçbir koşulda "0" olarak takılı kalmaz.
 *
 * `format="year"` yıl değerlerinde binlik ayracını kapatır (1.993 değil 1993).
 */
export function Counter({
  value,
  suffix = "",
  format,
}: {
  value: number;
  suffix?: string;
  format?: "year" | "number";
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let started = false;

    const run = () => {
      if (started) return;
      started = true;
      const duration = 1400;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(value * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const check = () => {
      const r = el.getBoundingClientRect();
      if (r.top < (window.innerHeight || 800) * 0.92 && r.bottom > 0) run();
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", check);
    };
  }, [value]);

  const rounded = Math.round(display);

  return (
    <span ref={ref} className="tabular-nums">
      {format === "year" ? rounded : rounded.toLocaleString("tr-TR")}
      {suffix}
    </span>
  );
}
