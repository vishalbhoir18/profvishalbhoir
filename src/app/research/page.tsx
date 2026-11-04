import type { Metadata } from "next";
import { projects } from "@content/site";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { PillLink } from "@/components/ui/PillLink";
import { StickyThemes } from "@/components/pages/StickyThemes";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Research",
  description: "Antifungal drug discovery, microbial metabolites, resistance mechanisms, synergy and formulation.",
};

export default function ResearchPage() {
  return (
    <>
      <PageHero
        eyebrow="Research"
        title="From soil to *solution.*"
        intro="We follow promising molecules all the way: from the microbes and plants that make them, through how they kill a pathogen, to a formulation that could reach a patient."
      />

      <StickyThemes />

      <section className="border-t border-line py-28">
        <div className="container-x">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow mb-4">Funded projects</p>
              <SplitHeading text="Grants & *projects.*" className="text-[length:var(--text-section)] font-semibold leading-[1] tracking-[-0.045em]" />
            </div>
          </div>
          <Reveal selector="[data-item]" as="ul" className="border-t border-line">
            {projects.map((p) => (
              <li data-item key={p.title} className="grid gap-3 border-b border-line py-8 md:grid-cols-[1fr_auto] md:items-center md:gap-10">
                <div>
                  <p className="text-xl font-medium leading-snug tracking-tight md:text-2xl">{p.title}</p>
                  <p className="mt-2 text-sm text-muted">
                    {p.role} · {p.funder}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm text-dim">{p.years}</span>
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs",
                      p.status === "Ongoing" ? "border-teal/40 bg-teal/10 text-teal" : "border-white/15 text-muted",
                    )}
                  >
                    {p.status}
                  </span>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="py-28">
        <div className="container-x">
        <Reveal className="flex flex-col items-start justify-between gap-10 rounded-[32px] border border-line bg-surface p-10 md:flex-row md:items-center md:p-16">
          <div>
            <h2 className="text-[clamp(1.8rem,3.5vw,3rem)] font-semibold leading-tight tracking-[-0.035em]">Interested in collaborating?</h2>
            <p className="mt-3 max-w-xl text-muted">We welcome partnerships with clinicians, chemists, formulation scientists and industry.</p>
          </div>
          <PillLink href="/contact/">Start a conversation</PillLink>
        </Reveal>
        </div>
      </section>
    </>
  );
}
