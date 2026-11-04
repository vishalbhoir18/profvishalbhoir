"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { asset } from "@/lib/utils";

/** A framed image that expands to full-bleed as you scroll (masked reveal). */
export function ImageReveal() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set("[data-ir-frame]", { clipPath: "inset(0% 0% 0% 0% round 0px)" });
        gsap.set("[data-ir-copy]", { opacity: 1 });
        return;
      }
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "+=170%", pin: true, scrub: 1, anticipatePin: 1 },
      });
      tl.fromTo(
        "[data-ir-frame]",
        { clipPath: "inset(22% 26% 22% 26% round 36px)" },
        { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1 },
      )
        .fromTo("[data-ir-img]", { scale: 1.45 }, { scale: 1, duration: 1 }, 0)
        .fromTo("[data-ir-title]", { scale: 1, opacity: 1 }, { scale: 1.6, opacity: 0, duration: 0.55 }, 0)
        .fromTo("[data-ir-copy]", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.4 }, 0.75)
        .to({}, { duration: 0.25 });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative h-[100svh] overflow-hidden bg-ink" aria-label="Under the microscope">
      <div data-ir-frame className="absolute inset-0 overflow-hidden" style={{ clipPath: "inset(22% 26% 22% 26% round 36px)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-ir-img
          src={asset("/images/hyphae-wide.webp")}
          alt="False-colour micrograph of fungal hyphae and yeast cells forming a biofilm."
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/40" />
      </div>
      <h2
        data-ir-title
        className="pointer-events-none absolute inset-0 grid place-items-center px-[var(--gutter)] text-center text-[clamp(2.4rem,7vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.05em]"
      >
        <span>
          A world invisible <br /> <span className="serif-italic text-gradient">to the eye.</span>
        </span>
      </h2>
      <div data-ir-copy className="absolute inset-x-0 bottom-0 opacity-0">
        <div className="container-x grid gap-6 pb-[10vh] md:grid-cols-2 md:items-end">
          <p className="text-[clamp(1.75rem,3.6vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
            Biofilms are cities. <br />
            <span className="text-fg/60">We learn how to evict them.</span>
          </p>
          <p className="max-w-md text-base leading-relaxed text-fg/75 md:justify-self-end">
            When Candida switches from yeast to filaments it builds biofilms that shrug off most antifungals. Understanding that switch, and how to block it, is central to
            our work.
          </p>
        </div>
      </div>
    </section>
  );
}
