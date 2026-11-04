"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { heroStory, site } from "@content/site";
import { createHeroState, type HeroState } from "@/components/three/CellScene";

/**
 * Act I of the home page.
 * A pinned, scroll-scrubbed WebGL story: the cell assembles on load, then as
 * you scroll it bursts apart and re-forms as a DNA double helix while
 * captions cross-fade over it.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const state = useRef<HeroState>(createHeroState());
  const [fallback, setFallback] = useState(false);

  // Boot the Three.js scene lazily (separate chunk, client only).
  useEffect(() => {
    let scene: { dispose(): void } | undefined;
    let cancelled = false;
    import("@/components/three/CellScene").then(({ CellScene, webglAvailable }) => {
      if (cancelled || !host.current) return;
      if (!webglAvailable()) return setFallback(true);
      try {
        scene = new CellScene(host.current, state.current);
      } catch {
        setFallback(true);
      }
    });
    return () => {
      cancelled = true;
      scene?.dispose();
    };
  }, []);

  useGSAP(
    () => {
      const s = state.current;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        s.assemble = 1;
        gsap.set("[data-hero-intro]", { opacity: 1, y: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Intro: particles condense into the cell, title rises.
        const intro = gsap.timeline({ delay: 0.2 });
        intro
          .to(s, { assemble: 1, duration: 3.2, ease: "expo.out" }, 0)
          .fromTo("[data-hero-canvas]", { opacity: 0 }, { opacity: 1, duration: 1.6, ease: "power2.out" }, 0)
          .fromTo(
            "[data-hero-char]",
            { yPercent: 110 },
            { yPercent: 0, duration: 1.4, stagger: 0.035, ease: "expo.out" },
            0.5,
          )
          .fromTo(
            "[data-hero-intro]",
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 1.2, stagger: 0.1, ease: "expo.out" },
            0.9,
          );

        // Scroll story.
        const caps = gsap.utils.toArray<HTMLElement>("[data-hero-caption]");
        const dots = gsap.utils.toArray<HTMLElement>("[data-hero-dot]");
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=380%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        const capIn = (el: HTMLElement, at: number) =>
          tl.fromTo(el, { opacity: 0, y: 60, filter: "blur(12px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, ease: "power2.out" }, at);
        const capOut = (el: HTMLElement, at: number) =>
          tl.to(el, { opacity: 0, y: -60, filter: "blur(12px)", duration: 0.6, ease: "power2.in" }, at);
        const dot = (i: number, at: number) =>
          tl.to(dots, { opacity: (j) => (j === i ? 1 : 0.25), scale: (j) => (j === i ? 1 : 0.7), duration: 0.3 }, at);

        const out = { immediateRender: false };
        tl.fromTo(
          "[data-hero-title]",
          { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
          { opacity: 0, y: -80, scale: 0.94, filter: "blur(14px)", duration: 1.1, ease: "power2.in", ...out },
          0,
        )
          // Start a hair after 0 so the scrubbed timeline's first render doesn't
          // override the intro fade-in of these elements.
          .fromTo("[data-hero-meta]", { opacity: 1, y: 0 }, { opacity: 0, y: -30, duration: 0.6, ...out }, 0.02)
          .fromTo("[data-hero-scroll]", { opacity: 1 }, { opacity: 0, duration: 0.4, ...out }, 0.02)
          .fromTo("[data-hero-rail]", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.6)
          .fromTo(s, { camZ: 8, rotY: 0, lift: 1 }, { camZ: 4.7, rotY: 1.3, lift: 0, duration: 2.2, ease: "power1.inOut", immediateRender: false }, 0)
          .fromTo("[data-hero-scrim]", { opacity: 0 }, { opacity: 1, duration: 0.8, immediateRender: false }, 0.5);

        // Act 1: the cell
        capIn(caps[0], 0.9);
        dot(0, 0.9);
        capOut(caps[0], 2.3);

        // Act 2: burst
        tl.fromTo(s, { morph: 0 }, { morph: 1, duration: 2.1, ease: "power2.inOut", immediateRender: false }, 2.3)
          .to(s, { camZ: 7.4, rotY: 2.6, duration: 2.1, ease: "power2.inOut" }, 2.3);
        capIn(caps[1], 3.0);
        dot(1, 3.0);
        capOut(caps[1], 4.5);

        // Act 3: the code
        tl.to(s, { morph: 2, camZ: 7.0, spin: 2.4, duration: 2.3, ease: "power2.inOut" }, 4.5);
        capIn(caps[2], 5.4);
        dot(2, 5.4);
        capOut(caps[2], 7.4);

        // Hand-off to the next section.
        tl.to(s, { fade: 0.15, camZ: 9.5, spin: 3.6, duration: 1.4, ease: "power1.in" }, 7.4)
          .to("[data-hero-scrim]", { opacity: 0, duration: 0.6 }, 7.6)
          .to("[data-hero-rail]", { opacity: 0, duration: 0.4 }, 7.6)
          .to({}, { duration: 0.3 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const first = site.name.split(" ");

  return (
    <section ref={root} className="relative h-[100svh] w-full overflow-hidden bg-ink" aria-label="Introduction">
      <div ref={host} data-hero-canvas aria-hidden className="absolute inset-0" />
      {fallback && (
        <div
          aria-hidden
          className="absolute inset-0 [background:radial-gradient(40%_45%_at_50%_45%,rgba(94,234,212,0.25),transparent_70%),radial-gradient(30%_35%_at_60%_35%,rgba(167,139,250,0.25),transparent_70%)]"
        />
      )}
      {/* vignette */}
      <div aria-hidden className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_75%_70%_at_50%_45%,transparent_45%,rgba(0,0,0,0.85)_100%)]" />

      {/* Title block */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center px-[var(--gutter)] pb-[clamp(6.5rem,14vh,9rem)] text-center">
        <p data-hero-intro data-hero-meta className="eyebrow mb-5 opacity-0">
          {site.role}
        </p>
        <h1 data-hero-title className="text-[length:var(--text-display)] font-semibold leading-[0.86] tracking-[-0.055em]">
          <span className="sr-only">
            {site.honorific} {site.name}
          </span>
          <span aria-hidden className="flex flex-wrap justify-center gap-x-[0.22em]">
            {first.map((word, w) => (
              <span key={w} className="inline-flex overflow-hidden pb-[0.06em]">
                {word.split("").map((ch, i) => (
                  <span
                    key={i}
                    data-hero-char
                    className="inline-block bg-gradient-to-b from-white via-white to-white/45 bg-clip-text text-transparent"
                  >
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </span>
        </h1>
        <p data-hero-intro data-hero-meta className="mt-6 max-w-xl text-base text-muted opacity-0 md:text-lg">
          {site.tagline}
        </p>
      </div>

      {/* Scroll cue */}
      <div data-hero-scroll data-hero-intro className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 opacity-0">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-dim">Scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-white/10">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent to-teal motion-safe:animate-[scrollcue_1.8s_var(--ease-apple)_infinite]" />
        </span>
      </div>

      {/* Legibility scrim behind captions */}
      <div
        data-hero-scrim
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 [background:linear-gradient(to_top,rgba(0,0,0,0.85),transparent_55%)] md:[background:linear-gradient(to_right,rgba(0,0,0,0.8),rgba(0,0,0,0.35)_40%,transparent_65%)]"
      />

      {/* Story captions */}
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center px-[var(--gutter)] pb-[16vh] md:items-center md:justify-start md:pb-0">
        {heroStory.map((c, i) => (
          <div key={i} data-hero-caption className="absolute max-w-[40rem] text-center opacity-0 md:left-[var(--gutter)] md:text-left">
            <p className="eyebrow mb-4 !text-teal/90">{c.kicker}</p>
            <p className="text-[clamp(2rem,4.6vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-balance">{c.text}</p>
          </div>
        ))}
      </div>

      {/* Chapter rail */}
      <ol data-hero-rail aria-hidden className="absolute right-[var(--gutter)] top-1/2 hidden -translate-y-1/2 flex-col gap-4 opacity-0 md:flex">
        {heroStory.map((c, i) => (
          <li key={i} className="flex items-center justify-end gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">{c.kicker.split("·")[1]}</span>
            <span data-hero-dot className="h-2 w-2 rounded-full bg-teal opacity-25" />
          </li>
        ))}
      </ol>
    </section>
  );
}
