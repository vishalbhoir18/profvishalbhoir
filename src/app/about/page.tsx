import type { Metadata } from "next";
import { about, site } from "@content/site";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { PillLink } from "@/components/ui/PillLink";
import { Timeline } from "@/components/pages/Timeline";
import { Portrait } from "@/components/pages/Portrait";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { asset } from "@/lib/utils";

export const metadata: Metadata = { title: "About", description: about.intro };

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About" title="Curious about the *invisible.*" intro={about.intro} />

      <section className="container-x grid gap-14 pb-28 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
        <Portrait />
        <Reveal selector="[data-item]" className="flex flex-col justify-center">
          <p data-item className="eyebrow mb-6">
            {site.role} · {site.institution}
          </p>
          {about.bio.map((para, i) => (
            <p data-item key={i} className="mb-6 text-xl leading-relaxed text-fg/85 md:text-2xl md:leading-[1.45]">
              {para}
            </p>
          ))}
          <div data-item className="mt-4 flex flex-wrap gap-4">
            {site.cvPath && (
              <PillLink href={asset(site.cvPath)} download>
                Download CV
              </PillLink>
            )}
            <PillLink href="/contact/" variant="ghost">
              Get in touch
            </PillLink>
          </div>
        </Reveal>
      </section>

      <section className="border-t border-line py-28">
        <div className="container-x grid gap-16 md:grid-cols-[0.8fr_1.2fr]">
          <div className="md:sticky md:top-[calc(var(--nav-h)+3rem)] md:self-start">
            <p className="eyebrow mb-4">Journey</p>
            <SplitHeading text="The path *so far.*" className="text-[length:var(--text-section)] font-semibold leading-[1] tracking-[-0.045em]" />
          </div>
          <Timeline items={about.timeline} />
        </div>
      </section>

      <section className="border-t border-line py-28">
        <div className="container-x grid gap-16 md:grid-cols-2">
          <div>
            <p className="eyebrow mb-8">Honours & awards</p>
            <Reveal selector="[data-item]" as="ul" className="space-y-px">
              {about.honours.map((h) => (
                <li data-item key={h.title} className="flex items-baseline gap-6 border-b border-line py-6">
                  <span className="font-mono text-sm text-teal">{h.year}</span>
                  <span>
                    <span className="block text-lg font-medium tracking-tight">{h.title}</span>
                    <span className="text-sm text-muted">{h.by}</span>
                  </span>
                </li>
              ))}
            </Reveal>
          </div>
          <div>
            <p className="eyebrow mb-8">Memberships & service</p>
            <Reveal selector="[data-item]" as="ul">
              {about.memberships.map((m) => (
                <li data-item key={m} className="border-b border-line py-6 text-lg tracking-tight text-fg/90">
                  {m}
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
