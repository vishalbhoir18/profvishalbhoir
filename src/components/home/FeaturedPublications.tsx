"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import type { Publication } from "@/lib/publications";
import { typeLabel } from "@/lib/publications";
import { site } from "@content/site";
import { PillLink } from "@/components/ui/PillLink";
import { SplitHeading } from "@/components/ui/SplitHeading";

const accents = ["#5eead4", "#a78bfa", "#f472b6", "#38bdf8"];

/** Sticky stacking cards: each new paper slides over and pushes the last one back. */
export function FeaturedPublications({ items }: { items: Publication[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-fp-card]");
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.to(card.querySelector("[data-fp-inner]"), {
          scale: 0.9,
          opacity: 0.35,
          filter: "blur(2px)",
          ease: "none",
          scrollTrigger: { trigger: next, start: "top bottom", end: "top 20%", scrub: true },
        });
      });
    },
    { scope: root },
  );

  const owner = site.name.split(" ").pop() ?? "";

  return (
    <section ref={root} className="relative bg-ink py-[clamp(6rem,16vh,10rem)]" aria-label="Selected publications">
      <div className="container-x">
        <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-4">Selected work</p>
            <SplitHeading text="Recent papers from *the lab.*" className="text-[length:var(--text-section)] font-semibold leading-[1] tracking-[-0.045em]" />
          </div>
          <PillLink href="/publications/" variant="ghost">
            All publications
          </PillLink>
        </div>

        <div className="relative">
          {items.map((p, i) => (
            <article key={p.id} data-fp-card className="sticky mb-[8vh]" style={{ top: `calc(var(--nav-h) + 4vh + ${i * 22}px)` }}>
              <div
                data-fp-inner
                className="relative origin-top overflow-hidden rounded-[28px] border border-line bg-surface p-7 md:p-12"
                style={{ boxShadow: "0 -20px 60px -20px rgba(0,0,0,0.8)" }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-25 blur-3xl"
                  style={{ background: accents[i % accents.length] }}
                />
                <div className="relative grid gap-8 md:grid-cols-[auto_1fr] md:gap-14">
                  <div className="flex items-baseline gap-4 md:flex-col md:gap-2">
                    <span className="text-[clamp(3rem,6vw,5rem)] font-semibold leading-none tracking-[-0.05em] tabular-nums" style={{ color: accents[i % accents.length] }}>
                      {p.year}
                    </span>
                    <span className="eyebrow">{typeLabel[p.type]}</span>
                  </div>
                  <div>
                    <h3 className="text-[clamp(1.4rem,2.6vw,2.25rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-balance">{p.title}</h3>
                    <p className="mt-4 text-sm text-muted">
                      {p.authors.map((a, k) => (
                        <span key={k} className={a.includes(owner) ? "text-fg" : undefined}>
                          {a}
                          {k < p.authors.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </p>
                    <p className="mt-1 text-sm italic text-dim">{p.venue}</p>
                    {p.abstract && <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-fg/75">{p.abstract}</p>}
                    {p.doi && (
                      <a
                        href={`https://doi.org/${p.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex items-center gap-2 text-sm text-teal hover:underline"
                      >
                        doi:{p.doi} ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
