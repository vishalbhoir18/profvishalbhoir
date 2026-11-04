"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Slow-drifting aurora blobs with scroll parallax, used behind page heroes. */
export function GlowField() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.to("[data-blob]", {
        yPercent: (i) => 25 + i * 20,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div data-blob className="absolute -left-[10%] -top-[30%] h-[70vmax] w-[70vmax]">
        <div className="h-full w-full rounded-full opacity-[0.2] [background:radial-gradient(circle,rgba(94,234,212,1)_0%,rgba(94,234,212,0.62)_16%,rgba(94,234,212,0.3)_32%,rgba(94,234,212,0.11)_48%,rgba(94,234,212,0.03)_60%,transparent_70%)] motion-safe:animate-[drift_18s_ease-in-out_infinite_alternate]" />
      </div>
      <div data-blob className="absolute -right-[20%] -top-[10%] h-[60vmax] w-[60vmax]">
        <div className="h-full w-full rounded-full opacity-[0.16] [background:radial-gradient(circle,rgba(167,139,250,1)_0%,rgba(167,139,250,0.62)_16%,rgba(167,139,250,0.3)_32%,rgba(167,139,250,0.11)_48%,rgba(167,139,250,0.03)_60%,transparent_70%)] motion-safe:animate-[drift_22s_ease-in-out_infinite_alternate-reverse]" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-ink" />
    </div>
  );
}
