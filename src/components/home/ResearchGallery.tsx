"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { research } from "@content/site";
import { asset } from "@/lib/utils";
import { TransitionLink } from "@/components/ui/TransitionLink";

/**
 * Act III: a pinned horizontal gallery. Vertical scroll drives the track
 * sideways while each card's image counter-parallaxes inside its frame.
 */
export function ResearchGallery() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const t = track.current;
      if (!t) return;
      gsap.fromTo(
        "[data-rg-head]",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, stagger: 0.1, scrollTrigger: { trigger: root.current, start: "top 75%", once: true } },
      );
      if (prefersReducedMotion()) return;

      const distance = () => t.scrollWidth - window.innerWidth;
      const slide = gsap.to(t, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => "+=" + distance(),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-rg-card]").forEach((card) => {
        const img = card.querySelector("[data-rg-img]");
        gsap.fromTo(
          img,
          { xPercent: -12 },
          {
            xPercent: 12,
            ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: slide, start: "left right", end: "right left", scrub: true },
          },
        );
        gsap.fromTo(
          card,
          { rotate: 3, scale: 0.92, opacity: 0.4 },
          {
            rotate: 0,
            scale: 1,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: card, containerAnimation: slide, start: "left 95%", end: "left 45%", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-ink" aria-label="Research themes">
      <div className="flex min-h-[100svh] flex-col justify-center">
        <div className="container-x pt-[calc(var(--nav-h)+2rem)]">
          <p data-rg-head className="eyebrow mb-4">
            Research
          </p>
          <h2 data-rg-head className="max-w-3xl text-[length:var(--text-section)] font-semibold leading-[1] tracking-[-0.045em]">
            Five questions that <span className="serif-italic text-gradient">drive the lab.</span>
          </h2>
        </div>

        <div
          ref={track}
          className="no-scrollbar flex w-max gap-5 px-[var(--gutter)] py-10 motion-reduce:w-full motion-reduce:overflow-x-auto md:gap-7"
        >
          {research.map((r, i) => (
            <article
              key={r.slug}
              data-rg-card
              className="group relative h-[min(64vh,600px)] w-[min(82vw,460px)] shrink-0 overflow-hidden rounded-[28px] border border-line bg-surface"
            >
              <div className="absolute inset-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  data-rg-img
                  src={asset(r.image)}
                  alt=""
                  loading="lazy"
                  className="h-full w-[125%] max-w-none -translate-x-[10%] object-cover opacity-80 transition-opacity duration-700 group-hover:opacity-100"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/0" />
              <div className="relative flex h-full flex-col justify-between p-7 md:p-8">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs tracking-[0.2em] text-fg/70">{String(i + 1).padStart(2, "0")} / {String(research.length).padStart(2, "0")}</span>
                  <span className="h-2 w-2 rounded-full" style={{ background: r.accent, boxShadow: `0 0 18px ${r.accent}` }} />
                </div>
                <div>
                  <h3 className="text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold leading-[1.05] tracking-[-0.035em]">{r.title}</h3>
                  <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-fg/75">{r.short}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {r.methods.map((m) => (
                      <li key={m} className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[11px] text-fg/80 backdrop-blur">
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
          <TransitionLink
            href="/research/"
            className="group flex h-[min(64vh,600px)] w-[min(70vw,320px)] shrink-0 flex-col items-start justify-end rounded-[28px] border border-dashed border-white/15 p-8 transition-colors hover:border-white/40"
          >
            <span className="text-3xl font-semibold tracking-[-0.03em]">Explore the research</span>
            <span className="mt-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-fg text-ink transition-transform duration-500 group-hover:translate-x-2">→</span>
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
