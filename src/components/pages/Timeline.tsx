"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Item = { year: string; title: string; place: string };

/** Vertical timeline whose spine draws itself as you scroll. */
export function Timeline({ items }: { items: Item[] }) {
  const root = useRef<HTMLOListElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set("[data-tl-item]", { opacity: 1 });
        return;
      }
      gsap.fromTo(
        "[data-tl-line]",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom 60%", scrub: true } },
      );
      gsap.utils.toArray<HTMLElement>("[data-tl-item]").forEach((el) => {
        gsap.fromTo(el, { opacity: 0.15, x: 30 }, {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 72%", toggleActions: "play none none reverse" },
        });
        gsap.fromTo(el.querySelector("[data-tl-dot]"), { scale: 0.4, backgroundColor: "#2a2a2e" }, {
          scale: 1,
          backgroundColor: "#5eead4",
          boxShadow: "0 0 24px #5eead4",
          duration: 0.6,
          scrollTrigger: { trigger: el, start: "top 72%", toggleActions: "play none none reverse" },
        });
      });
    },
    { scope: root },
  );

  return (
    <ol ref={root} className="relative ml-2 space-y-14 border-l border-transparent pl-10 md:ml-0 md:pl-14">
      <span aria-hidden className="absolute left-0 top-0 h-full w-px bg-white/10" />
      <span aria-hidden data-tl-line className="absolute left-0 top-0 h-full w-px origin-top [background:linear-gradient(to_bottom,#5eead4,#a78bfa,#f472b6)]" />
      {items.map((it) => (
        <li key={it.year + it.title} data-tl-item data-reveal className="relative">
          <span data-tl-dot aria-hidden className="absolute -left-10 top-2 -ml-[5px] h-[11px] w-[11px] rounded-full md:-left-14" />
          <p className="font-mono text-sm tracking-[0.15em] text-teal">{it.year}</p>
          <p className="mt-2 text-[clamp(1.4rem,2.6vw,2.1rem)] font-semibold leading-tight tracking-[-0.03em]">{it.title}</p>
          <p className="mt-1 text-muted">{it.place}</p>
        </li>
      ))}
    </ol>
  );
}
