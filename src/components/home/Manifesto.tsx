"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { manifesto } from "@content/site";

/** Apple-style paragraph whose words light up as you scroll through it. */
export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  // Parse *emphasis* spans into flagged words.
  let em = false;
  const words = manifesto.split(" ").map((raw) => {
    const starts = raw.startsWith("*");
    if (starts) em = true;
    const accent = em;
    if (raw.replace(/[.,;:!?]+$/, "").endsWith("*")) em = false;
    return { text: raw.replace(/\*/g, ""), accent };
  });

  useGSAP(
    () => {
      const els = gsap.utils.toArray<HTMLElement>("[data-hl]");
      if (prefersReducedMotion()) {
        els.forEach((el) => (el.style.color = el.dataset.hl === "1" ? "#5eead4" : "#f5f5f7"));
        return;
      }
      gsap.to(els, {
        color: (i, el: HTMLElement) => (el.dataset.hl === "1" ? "#5eead4" : "#f5f5f7"),
        ease: "none",
        stagger: 0.1,
        scrollTrigger: { trigger: "[data-hl-wrap]", start: "top 78%", end: "bottom 42%", scrub: 0.6 },
      });
      gsap.fromTo(
        "[data-hl-eyebrow]",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, scrollTrigger: { trigger: root.current, start: "top 80%", once: true } },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative bg-ink py-[clamp(7rem,22vh,14rem)]" aria-label="Why it matters">
      <div className="container-x">
        <p data-hl-eyebrow className="eyebrow mb-10">Why it matters</p>
        <p
          data-hl-wrap
          className="max-w-[22ch] text-[clamp(2rem,5.2vw,4.6rem)] font-semibold leading-[1.06] tracking-[-0.04em] md:max-w-[26ch]"
        >
          {words.map((w, i) => (
            <span key={i} data-hl={w.accent ? "1" : "0"} className="hl-word">
              {w.text}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
