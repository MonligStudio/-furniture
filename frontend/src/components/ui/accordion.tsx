"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * SSS akordeonu.
 * Açılma/kapanma saf CSS (grid-template-rows 0fr → 1fr) ile — AnimatePresence
 * exit animasyonu kısıtlı ortamlarda bitmediği için kullanılmıyor.
 */
export function Accordion({
  items,
  className,
}: {
  items: readonly { q: string; a: string }[];
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="group flex w-full items-center justify-between gap-6 py-5 text-left"
            >
              <span
                className={cn(
                  "font-display text-[1.05rem] transition-colors duration-300",
                  isOpen ? "text-fg" : "text-fg-muted group-hover:text-fg",
                )}
              >
                {item.q}
              </span>
              <Plus
                className={cn(
                  "size-5 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  isOpen ? "rotate-135 text-accent" : "text-fg-faint",
                )}
                strokeWidth={1.5}
                aria-hidden
              />
            </button>

            <div
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-6 text-fg-muted">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
