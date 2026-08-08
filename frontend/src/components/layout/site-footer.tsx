"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/content/catalog";
import { mainNav, site } from "@/content/site";
import "./site-footer.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const footerLinks = mainNav.filter((item) => item.href !== "/");
const collectionLinks = categories.slice(0, 5);

/**
 * Sayfa sonunda açığa çıkan TAM SAYFA footer.
 *
 * Ekrana sabitlenmiş durur; üstündeki opak sayfa katmanı kayıp gidince
 * görünür. Açıldığında sütunlar aşağıdan yukarı sürülür, en alttaki dev
 * ESCUDO harfleri ortadan kenarlara doğru sırayla yerine oturur.
 */
export function SiteFooter() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const revealer = root.querySelector<HTMLElement>(".footer-revealer");
      if (!revealer) return;

      const chars = gsap.utils.toArray<HTMLElement>(".footer-char", root);
      const lines = gsap.utils.toArray<HTMLElement>(".footer-line > *", root);
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const compact = window.matchMedia("(max-width: 47.99em)").matches;

      gsap.set(chars, { yPercent: reduced || compact ? 0 : 120 });
      gsap.set(lines, { yPercent: reduced || compact ? 0 : 100 });

      /* Mobil footer normal akışta; sabit perde animasyonuna ihtiyacı yok. */
      if (compact) return;

      /* Açılış birden çok kez tetiklenebiliyor (onEnter + her refresh);
         tween'ler baştan başlayıp yazıları zıplatmasın diye tek yönlü kapı. */
      let shown = false;

      const animateIn = () => {
        if (shown || reduced) return;
        shown = true;
        gsap.to(chars, {
          yPercent: 0,
          duration: 1,
          ease: "power3.out",
          stagger: { each: 0.05, from: "center" },
          overwrite: true,
        });
        gsap.to(lines, {
          yPercent: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.06,
          overwrite: true,
        });
      };

      const animateOut = () => {
        if (!shown || reduced) return;
        shown = false;
        gsap.to(chars, {
          yPercent: 120,
          duration: 0.4,
          ease: "power2.in",
          stagger: { each: 0.01, from: "center" },
          overwrite: true,
        });
        gsap.to(lines, {
          yPercent: 100,
          duration: 0.4,
          ease: "power2.in",
          stagger: 0.02,
          overwrite: true,
        });
      };

      ScrollTrigger.create({
        trigger: revealer,
        start: "top 50%",
        onEnter: animateIn,
        /* `onEnter` yalnızca eşik GEÇİLİRKEN çalışır; sayfa zaten aşağıdayken
           açılırsa (yenileme, geri dönüş) hiç tetiklenmez ve footer boş
           kalırdı. Tazelemede konum okunup gerekirse açılıyor. */
        onRefresh: (self) => {
          if (self.isActive || self.progress > 0) animateIn();
          else animateOut();
        },
      });

      ScrollTrigger.create({
        trigger: revealer,
        start: "top 85%",
        onLeaveBack: animateOut,
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef}>
      <div className="footer-revealer" aria-hidden />

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-col">
              <h3>Menü</h3>
              <ul>
                {footerLinks.map((item) => (
                  <li key={item.href} className="footer-line">
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h3>Koleksiyonlar</h3>
              <ul>
                {collectionLinks.map((category) => (
                  <li key={category.slug} className="footer-line">
                    <Link href={`/koleksiyon/${category.slug}`}>
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h3>Mağaza</h3>
              <span className="footer-line">
                <p>{site.contact.address.line1}</p>
              </span>
              <span className="footer-line">
                <p>{site.contact.address.line2}</p>
              </span>
              <ul className="mt-3">
                <li className="footer-line">
                  <a href={site.contact.phoneHref}>{site.contact.phone}</a>
                </li>
                <li className="footer-line">
                  <a href={`mailto:${site.contact.email}`}>
                    {site.contact.email}
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h3>Takip</h3>
              <ul>
                {site.socials.map((social) => (
                  <li key={social.label} className="footer-line">
                    <a href={social.href} target="_blank" rel="noreferrer">
                      {social.label}
                      <ArrowUpRight
                        className="ml-1 inline size-3.5 align-[-2px]"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    </a>
                  </li>
                ))}
                <li className="footer-line">
                  <a href={site.contact.whatsapp} target="_blank" rel="noreferrer">
                    WhatsApp
                    <ArrowUpRight
                      className="ml-1 inline size-3.5 align-[-2px]"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <div className="footer-meta">
              <span>
                © {new Date().getFullYear()} {site.legalName} ·{" "}
                {site.contact.address.city}
              </span>
              <span>{site.tagline}</span>
              <span>
                {site.founded}&apos;ten beri · Puffy yetkili satış noktası
              </span>
            </div>

            {/* Sayfanın en altındaki dev marka adı */}
            <h2 className="footer-word" aria-label={site.name}>
              {[...site.name].map((char, index) => (
                <span
                  key={`${char}-${index}`}
                  className="footer-char"
                  aria-hidden
                >
                  {char}
                </span>
              ))}
            </h2>
          </div>
        </div>
      </footer>
    </div>
  );
}
