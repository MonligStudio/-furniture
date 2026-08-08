/**
 * İç sayfaların üst bloğu (anasayfa hariç).
 *
 * Anasayfada tam ekran video var; iç sayfalarda ise aynı tipografik dil
 * sade bir başlık bloğu olarak tekrar ediyor. Header şeffaf olduğu için
 * üst boşluk header yüksekliğini karşılayacak kadar bırakılır.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  meta,
}: {
  eyebrow: string;
  title: readonly string[];
  description?: string;
  meta?: readonly { label: string; value: string }[];
}) {
  return (
    <section className="reveal is-in relative pt-[clamp(8rem,16vh,12rem)] pb-[clamp(2.5rem,6vw,4.5rem)]">
      <div className="shell">
        <span className="chapter">{eyebrow}</span>

        <h1 className="display mt-6 text-[clamp(2rem,5.5vw,4.4rem)]">
          {title.map((line, i) => (
            <span
              key={line}
              className="roll"
              style={{ "--roll-delay": `${120 + i * 110}ms` } as React.CSSProperties}
            >
              <span>{line}</span>
            </span>
          ))}
        </h1>

        {description ? (
          <p className="mt-8 max-w-2xl text-[1.05rem] text-fg-muted">
            {description}
          </p>
        ) : null}

        {meta ? (
          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-8 sm:grid-cols-4">
            {meta.map((item) => (
              <div key={item.label} className="flex flex-col gap-2">
                <dt className="edge-note text-fg-faint">{item.label}</dt>
                <dd className="font-display text-[1.35rem] text-fg">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  );
}
