"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { lightMediaSrc } from "@/components/ui/media-frame";
import "./grid-preview.css";

gsap.registerPlugin(useGSAP);

export type PreviewItem = {
  id: string;
  title: string;
  meta: string;
  href: string;
  image: string;
  /** Önizlemede sırayla gösterilen kareler. Boşsa `image` kullanılır. */
  gallery?: string[];
};

/**
 * IZGARADAN ÖNİZLEMEYE
 * Kaynak etkileşim: Gwen Bogaert / "grid-to-preview" demosu — bu projeye
 * React + tema token'larıyla uyarlandı.
 *
 * `mode="split"`: ızgara ikiye bölünür. Sol yarıdaki bir kutunun üstüne
 * gelince SAĞ yarıda büyük bir panel açılır (ve tersi). Panelin kapattığı
 * kutular sönerek dışa dağılır, panelin üstündeki opak kapak artı (+)
 * biçiminde kapanarak görseli açığa çıkarır. Sütun sayısı ÇİFT olmalı.
 *
 * `mode="full"`: tek panel bütün ızgarayı kaplar, kutuların hepsi dağılır.
 * Öğe sayısı bölünmeye uygun değilse (ör. 6 koleksiyon / 3 sütun) bu kip
 * kullanılır.
 *
 * Etki yalnızca imleçli ve geniş ekranlarda kurulur; altında ya da
 * "hareketi azalt" açıkken sade bir ızgara olarak kalır.
 */
