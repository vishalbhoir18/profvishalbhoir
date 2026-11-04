"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { research } from "@content/site";
import { asset, cn } from "@/lib/utils";

/**
 * Apple's "sticky media" pattern: the image column stays pinned while the
 * text column scrolls; the active theme cross-fades and zooms the media.
 */
export function StickyThemes() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-theme-block]").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        });
        gsap.fromTo(el.querySelectorAll("[data-tb]"), { opacity: 0, y: 40 }, {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 75%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="container-x grid gap-10 md:grid-cols-2 md:gap-20">
      <div className="relative hidden md:block">
        <div className="sticky top-[calc(var(--nav-h)+6vh)] aspect-[4/5] overflow-hidden rounded-[28px] border border-line bg-surface">
          {research.map((r, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={r.slug}
              src={asset(r.image)}
              alt=""
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-[opacity,transform,filter] duration-[1200ms] ease-[var(--ease-out-expo)]",
                i === active ? "scale-100 opacity-100 blur-0" : "scale-110 opacity-0 blur-md",
              )}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
            <span className="font-mono text-xs tracking-[0.2em] text-fg/80">
              {String(active + 1).padStart(2, "0")} / {String(research.length).padStart(2, "0")}
            </span>
            <div className="flex gap-1.5">
              {research.map((r, i) => (
                <span key={r.slug} className={cn("h-1 rounded-full transition-all duration-700", i === active ? "w-8 bg-fg" : "w-2 bg-white/30")} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="md:py-[18vh]">
        {research.map((r, i) => (
          <article key={r.slug} id={r.slug} data-theme-block className="flex min-h-[70vh] flex-col justify-center py-12 md:min-h-[85vh]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img data-tb src={asset(r.image)} alt="" className="mb-8 aspect-[16/10] w-full rounded-[20px] border border-line object-cover md:hidden" loading="lazy" />
            <p data-tb className="font-mono text-xs tracking-[0.2em]" style={{ color: r.accent }}>
              {String(i + 1).padStart(2, "0")} · THEME
            </p>
            <h2 data-tb className="mt-4 text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
              {r.title}
            </h2>
            <p data-tb className="mt-6 text-lg leading-relaxed text-fg/80">
              {r.body}
            </p>
            <ul data-tb className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line">
              {r.methods.map((m) => (
                <li key={m} className="flex items-center gap-3 bg-ink px-5 py-4 text-[15px] text-fg/85">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: r.accent }} />
                  {m}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
