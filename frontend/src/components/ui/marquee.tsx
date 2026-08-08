import { cn } from "@/lib/utils";

/** Sonsuz kayan şerit — içerik iki kez basılır, %50 kaydırılır. */
export function Marquee({
  items,
  className,
  itemClassName,
}: {
  items: readonly string[];
  className?: string;
  itemClassName?: string;
}) {
  return (
    <div className={cn("marquee-mask overflow-hidden", className)}>
      <div className="marquee-track">
        {[0, 1].map((pass) => (
          <div key={pass} className="flex shrink-0" aria-hidden={pass === 1}>
            {items.map((item) => (
              <span
                key={`${pass}-${item}`}
                className={cn(
                  "flex items-center gap-8 px-8 text-fg-faint transition-colors duration-300 hover:text-fg",
                  itemClassName,
                )}
              >
                {item}
                <span className="h-1 w-1 rounded-full bg-line-strong" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
