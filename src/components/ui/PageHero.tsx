import type { ReactNode } from "react";
import { SplitHeading } from "./SplitHeading";
import { Reveal } from "./Reveal";
import { GlowField } from "./GlowField";

type Props = { eyebrow: string; title: string; intro?: ReactNode; children?: ReactNode };

/** Shared hero for inner pages: masked headline + glowing backdrop. */
export function PageHero({ eyebrow, title, intro, children }: Props) {
  return (
    <section className="relative overflow-hidden pb-16 pt-[calc(var(--nav-h)+14vh)] md:pb-24">
      <GlowField />
      <div className="container-x relative">
        <Reveal>
          <p className="eyebrow mb-6">{eyebrow}</p>
        </Reveal>
        <SplitHeading
          as="h1"
          trigger="load"
          delay={0.15}
          text={title}
          className="max-w-5xl text-[length:var(--text-hero)] font-semibold leading-[0.98] tracking-[-0.045em] text-balance"
        />
        {intro && (
          <Reveal delay={0.45}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">{intro}</p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
