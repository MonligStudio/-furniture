import { Marquee } from "@/components/ui/marquee";
import { marqueeItems } from "@/content/home";

/** Bölümler arasındaki kayan şerit — sayfaya nefes aralığı verir. */
export function MarqueeBand() {
  return (
    <section className="border-y border-line py-6">
      <Marquee
        items={marqueeItems}
        itemClassName="font-display text-[clamp(1.1rem,2.4vw,1.9rem)] uppercase tracking-[-0.01em]"
      />
    </section>
  );
}
