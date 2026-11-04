"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { site } from "@content/site";
import { PillLink } from "@/components/ui/PillLink";

/** Closing statement: oversized type that scales in, with a glow that tracks the pointer. */
export function ContactCTA() {
  const root = useRef<HTMLElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!prefersReducedMotion()) {
        gsap.fromTo(
          "[data-cta-line]",
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, stagger: 0.12, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 70%", once: true } },
        );
        gsap.fromTo(
          "[data-cta-scale]",
          { scale: 0.86 },
          { scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "center center", scrub: true } },
        );
      } else gsap.set("[data-cta-line]", { opacity: 1 });

      const el = root.current;
      if (!el || !glow.current) return;
      const x = gsap.quickTo(glow.current, "x", { duration: 1.2, ease: "power3.out" });
      const y = gsap.quickTo(glow.current, "y", { duration: 1.2, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        x(e.clientX - r.left - r.width / 2);
        y(e.clientY - r.top - r.height / 2);
      };
      el.addEventListener("pointermove", move);
      return () => el.removeEventListener("pointermove", move);
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-ink py-[clamp(8rem,24vh,16rem)]" aria-label="Get in touch">
      <div ref={glow} aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -ml-[30vmax] -mt-[30vmax] h-[60vmax] w-[60vmax] rounded-full opacity-30 [background:radial-gradient(circle,rgba(94,234,212,0.6)_0%,rgba(110,200,235,0.45)_18%,rgba(167,139,250,0.28)_36%,rgba(167,139,250,0.1)_52%,rgba(167,139,250,0.03)_62%,transparent_70%)]" />
      <div data-cta-scale className="container-x relative text-center">
        <p className="eyebrow mb-8">Collaborate · Study · Visit</p>
        <h2 className="text-[length:var(--text-display)] font-semibold leading-[0.88] tracking-[-0.06em]">
          <span className="block overflow-hidden pb-[0.05em]">
            <span data-cta-line className="block">
              Let’s solve
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.12em]">
            <span data-cta-line className="serif-italic text-gradient block pr-[0.05em]">
              something.
            </span>
          </span>
        </h2>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <PillLink href="/contact/">Get in touch</PillLink>
          <PillLink href={`mailto:${site.email}`} variant="ghost" magnetic={false}>
            {site.email}
          </PillLink>
        </div>
      </div>
    </section>
  );
}
