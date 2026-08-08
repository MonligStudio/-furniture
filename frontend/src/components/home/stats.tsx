import { Counter } from "@/components/ui/counter";
import { stats } from "@/content/home";

/** 02 — Rakamlar şeridi. Sayılar görünür alana girince sayarak yükselir. */
export function Stats() {
  return (
    <section className="pb-[clamp(3rem,7vw,6rem)]">
      <div className="shell">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 border-y border-line py-10 sm:grid-cols-4 sm:py-12">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="reveal flex flex-col gap-2"
              style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
            >
              <dt className="font-display text-[clamp(2.2rem,5vw,3.6rem)] text-fg">
                <Counter
                  value={stat.value}
                  suffix={"suffix" in stat ? stat.suffix : ""}
                  format={"format" in stat ? "year" : "number"}
                />
              </dt>
              <dd className="edge-note text-fg-faint">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
