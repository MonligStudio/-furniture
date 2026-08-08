import { cn } from "@/lib/utils";

/**
 * Bölüm başlığı — mono bölüm etiketi (BÖLÜM 03) + dev BÜYÜK HARF display
 * başlık + açıklama.
 *
 * Başlık satırları `.line-mask` ile maskelenir; görünür alana girince
 * RevealEngine `.is-in` ekler ve satırlar aşağıdan yukarı açılır.
 * (SplitText kullanılmıyor: strict mode'da satırları ikiye katlıyor.)
 */
export function SectionHeading({
  no,
  eyebrow,
  lines,
  description,
  align = "left",
  size = "md",
  className,
  children,
}: {
  no?: string;
  eyebrow?: string;
  lines: readonly string[];
  description?: string;
  align?: "left" | "center";
  size?: "md" | "lg";
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "reveal flex flex-col gap-6",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span className="chapter">
          {no ? <b>{no}</b> : null}
          {eyebrow}
        </span>
      ) : null}

      <h2
        className={cn(
          "display max-w-4xl",
          size === "lg"
            ? "text-[clamp(1.9rem,4.2vw,3.4rem)]"
            : "text-[clamp(1.7rem,3.6vw,2.9rem)]",
        )}
      >
        {lines.map((line, i) => (
          <span
            key={line}
            className="line-mask"
            style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
          >
            <span>{line}</span>
          </span>
        ))}
      </h2>

      {description ? (
        <p
          className={cn(
            "max-w-xl text-[1.02rem] text-fg-muted",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}

      {children}
    </div>
  );
}
