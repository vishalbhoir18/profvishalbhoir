"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { site } from "@content/site";
import { asset } from "@/lib/utils";

/** Portrait card with a scroll-driven inner parallax and a reveal wipe. */
export function Portrait() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(root.current, { clipPath: "inset(100% 0% 0% 0% round 28px)" }, {
        clipPath: "inset(0% 0% 0% 0% round 28px)",
        duration: 1.6,
        ease: "expo.inOut",
        scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
      });
      gsap.fromTo("[data-pt-inner]", { yPercent: -8, scale: 1.15 }, {
        yPercent: 8,
        scale: 1.15,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] border border-line bg-surface">
      {site.portrait ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img data-pt-inner src={asset(site.portrait)} alt={`Portrait of ${site.honorific} ${site.name}`} className="h-full w-full object-cover" />
      ) : (
        <div data-pt-inner className="relative grid h-full w-full place-items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/images/research-yeast.webp")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 [background:radial-gradient(circle_at_50%_40%,transparent,#000_80%)]" />
          <div className="relative text-center">
            <p className="text-[clamp(5rem,12vw,9rem)] font-semibold leading-none tracking-[-0.06em] text-gradient">{site.shortName}</p>
            <p className="eyebrow mt-4">Portrait coming soon</p>
          </div>
        </div>
      )}
    </div>
  );
}
