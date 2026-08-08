"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionHeading } from "@/components/ui/section-heading";
import { lightMediaSrc } from "@/components/ui/media-frame";
import { process } from "@/content/home";
import "./process.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const steps = process.steps;

/** Son adımdan sonra sabit kalınan ekran sayısı — `.prc-tail` ile aynı. */
const TAIL_SCREENS = 0.6;

/* Kadraj kayması (bkz. aşağıdaki tween). Görsel `.prc-img img` içinde
   %112 ölçekli olduğu için üstte ve altta %6 pay var; iki uç da payın
   içinde kalmalı, yoksa kenarda boşluk açılır. */
const ENTERING = 4;
const SETTLED = -2;

/**
 * 07 — Süreç: mağazadan salona beş adım.
 *
 * Kaynak etkileşim: "gsap-pinned-image-mask-reveal-on-scroll" demosu.
 * Sağdaki görsel sütunu scroll boyunca CSS `sticky` ile sabit; sol sütundaki
 * her adım geçtikçe O ADIMIN görseli bir öncekinin üstüne alttan yukarı
 * doğru açılıyor. Açılırken kadraj da kayıyor — düz bir silme değil,
 * derinlikli bir geçiş oluyor.
 *
 * Yığın sırası: ilk adım en altta, sonuncusu en üstte (z-index artan).
 * Her karenin TEK bir tween'i var ve hiçbiri başka bir karenin durumuna
 * bakmıyor — "gideni sil" kurgusunda bir kare doğru görünsün diye
 * altındakinin de doğru durumda olması gerekiyordu, sıra kayınca çizgi
 * görünüp altından aynı fotoğraf çıkıyordu.
 *
 * 64em altında (tablet ve telefon) sabitleme yok: iki sütun
 * `display: contents` ile tek akışa dökülüyor, sıralama CSS `order` ile
 * metin→görsel şeklinde geçiştiriliyor (demodaki çözümün aynısı, ama
 * JS'siz).
 */
export function Process() {
  const rootRef = useRef<HTMLDivElement>(null);
  const archRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const arch = archRef.current;
      if (!arch) return;

      const mm = gsap.matchMedia();

      /* Yalnızca TEK dal var: sabitlenen iki sütunlu kurgu. 64em altında
         bölüm sabitlenmiyor, sıralamayı da CSS `order` yapıyor (bkz.
         process.css) — orada JS'e iş kalmıyor. */
      mm.add("(min-width: 64em)", () => {
        const frames = gsap.utils.toArray<HTMLElement>(".prc-img", arch);
        if (frames.length < 2) return;

        /* İlk kare hep açık ve en altta; sonrakiler gizli başlayıp sırayla
           üstüne açılıyor. */
        gsap.set(frames[0], { "--prc-reveal": "0%" });
        gsap.set(frames[0].querySelectorAll("img"), { yPercent: SETTLED });
        gsap.set(frames.slice(1), { "--prc-reveal": "100%" });

        /* `pin` YOK: sütunu CSS `sticky` tutuyor (bkz. process.css).
           ScrollTrigger'a yalnızca scrub kalıyor. */
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: arch,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        });

        /* TEK ve DÜZ zaman çizelgesi: her adımın açılışı `(index-1) * STEP`
           konumuna konuyor. Her karenin TEK bir tween'i var — hiçbir tween
           başka bir karenin durumuna bakmıyor.
           Adım kutuları 1 ekran olduğu için geçiş k tam olarak k. adımdan
           (k+1). adıma geçerken tamamlanıyor. */
        const STEP = 1.5;

        frames.forEach((frame, index) => {
          if (index === 0) return;

          const at = (index - 1) * STEP;

          timeline
            /* Kare alttan yukarı doğru açılıyor (bkz. `--prc-reveal`). */
            .fromTo(
              frame,
              { "--prc-reveal": "100%" },
              { "--prc-reveal": "0%", duration: STEP, ease: "none" },
              at,
            )
            /* Açılırken kadraj da hafifçe kayıyor — düz bir silme olmasın.
               Kaydırma `object-position` DEĞİL transform ile: object-position
               her karede görselin tamamını yeniden boyatıyordu (sabitlenmiş
               bölümde beş ekran boyunca, her karede, tam boy bir fotoğraf);
               transform birleştiricide kalıyor. Görsel CSS'te %112 ölçekli,
               yani iki uçta da %6 pay var — kayarken kenar açılmıyor. */
            .fromTo(
              frame.querySelectorAll("img"),
              { yPercent: ENTERING },
              { yPercent: SETTLED, duration: STEP, ease: "none" },
              at,
            );
        });

        /* SON FOTOĞRAFIN EKRANDA KALMASI İÇİN KUYRUK.
           Sabitleme aralığı = arch boyu − 1 ekran. Kuyruk olmadan bu aralık
           tam olarak (adım-1) ekran oluyordu ve son geçiş, sabitlemenin
           bittiği anda tamamlanıyordu: 5. fotoğraf göz açıp kapayana kadar
           görünüp kayboluyordu (4. de zar zor). `.prc-tail` sol sütuna
           `--prc-tail` ekran boyu ekliyor; zaman çizelgesine de aynı oranda
           boş süre ekleniyor ki geçişler yine adım sınırlarına denk gelsin,
           arkasından son kare o kadar süre ekranda tutulsun. */
        timeline.to({}, { duration: STEP * TAIL_SCREENS });
      });
    },
    { scope: rootRef },
  );

  return (
    <section className="section" ref={rootRef}>
      <div className="shell">
        <SectionHeading
          no={process.no}
          eyebrow={process.eyebrow}
          lines={process.lines}
          description={process.description}
        />
      </div>

      <div className="shell prc-arch mt-6" ref={archRef}>
        <div className="prc-left">
          {steps.map((step) => (
            <div className="prc-info" key={step.no}>
              <span className="prc-step">
                <b>{step.no}</b>
                {step.duration}
              </span>
              <h3 className="prc-title">{step.title}</h3>
              <p className="prc-body">{step.body}</p>
            </div>
          ))}

          {/* Son fotoğraf ekranda kalsın diye sol sütunun kuyruğu. */}
          <div className="prc-tail" aria-hidden />
        </div>

        <div className="prc-right">
          {steps.map((step, i) => (
            <div
              className="prc-img"
              key={step.no}
              /* Sonraki adım öncekinin ÜSTÜNE açılıyor: z-index artan. */
              style={{ zIndex: i + 1 }}
            >
              {/* Bölüm aşağıda olduğu için kareler tembel yüklenir. Masaüstü
                  yığınında aynı koordinatta olduklarından bölüm yaklaşınca
                  tarayıcı hepsini birlikte hazırlar; mobil ilk yüklemede ise
                  on görseli birden indirmez. */}
              <Image
                src={step.image}
                alt={step.alt}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 544px"
                className="theme-media-dark object-cover"
              />
              <Image
                src={lightMediaSrc(step.image)}
                alt=""
                aria-hidden
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 544px"
                className="theme-media-light object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
