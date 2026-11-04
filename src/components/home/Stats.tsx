"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { stats } from "@content/site";

/** Big numbers that count up as they enter the viewport. */
export function Stats() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const nums = gsap.utils.toArray<HTMLElement>("[data-count]");
      const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
      if (prefersReducedMotion()) {
        nums.forEach((el) => (el.textContent = fmt(Number(el.dataset.count))));
        gsap.set("[data-stat]", { opacity: 1 });
        return;
      }
      gsap.fromTo(
        "[data-stat]",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, stagger: 0.12, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 75%", once: true } },
      );
      nums.forEach((el, i) => {
        const o = { v: 0 };
        gsap.to(o, {
          v: Number(el.dataset.count),
          duration: 2.2,
          delay: i * 0.12,
          ease: "power3.out",
          onUpdate: () => (el.textContent = fmt(o.v)),
          scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
        });
      });
      gsap.fromTo("[data-stat-line]", { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: root.current, start: "top 75%", once: true } });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative bg-ink py-[clamp(6rem,18vh,11rem)]" aria-label="In numbers">
      <div className="container-x">
        <div className="mb-14 flex items-end justify-between gap-6">
          <h2 className="max-w-xl text-[clamp(1.75rem,3.4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
            A body of work, <span className="text-muted">measured.</span>
          </h2>
          <p className="eyebrow hidden md:block">By the numbers</p>
        </div>
        <div data-stat-line className="h-px origin-left bg-white/15" />
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              data-stat
              className="flex flex-col-reverse border-b border-line py-10 pr-4 odd:border-r odd:pr-6 even:pl-6 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0"
            >
              <dt className="mt-3 text-sm text-muted">{s.label}</dt>
              <dd className="whitespace-nowrap text-[clamp(2.6rem,5.6vw,5rem)] font-semibold leading-none tracking-[-0.05em] tabular-nums">
                <span data-count={s.value} className={i % 2 ? "text-fg" : "text-gradient"}>
                  0
                </span>
                <span className="text-dim">{s.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