export function GridToPreview({
  items,
  columns = 4,
  mode = "split",
  cta = "İncele",
}: {
  items: PreviewItem[];
  columns?: number;
  mode?: "split" | "full";
  cta?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  /* Bir kutunun ızgaranın hangi yarısında olduğu — panel eşleşmesi buna göre. */
  const sideOf = (index: number) =>
    mode === "full" || index % columns < columns / 2 ? "left" : "right";

  const panels =
    mode === "full"
      ? ([{ key: "full", span: `1 / -1` }] as const)
      : ([
          { key: "left", span: `1 / span ${columns / 2}` },
          { key: "right", span: `${columns / 2 + 1} / -1` },
        ] as const);

  /** `key` panelinin gösterdiği öğeler: karşı yarıdaki kutular. */
  const itemsShownIn = (key: string) =>
    mode === "full"
      ? items
      : items.filter((_, i) => (sideOf(i) === "left") === (key === "right"));

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const previews = root.querySelector<HTMLElement>(".gtp-previews");
      const tiles = gsap.utils.toArray<HTMLElement>(".gtp-item", root);
      const panelEls = gsap.utils.toArray<HTMLElement>(".gtp-preview", root);
      if (!previews || panelEls.length === 0) return;

      /* ÖNİZLEME GÖRSELLERİ ERTELENİYOR.
         Kareler `background-image` kullanıyor (bkz. aşağıdaki not) ve panel
         `opacity: 0` olsa da çizim ağacında durduğu için tarayıcı bütün
         arkaplanları AÇILIŞTA indiriyordu: burada onlarca ham JPEG, üstelik
         `next/image`den geçmediği için tam boy. Görünür karelerle aynı anda
         indiklerinden asıl fotoğrafların gelişini geciktiriyorlardı.
         Kaynaklar artık `data-*` içinde bekliyor; bölüm görünür alana
         yaklaşınca (ya da en geç ilk hover'da) değişkenlere yazılıyor. */
      const frameEls = gsap.utils.toArray<HTMLElement>(".gtp-frame", root);
      const loadFrames = () => {
        for (const frame of frameEls) {
          if (frame.dataset.loaded) continue;
          frame.style.setProperty("--img-dark", `url(${frame.dataset.imgDark})`);
          frame.style.setProperty(
            "--img-light",
            `url(${frame.dataset.imgLight})`,
          );
          frame.dataset.loaded = "1";
        }
      };

      /**
       * Etki şu an çalışabilir mi?
       *
       * ÖNEMLİ: bu karar mount anında BİR KEZ verilmemeli. Kurulum
       * hidrasyon sırasında çalışıyor ve o anda `window.innerWidth` bazı
       * ortamlarda 0 dönüyor (gömülü/arka plandaki paneller) — genişlik
       * koşuluna bakan tek seferlik bir kontrol, etkiyi kalıcı olarak
       * kapatıyordu.
       *
       * Bu yüzden genişlik JS'ten değil, önizleme katmanının HESAPLANMIŞ
       * `display` değerinden okunuyor: kaynak tek — CSS'teki media query
       * (`min-width: 64em`). Karar da her hover'da yeniden veriliyor.
       */
      const canPreview = () =>
        getComputedStyle(previews).display !== "none" &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      type Panel = {
        el: HTMLElement;
        key: string;
        cover: HTMLElement;
        titleEl: HTMLElement;
        metaEl: HTMLElement;
        /** Panelin kapattığı — açılınca dağılan — kutular. */
        covered: HTMLElement[];
        /** Ürün kimliğine göre gruplanmış önizleme kareleri. */
        frames: Map<string, HTMLElement[]>;
        timeline: gsap.core.Timeline;
        gallery?: gsap.core.Timeline;
      };

      const build = (el: HTMLElement): Panel => {
        const key = el.dataset.panel ?? "";
        const frames = new Map<string, HTMLElement[]>();
        el.querySelectorAll<HTMLElement>(".gtp-preview-images .gtp-frame").forEach(
          (frame) => {
            const id = frame.dataset.id ?? "";
            frames.set(id, [...(frames.get(id) ?? []), frame]);
          },
        );

        const covered =
          mode === "full"
            ? tiles
            : tiles.filter((tile) => tile.dataset.side === key);

        return {
          el,
          key,
          cover: el.querySelector<HTMLElement>(".gtp-preview-cover")!,
          titleEl: el.querySelector<HTMLElement>(".gtp-preview-title")!,
          metaEl: el.querySelector<HTMLElement>(".gtp-preview-meta")!,
          covered,
          frames,
          timeline: gsap.timeline({ paused: true }),
        };
      };

      const panelList = panelEls.map(build);

      /** Panelin ölçüsüne göre artı kollarının yüzdesi ve küçülme oranı. */
      const buildTimeline = (panel: Panel) => {
        panel.timeline.kill();

        const { width, height } = panel.el.getBoundingClientRect();
        if (width === 0 || height === 0) return;

        /* `window.innerWidth` yerine belge genişliği: bazı ortamlarda
           `innerWidth` 0 dönüyor ve o zaman artı kolları sıfırlanıp
           ölçek NaN oluyordu. */
        const vw = (document.documentElement.clientWidth || 1280) / 100;
        const armPx = 5 * vw;
        const x = (armPx / width) * 100;
        const y = (armPx / height) * 100;

        /* Panel açılırken kutuların hizasından bir tık içeri çekilir. */
        const shrinkPx = 5 * vw;
        const scaleX = (width - shrinkPx) / width;
        const scaleY = (height - shrinkPx) / height;

        /* Kapak, açılışta artı biçiminde; kapanınca görsel açığa çıkar. */
        const crossOpen = `polygon(
          ${50 - x / 2}% 0%, ${50 + x / 2}% 0%,
          ${50 + x / 2}% ${50 - y / 2}%, 100% ${50 - y / 2}%,
          100% ${50 + y / 2}%, ${50 + x / 2}% ${50 + y / 2}%,
          ${50 + x / 2}% 100%, ${50 - x / 2}% 100%,
          ${50 - x / 2}% ${50 + y / 2}%, 0% ${50 + y / 2}%,
          0% ${50 - y / 2}%, ${50 - x / 2}% ${50 - y / 2}%
        )`;
        const crossClosed = `polygon(
          50% 0%, 50% 0%, 50% 50%, 100% 50%, 100% 50%, 50% 50%,
          50% 100%, 50% 100%, 50% 50%, 0% 50%, 0% 50%, 50% 50%
        )`;

        panel.timeline = gsap
          .timeline({ paused: true, defaults: { ease: "power2.inOut" } })
          .addLabel("open", 0)
          .to(panel.el, { opacity: 1 }, "open")
          .to(
            panel.el,
            { scaleX, scaleY, transformOrigin: "center center" },
            "open",
          )
          /* Kapatılan kutular sönerken dışa doğru açılır. Kaymalar `vw`
             yerine kutunun kendi ölçüsüne göre (yüzde): hem viewport
             birimlerine bağlı kalmıyor hem de her ekranda aynı oranda
             duruyor. */
          .to(
            panel.covered,
            {
              opacity: 0,
              xPercent: (i: number) => (i % 2 === 0 ? 12 : -12),
              yPercent: (i: number) => (i < panel.covered.length / 2 ? 12 : -12),
            },
            "open",
          )
          .fromTo(
            panel.cover,
            { clipPath: crossOpen },
            { clipPath: crossClosed },
            "open",
          );
      };

      panelList.forEach(buildTimeline);

      /** Aktif ürünün karelerini sırayla döndürür. */
      const startGallery = (panel: Panel, id: string) => {
        const frames = panel.frames.get(id);
        if (!frames || frames.length < 2) return;

        const tl = gsap.timeline({ repeat: -1 });
        frames.forEach((frame) => {
          tl.set(frames, { opacity: 0 })
            .set(frame, { opacity: 1 })
            .to(frame, { duration: 0, opacity: 1 }, "+=0.9");
        });
        panel.gallery = tl;
      };

      const openPanel = (panel: Panel, id: string, title: string, meta: string) => {
        /* Bileşen kurulurken panel henüz ölçülemediyse (görseller yüklenmemiş,
           bölüm görünür alana girmemiş) `buildTimeline` boş dönüyor. O
           durumda zaman çizelgesi sonsuza kadar boş kalmasın diye ilk
           hover'da bir kez daha kuruluyor. */
        if (panel.timeline.getChildren().length === 0) buildTimeline(panel);

        loadFrames();
        panel.gallery?.kill();
        panel.titleEl.textContent = title;
        panel.metaEl.textContent = meta;

        const frames = panel.frames.get(id) ?? [];
        gsap.set([...panel.frames.values()].flat(), { opacity: 0 });
        gsap.set(frames[0] ?? [], { opacity: 1 });

        panel.timeline.play();
        startGallery(panel, id);
      };

      const closePanel = (panel: Panel) => {
        panel.gallery?.kill();
        panel.timeline.reverse();
      };

      /* Hangi kutu hangi paneli açar: kutunun KARŞI yarısındaki panel. */
      const panelFor = (tile: HTMLElement) =>
        mode === "full"
          ? panelList[0]
          : panelList.find((panel) => panel.key !== tile.dataset.side);

      let hoverTimer: number | null = null;
      let active: HTMLElement | null = null;

      const onEnter = (tile: HTMLElement) => {
        if (!canPreview()) return;
        if (hoverTimer) window.clearTimeout(hoverTimer);
        /* Izgara üzerinde hızlıca gezinirken her kutuda panel açılmasın. */
        hoverTimer = window.setTimeout(() => {
          const panel = panelFor(tile);
          if (!panel) return;
          active = tile;
          openPanel(
            panel,
            tile.dataset.id ?? "",
            tile.dataset.name ?? "",
            tile.dataset.meta ?? "",
          );
          hoverTimer = null;
        }, 100);
      };

      const onLeave = () => {
        if (hoverTimer) {
          window.clearTimeout(hoverTimer);
          hoverTimer = null;
        }
        if (!active) return;
        const panel = panelFor(active);
        if (panel) closePanel(panel);
        active = null;
      };

      /* Dinleyiciler TEK bir sinyalle sökülüyor.
         Elle `removeEventListener` yazmak burada kolayca unutuluyor ve
         unutulduğunda ağır sonucu var: React strict mode'da (dev) effect
         iki kez kuruluyor, ilk turun dinleyicileri sökülmediği için her
         hover'da ÖLÜ bir kapanıştan da tetikleniyor. O ölü kapanışın
         zaman çizelgesi `kill()`lenmiş olduğu için panel açılmıyor ama
         galerisi sonsuz döngüde kare değiştirmeye devam ediyor —
         önizleme görseli sürekli sönüp yanıyordu. */
      const listeners = new AbortController();
      const { signal } = listeners;

      tiles.forEach((tile) => {
        tile.addEventListener("mouseenter", () => onEnter(tile), { signal });
        tile.addEventListener("mouseleave", onLeave, { signal });
        /* Klavyeyle gezenler de görsün. */
        tile.addEventListener("focusin", () => onEnter(tile), { signal });
        tile.addEventListener("focusout", onLeave, { signal });
      });

      /* Ölçü değişince artı kolları ve küçülme oranı yeniden hesaplanmalı. */
      let resizeTimer: number | null = null;
      const onResize = () => {
        if (resizeTimer) window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          onLeave();
          panelList.forEach((panel) => {
            gsap.set(panel.el, { clearProps: "transform,opacity" });
            gsap.set(panel.covered, { clearProps: "transform,opacity" });
            buildTimeline(panel);
          });
        }, 150);
      };

      window.addEventListener("resize", onResize, { signal });

      /* Bölüm yaklaşınca önizleme görselleri sessizce inmeye başlasın;
         kullanıcı hover ettiğinde hazır olsunlar. */
      let nearby: IntersectionObserver | undefined;
      if (typeof IntersectionObserver !== "undefined") {
        nearby = new IntersectionObserver(
          (entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) return;
            if (canPreview()) loadFrames();
            nearby?.disconnect();
          },
          { rootMargin: "600px 0px" },
        );
        nearby.observe(root);
      }

      return () => {
        listeners.abort();
        nearby?.disconnect();
        if (hoverTimer) window.clearTimeout(hoverTimer);
        if (resizeTimer) window.clearTimeout(resizeTimer);
        panelList.forEach((panel) => {
          panel.gallery?.kill();
          panel.timeline.kill();
        });
      };
    },
    { scope: rootRef, dependencies: [items, columns, mode] },
  );

  return (
    <div
      ref={rootRef}
      className="gtp"
      style={{ "--gtp-cols": columns } as React.CSSProperties}
    >
      <ul className="gtp-grid">
        {items.map((item, i) => (
          <li
            key={item.id}
            className="gtp-item"
            data-index={i}
            data-id={item.id}
            data-side={sideOf(i)}
            data-name={item.title}
            data-meta={item.meta}
          >
            {/* Yazının derinlik hareketi kutunun tamamına göre ölçülüyor. */}
            <Link href={item.href} className="gtp-link" data-parallax-scene="">
              {/* Tema başına ayrı kare: akşam / gündüz sürümü.
                  Derinlik (scroll'a bağlı kayma) `.depth-layer` üzerinden,
                  bkz. providers/media-scrub. */}
              <div className="gtp-media">
                <span className="depth-layer" data-depth={9}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="theme-media-dark object-cover"
                  />
                  <Image
                    src={lightMediaSrc(item.image)}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="theme-media-light object-cover"
                  />
                </span>
              </div>
              <span className="gtp-cta">{cta}</span>
              {/* Perde kutusu yerinde duruyor, İÇİ kayıyor: perde karenin
                  alt kenarına oturmak zorunda, kayarsa altında şerit açılır.
                  Miktar dolgunun en dar hâlinin (0.85rem ≈ 13.6px) altında:
                  fazlası, kare ekranın en altındayken yazıyı kırpar. */}
              <span className="gtp-caption">
                <span className="gtp-caption-in" data-parallax={11}>
                  <span className="gtp-title">{item.title}</span>
                  <span className="gtp-meta">{item.meta}</span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Önizleme panelleri — yalnızca dekoratif, okuyucudan gizli. */}
      <div className="gtp-previews" aria-hidden>
        {panels.map((panel) => (
          <div
            key={panel.key}
            className="gtp-preview"
            data-panel={panel.key}
            style={{ gridColumn: panel.span }}
          >
            {/* Kareler `img` DEĞİL arkaplanlı kutu: GSAP bunların opaklığını
                sırayla değiştirerek galeriyi döndürüyor, tema seçimini de
                CSS yapıyor (`--img-dark` / `--img-light`). İki `img`
                basılsaydı galeri koyu/aydınlık kopyalar arasında da
                dönerdi. */}
            <div className="gtp-preview-images">
              {itemsShownIn(panel.key).flatMap((item) =>
                (item.gallery?.length ? item.gallery : [item.image]).map(
                  (src) => (
                    <div
                      key={`${item.id}-${src}`}
                      className="gtp-frame"
                      data-id={item.id}
                      /* Kaynak `--img-*` değişkenlerine hemen değil, bölüm
                         yaklaşınca yazılıyor (bkz. yukarıdaki `loadFrames`). */
                      data-img-dark={src}
                      data-img-light={lightMediaSrc(src)}
                    />
                  ),
                ),
              )}
            </div>

            <div className="gtp-preview-cover" />

            <div className="gtp-preview-caption">
              <span className="gtp-preview-title" />
              <span className="gtp-preview-meta" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
